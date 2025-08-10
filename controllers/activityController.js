const { ActivityTracker } = require('../models');

exports.getAllActivities = async (req, res) => {
  try {
    const activities = await ActivityTracker.findAll();
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getActivityById = async (req, res) => {
  try {
    const activity = await ActivityTracker.findByPk(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    res.json(activity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createActivity = async (req, res) => {
  try {
    const activity = await ActivityTracker.create(req.body);
    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
};

exports.updateActivity = async (req, res) => {
  try {
    const activity = await ActivityTracker.findByPk(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    await activity.update(req.body);
    res.json(activity);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
};

exports.deleteActivity = async (req, res) => {
  try {
    const activity = await ActivityTracker.findByPk(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    await activity.destroy();
    res.json({ message: 'Activity deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
