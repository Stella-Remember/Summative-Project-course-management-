const { Mode } = require('../models');

exports.getAllModes = async (req, res) => {
  try {
    const modes = await Mode.findAll();
    res.json(modes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getModeById = async (req, res) => {
  try {
    const mode = await Mode.findByPk(req.params.id);
    if (!mode) return res.status(404).json({ message: 'Mode not found' });
    res.json(mode);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createMode = async (req, res) => {
  try {
    const mode = await Mode.create(req.body);
    res.status(201).json(mode);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
};

exports.updateMode = async (req, res) => {
  try {
    const mode = await Mode.findByPk(req.params.id);
    if (!mode) return res.status(404).json({ message: 'Mode not found' });
    await mode.update(req.body);
    res.json(mode);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
};

exports.deleteMode = async (req, res) => {
  try {
    const mode = await Mode.findByPk(req.params.id);
    if (!mode) return res.status(404).json({ message: 'Mode not found' });
    await mode.destroy();
    res.json({ message: 'Mode deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
