const express = require('express');
const { body, query } = require('express-validator');
const { CourseOffering, Module, Class, Cohort, Facilitator, Mode, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /api/courses/offerings:
 *   post:
 *     summary: Create a new course offering (Manager only)
 *     tags: [Course Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - module_id
 *               - class_id
 *               - cohort_id
 *               - facilitator_id
 *               - mode_id
 *               - trimester
 *               - intake_period
 *               - start_date
 *               - end_date
 *             properties:
 *               module_id:
 *                 type: integer
 *               class_id:
 *                 type: integer
 *               cohort_id:
 *                 type: integer
 *               facilitator_id:
 *                 type: integer
 *               mode_id:
 *                 type: integer
 *               trimester:
 *                 type: string
 *                 enum: ['1', '2', '3']
 *               intake_period:
 *                 type: string
 *                 enum: ['HT1', 'HT2', 'FT']
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               max_enrollment:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Course offering created successfully
 *       400:
 *         description: Validation errors
 *       403:
 *         description: Access denied
 */
router.post('/offerings', authenticate, authorize('manager'), [
  body('module_id').isInt({ min: 1 }),
  body('class_id').isInt({ min: 1 }),
  body('cohort_id').isInt({ min: 1 }),
  body('facilitator_id').isInt({ min: 1 }),
  body('mode_id').isInt({ min: 1 }),
  body('trimester').isIn(['1', '2', '3']),
  body('intake_period').isIn(['HT1', 'HT2', 'FT']),
  body('start_date').isISO8601(),
  body('end_date').isISO8601(),
  body('max_enrollment').optional().isInt({ min: 1, max: 100 })
], handleValidationErrors, async (req, res) => {
  try {
    const offering = await CourseOffering.create(req.body);
    
    const fullOffering = await CourseOffering.findByPk(offering.id, {
      include: [
        { model: Module, as: 'module' },
        { model: Class, as: 'class' },
        { model: Cohort, as: 'cohort' },
        { model: Facilitator, as: 'facilitator', include: [{ model: User }] },
        { model: Mode, as: 'mode' }
      ]
    });

    res.status(201).json({
      success: true,
      message: 'Course offering created successfully',
      data: { offering: fullOffering }
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        message: 'A course offering with these details already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/courses/offerings:
 *   get:
 *     summary: Get course offerings with filters
 *     tags: [Course Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: trimester
 *         schema:
 *           type: string
 *           enum: ['1', '2', '3']
 *       - in: query
 *         name: cohort_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: intake_period
 *         schema:
 *           type: string
 *           enum: ['HT1', 'HT2', 'FT']
 *       - in: query
 *         name: facilitator_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: mode_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Course offerings retrieved successfully
 */
router.get('/offerings', authenticate, [
  query('trimester').optional().isIn(['1', '2', '3']),
  query('cohort_id').optional().isInt({ min: 1 }),
  query('intake_period').optional().isIn(['HT1', 'HT2', 'FT']),
  query('facilitator_id').optional().isInt({ min: 1 }),
  query('mode_id').optional().isInt({ min: 1 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], handleValidationErrors, async (req, res) => {
  try {
    const { trimester, cohort_id, intake_period, facilitator_id, mode_id, page = 1, limit = 10 } = req.query;
    
    const where = { is_active: true };
    
    // Apply filters
    if (trimester) where.trimester = trimester;
    if (cohort_id) where.cohort_id = cohort_id;
    if (intake_period) where.intake_period = intake_period;
    if (mode_id) where.mode_id = mode_id;
    
    // For facilitators, only show their own offerings
    if (req.user.role === 'facilitator') {
      const facilitator = await Facilitator.findOne({ where: { user_id: req.user.id } });
      where.facilitator_id = facilitator.id;
    } else if (facilitator_id) {
      where.facilitator_id = facilitator_id;
    }

    const offset = (page - 1) * limit;
    
    const { count, rows: offerings } = await CourseOffering.findAndCountAll({
      where,
      include: [
        { model: Module, as: 'module' },
        { model: Class, as: 'class' },
        { model: Cohort, as: 'cohort' },
        { model: Facilitator, as: 'facilitator', include: [{ model: User }] },
        { model: Mode, as: 'mode' }
      ],
      limit: parseInt(limit),
      offset,
      order: [['start_date', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        offerings,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/courses/offerings/{id}:
 *   get:
 *     summary: Get a specific course offering
 *     tags: [Course Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course offering retrieved successfully
 *       404:
 *         description: Course offering not found
 */
router.get('/offerings/:id', authenticate, async (req, res) => {
  try {
    const offering = await CourseOffering.findByPk(req.params.id, {
      include: [
        { model: Module, as: 'module' },
        { model: Class, as: 'class' },
        { model: Cohort, as: 'cohort' },
        { model: Facilitator, as: 'facilitator', include: [{ model: User }] },
        { model: Mode, as: 'mode' }
      ]
    });

    if (!offering) {
      return res.status(404).json({
        success: false,
        message: 'Course offering not found'
      });
    }

    // Check if facilitator can only view their own offerings
    if (req.user.role === 'facilitator') {
      const facilitator = await Facilitator.findOne({ where: { user_id: req.user.id } });
      if (offering.facilitator_id !== facilitator.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      data: { offering }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/courses/offerings/{id}:
 *   put:
 *     summary: Update a course offering (Manager only)
 *     tags: [Course Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               facilitator_id:
 *                 type: integer
 *               mode_id:
 *                 type: integer
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               max_enrollment:
 *                 type: integer
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Course offering updated successfully
 *       404:
 *         description: Course offering not found
 */
router.put('/offerings/:id', authenticate, authorize('manager'), async (req, res) => {
  try {
    const offering = await CourseOffering.findByPk(req.params.id);
    
    if (!offering) {
      return res.status(404).json({
        success: false,
        message: 'Course offering not found'
      });
    }

    await offering.update(req.body);
    
    const updatedOffering = await CourseOffering.findByPk(offering.id, {
      include: [
        { model: Module, as: 'module' },
        { model: Class, as: 'class' },
        { model: Cohort, as: 'cohort' },
        { model: Facilitator, as: 'facilitator', include: [{ model: User }] },
        { model: Mode, as: 'mode' }
      ]
    });

    res.json({
      success: true,
      message: 'Course offering updated successfully',
      data: { offering: updatedOffering }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

/**
 * @swagger
 * /api/courses/offerings/{id}:
 *   delete:
 *     summary: Delete a course offering (Manager only)
 *     tags: [Course Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course offering deleted successfully
 *       404:
 *         description: Course offering not found
 */
router.delete('/offerings/:id', authenticate, authorize('manager'), async (req, res) => {
  try {
    const offering = await CourseOffering.findByPk(req.params.id);
    
    if (!offering) {
      return res.status(404).json({
        success: false,
        message: 'Course offering not found'
      });
    }

    await offering.destroy();

    res.json({
      success: true,
      message: 'Course offering deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;