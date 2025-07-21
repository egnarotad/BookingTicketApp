const Room = require('../models/room.model');

exports.getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    next(err);
  }
};

exports.getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.status(200).json(room);
  } catch (err) {
    next(err);
  }
};

exports.addRoom = async (req, res, next) => {
  try {
    const { Name, Capacity, CinemaID, StatusID } = req.body;
    if (!Name || !Capacity || !CinemaID) {
      return res.status(400).json({ message: 'Missing required fields!' });
    }
    const room = new Room({ Name, Capacity, CinemaID, StatusID });
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    next(err);
  }
};

exports.updateRoomStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { statusId } = req.body;
    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: 'Room not found' });
    room.StatusID = statusId;
    await room.save();
    res.status(201).json(room);
  } catch (err) {
    next(err);
  }
}; 