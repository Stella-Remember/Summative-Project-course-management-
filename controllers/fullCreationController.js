const { User, Facilitator, CourseOffering, ActivityTracker } = require('../models');

exports.createFullActivityRecord = async (req, res) => {
  const t = await User.sequelize.transaction(); // start transaction
  try {
    // 1. Create user
    const user = await User.create(req.body.userData, { transaction: t });

    // 2. Create facilitator linked to user
    const facilitator = await Facilitator.create({
      user_id: user.id,
      ...req.body.facilitatorData
    }, { transaction: t });

    // 3. Create course offering linked to facilitator
    const courseOffering = await CourseOffering.create({
      facilitator_id: facilitator.id,
      ...req.body.courseOfferingData
    }, { transaction: t });

    // 4. Create activity tracker linked to course offering
    const activityTracker = await ActivityTracker.create({
      allocation_id: courseOffering.id,
      ...req.body.activityTrackerData
    }, { transaction: t });

    await t.commit(); // commit if all went well

    return res.status(201).json({
      user,
      facilitator,
      courseOffering,
      activityTracker
    });
  } 
  
  catch (error) {
  console.error('Full error:', error);

  if (error.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: error.errors.map(e => ({
        field: e.path,
        message: e.message,
      })),
    });
  }
  
  return res.status(500).json({
    message: 'Server error',
    error: error.message,
    stack: error.stack,
  });
}}
