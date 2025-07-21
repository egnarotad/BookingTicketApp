const Status = require('../models/status.model');

exports.getAllStatus = async (req, res, next) => {
  try {
    const statusList = await Status.find();
    res.status(200).json(statusList);
  } catch (err) {
    next(err);
  }
};

exports.getStatusById = async (req, res, next) => {
  try {
    const status = await Status.findById(req.params.id);
    if (!status) return res.status(404).json({ message: 'Status not found' });
    res.status(200).json(status);
  } catch (err) {
    next(err);
  }
}; 