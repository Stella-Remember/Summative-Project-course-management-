const { Cohort } = require('../models');

exports.getAllCohorts = async (req, res) => {
  try {
    const cohorts = await Cohort.findAll();
    res.json(cohorts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getCohortById = async (req, res) => {
  try {
    const cohort = await Cohort.findByPk(req.params.id);
    if (!cohort) return res.status(404).json({ message: 'Cohort not found' });
    res.json(cohort);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.createCohort = async (req, res) => {
  try {
    const cohort = await Cohort.create(req.body);
    res.status(201).json(cohort);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
};

exports.updateCohort = async (req, res) => {
  try {
    const cohort = await Cohort.findByPk(req.params.id);
    if (!cohort) return res.status(404).json({ message: 'Cohort not found' });
    await cohort.update(req.body);
    res.json(cohort);
  } catch (error) {
    res.status(400).json({ message: 'Bad request', error: error.message });
  }
};

exports.deleteCohort = async (req, res) => {
  try {
    const cohort = await Cohort.findByPk(req.params.id);
    if (!cohort) return res.status(404).json({ message: 'Cohort not found' });
    await cohort.destroy();
    res.json({ message: 'Cohort deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
