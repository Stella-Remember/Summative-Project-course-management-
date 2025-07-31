const express = require('express');
const { body, query } = require('express-validator');
const { ActivityTracker, CourseOffering, Module, Facilitator, User } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');
const { queueNotification } = require('../services/notificationservice');

const router = express.Router();

/**
 * @swagger
 * /api/activities:
 *   post:
 *     summary: Create or update activity tracker entry (Facilitator only)
 *     tags: [Activity Tracking]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - allocation_id
 *               - week_number
 *             properties:
 *               allocation_id:
 *                 type: integer
 *               week_number:
 *                 type: integer
 *               attendance:
 *                 type: array
 *                 items:
 *                   type: boolean
 *               formative_one_grading:
 *                 type: string
 *                 enum: ['Done', 'Pending', 'Not Started']
 *               formative_two_grading:
 *                 type: string
 *                 enum: ['Done', 'Pending', 'Not Started']
 *               summative_grading:
 *                 type: string
 *                 enum: ['Done', 'Pending', 'Not Started']
 *               course_moderation:
 *                 type: string
 *                 enum: ['Done', 'Pending', 'Not Started']
 *               intranet_sync:
 *                 type: string
 *                 enum: ['Done', 'Pending', 'Not Started']
 *               grade_book_status:
 *                 type: string
 *                 enum: ['Done', 'Pending', 'Not Started']
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Activity tracker entry created successfully
 *       200:
 *         description: Activity tracker entry updated successfully
 */
