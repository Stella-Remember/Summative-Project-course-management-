const { Class } = require('../models');

exports.getAllClasses = async (req, res) => {
  try {
    const classes = await Class.findAll();
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getClassById = async (req, res) => {
  try {
    const classObj = await Class.findByPk(req.params.id);
    if (!classObj) return res.status(404).json({ message: 'Class not found' });
    res.json(classObj);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createClass = async (req, res) => {
  try {
    const classObj = await Class.create(req.body);
    res.status(201).json(classObj);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
};

exports.updateClass = async (req, res) => {
  try {
    const classObj = await Class.findByPk(req.params.id);
    if (!classObj) return res.status(404).json({ message: 'Class not found' });
    await classObj.update(req.body);
    res.json(classObj);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
};

exports.deleteClass = async (req, res) => {
  try {
    const classObj = await Class.findByPk(req.params.id);
    if (!classObj) return res.status(404).json({ message: 'Class not found' });
    await classObj.destroy();
    res.json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
