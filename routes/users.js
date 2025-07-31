const express = require('express');
const { query } = require('express-validator');
const { User, Manager, Facilitator, Student, Cohort } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');
const { handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Manager only)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [manager, facilitator, student]
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
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
 *         description: Users retrieved successfully
 */
router.get('/', authenticate, authorize('manager'), [
  query('role').optional().isIn(['manager', 'facilitator', 'student']),
  query('is_active').optional().isBoolean(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], handleValidationErrors, async (req, res) => {
  try {
    const { role, is_active, page = 1, limit = 10 } = req.query;
    
    const where = {};
    if (role) where.role = role;
    if (is_active !== undefined) where.is_active = is_active === 'true';

    const offset = (page - 1) * limit;
    
    const { count, rows: users } = await User.findAndCountAll({
      where,
      include: [
        { model: Manager, required: false },
        { model: Facilitator, required: false },
        { model: Student, required: false, include: [{ model: Cohort, as: 'cohort' }] }
      ],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        users,
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
 * /api/users/facilitators:
 *   get:
 *     summary: Get all facilitators
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Facilitators retrieved successfully
 */
router.get('/facilitators', authenticate, async (req, res) => {
  try {
    const facilitators = await Facilitator.findAll({
      include: [
        {
          model: User,
          where: { is_active: true }
        }
      ]
    });

    res.json({
      success: true,
      data: { facilitators }
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