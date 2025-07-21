const TimeSlot = require('../models/timeslot.model');

exports.getAllTimeSlots = async (req, res, next) => {
  try {
    const timeslots = await TimeSlot.find();
    res.status(200).json(timeslots);
  } catch (err) {
    next(err);
  }
};

exports.getTimeSlotById = async (req, res, next) => {
  try {
    const timeslot = await TimeSlot.findById(req.params.id);
    if (!timeslot) return res.status(404).json({ message: 'Timeslot not found' });
    res.status(200).json(timeslot);
  } catch (err) {
    next(err);
  }
}; 