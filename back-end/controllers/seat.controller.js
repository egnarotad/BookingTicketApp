const Seat = require('../models/seat.model');

exports.getAllSeats = async (req, res, next) => {
  try {
    const seats = await Seat.find().populate('Rooms');
    res.status(200).json(seats);
  } catch (err) {
    next(err);
  }
};

exports.getSeatsByRoomId = async (req, res) => {
  try {
    const roomId = req.query.roomId || req.params.roomId;
    if (!roomId) return res.status(400).json({ message: 'Missing roomId' });
    const seats = await Seat.find({ Rooms: roomId }).populate('Rooms');
    res.status(200).json(seats);
  } catch (err) {
    next(err);
  }
};

// Thêm room vào seat
exports.addSeatToRoom = async (req, res) => {
  try {
    const seatId = req.params.id; // seatId từ route /:id/rooms
    const { RoomID } = req.body;
    const seat = await Seat.findById(seatId);
    if (!seat) return res.status(404).json({ message: 'Seat not found' });
    if (!seat.Rooms.includes(RoomID)) {
      seat.Rooms.push(RoomID);
      await seat.save();
    }
    res.status(200).json(seat);
  } catch (err) {
    next(err);
  }
};

// Xóa room khỏi seat
exports.removeSeatFromRoom = async (req, res) => {
  try {
    const seatId = req.params.id; // seatId từ route /:id/rooms
    const { RoomID } = req.body;
    const seat = await Seat.findById(seatId);
    if (!seat) return res.status(404).json({ message: 'Seat not found' });
    const before = seat.Rooms.length;
    seat.Rooms = seat.Rooms.filter(r => r.toString() !== RoomID);
    if (seat.Rooms.length === before) {
      return res.status(404).json({ message: 'Room not found in seat' });
    }
    await seat.save();
    res.status(200).json(seat);
  } catch (err) {
    next(err);
  }
}; 