router.post('/', authenticate, authorize('facilitator'), [
  body('allocation_id').isInt({ min: 1 }),
  body('week_number').isInt({ min: 1, max: 52 }),
  body('attendance').optional().isArray(),
  body('formative_one_grading').optional().isIn(['Done', 'Pending', 'Not Started']),
  body('formative_two_grading').optional().isIn(['Done', 'Pending', 'Not Started']),
  body('summative_grading').optional().isIn(['Done', 'Pending', 'Not Started']),
  body('course_moderation').optional().isIn(['Done', 'Pending', 'Not Started']),
  body('intranet_sync').optional().isIn(['Done', 'Pending', 'Not Started']),
  body('grade_book_status').optional().isIn(['Done', 'Pending', 'Not Started']),
  body('notes').optional().isString()
], handleValidationErrors, async (req, res) => {
  try {
    const facilitator = await Facilitator.findOne({ where: { user_id: req.user.id } });
    
    // Verify the facilitator owns this course offering
    const courseOffering = await CourseOffering.findOne({
      where: {
        id: req.body.allocation_id,
        facilitator_id: facilitator.id
      }
    });

    if (!courseOffering) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only manage activities for your assigned courses.'
      });
    }

    const [activity, created] = await ActivityTracker.upsert({
      ...req.body,
      submitted_at: new Date()
    });

    // Queue notification to manager about submission
    await queueNotification({
      type: 'activity_submitted',
      facilitatorId: facilitator.id,
      activityId: activity.id,
      week: req.body.week_number
    });

    const fullActivity = await ActivityTracker.findByPk(activity.id, {
      include: [
        {
          model: CourseOffering,
          as: 'courseOffering',
          include: [{ model: Module, as: 'module' }]
        }
      ]
    });

    res.status(created ? 201 : 200).json({
      success: true,
      message: `Activity tracker entry ${created ? 'created' : 'updated'} successfully`,
      data: { activity: fullActivity }
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
 * /api/activities:
 *   get:
 *     summary: Get activity tracker entries with filters
 *     tags: [Activity Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: allocation_id
 *         schema:
 *           type: integer
 *       - in: query
 *         name: week_number
 *         schema:
 *           type: integer
 *       - in: query
 *         name: facilitator_id
 *         schema:
 *           type: integer
 *         description: Manager only - filter by facilitator
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
 *         description: Activity tracker entries retrieved successfully
 */
router.get('/', authenticate, [
  query('allocation_id').optional().isInt({ min: 1 }),
  query('week_number').optional().isInt({ min: 1, max: 52 }),
  query('facilitator_id').optional().isInt({ min: 1 }),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], handleValidationErrors, async (req, res) => {
  try {
    const { allocation_id, week_number, facilitator_id, page = 1, limit = 10 } = req.query;
    
    let whereClause = {};
    let includeClause = [
      {
        model: CourseOffering,
        as: 'courseOffering',
        include: [
          { model: Module, as: 'module' },
          { model: Facilitator, as: 'facilitator', include: [{ model: User }] }
        ]
      }
    ];

    // Apply filters based on user role
    if (req.user.role === 'facilitator') {
      const facilitator = await Facilitator.findOne({ where: { user_id: req.user.id } });
      
      // Filter by facilitator's course offerings
      includeClause[0].where = { facilitator_id: facilitator.id };
    } else if (req.user.role === 'manager' && facilitator_id) {
      includeClause[0].where = { facilitator_id };
    }

    if (allocation_id) whereClause.allocation_id = allocation_id;
    if (week_number) whereClause.week_number = week_number;

    const offset = (page - 1) * limit;
    
    const { count, rows: activities } = await ActivityTracker.findAndCountAll({
      where: whereClause,
      include: includeClause,
      limit: parseInt(limit),
      offset,
      order: [['week_number', 'DESC'], ['updated_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        activities,
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
 * /api/activities/{id}:
 *   get:
 *     summary: Get a specific activity tracker entry
 *     tags: [Activity Tracking]
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
 *         description: Activity tracker entry retrieved successfully
 *       404:
 *         description: Activity tracker entry not found
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const activity = await ActivityTracker.findByPk(req.params.id, {
      include: [
        {
          model: CourseOffering,
          as: 'courseOffering',
          include: [
            { model: Module, as: 'module' },
            { model: Facilitator, as: 'facilitator', include: [{ model: User }] }
          ]
        }
      ]
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity tracker entry not found'
      });
    }

    // Check access permissions
    if (req.user.role === 'facilitator') {
      const facilitator = await Facilitator.findOne({ where: { user_id: req.user.id } });
      if (activity.courseOffering.facilitator_id !== facilitator.id) {
        return res.status(403).json({
          success: false,
          message: 'Access denied'
        });
      }
    }

    res.json({
      success: true,
      data: { activity }
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
 * /api/activities/{id}:
 *   put:
 *     summary: Update an activity tracker entry (Facilitator only)
 *     tags: [Activity Tracking]
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
 *               attendance:
 *                 type: array
 *                 items:
 *                   type: boolean
 *               formative_one_grading:
 *                 type: string
 *                 enum: ['Done', 'Pending', 'Not Started']
 *               formative_two_grading:
 *                 type: string
 *                 enum: ['Done', 'Pending', 'Not Started']
 *               summative_grading:
 *                 type: string
 *                 enum: ['Done', 'Pending', 'Not Started']
 *               course_moderation:
 *                 type: string
 *                 enum: ['Done', 'Pending', 'Not Started']
 *               intranet_sync:
 *                 type: string
 *                 enum: ['Done', 'Pending', 'Not Started']
 *               grade_book_status:
 *                 type: string
 *                 enum: ['Done', 'Pending', 'Not Started']
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Activity tracker entry updated successfully
 *       404:
 *         description: Activity tracker entry not found
 */
router.put('/:id', authenticate, authorize('facilitator'), async (req, res) => {
  try {
    const facilitator = await Facilitator.findOne({ where: { user_id: req.user.id } });
    
    const activity = await ActivityTracker.findByPk(req.params.id, {
      include: [{ model: CourseOffering, as: 'courseOffering' }]
    });

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: 'Activity tracker entry not found'
      });
    }

    // Verify ownership
    if (activity.courseOffering.facilitator_id !== facilitator.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await activity.update({
      ...req.body,
      submitted_at: new Date()
    });

    const updatedActivity = await ActivityTracker.findByPk(activity.id, {
      include: [
        {
          model: CourseOffering,
          as: 'courseOffering',
          include: [{ model: Module, as: 'module' }]
        }
      ]
    });

    res.json({
      success: true,
      message: 'Activity tracker entry updated successfully',
      data: { activity: updatedActivity }
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