const Screening = require('../models/screening.model');
const Seat = require('../models/seat.model');
const SeatStatus = require('../models/seatStatus.model');
const Status = require('../models/status.model');

exports.getAllScreenings = async (req, res, next) => {
  try {
    const screenings = await Screening.find({}).populate('RoomID').populate('ScreenTypeID').populate('TimeSlotID').populate('MovieID');
    res.status(200).json(screenings);
  } catch (err) {
    next(err);
  }
};

exports.getScreeningsByMovieId = async (req, res, next) => {
  try {
    const { movieId } = req.params;
    if (!movieId) return res.status(400).json({ message: 'Missing movieId param' });
    const screenings = await Screening.find({ MovieID: movieId }).populate('RoomID').populate('ScreenTypeID').populate('TimeSlotID').populate('MovieID');
    res.status(200).json(screenings);
  } catch (err) {
    next(err);
  }
};

exports.getScreeningById = async (req, res, next) => {
  try {
    const screening = await Screening.findById(req.params.id).populate('RoomID').populate('ScreenTypeID').populate('TimeSlotID').populate('MovieID');
    if (!screening) return res.status(404).json({ message: 'Screening not found' });
    res.status(200).json(screening);
  } catch (err) {
    next(err);
  }
};

exports.addScreening = async (req, res, next) => {
  try {
    const { MovieID, RoomID, ScreenTypeID, TimeSlotID } = req.body;
    if (!MovieID || !RoomID || !ScreenTypeID || !TimeSlotID) {
      return res.status(400).json({ message: 'Missing required fields!' });
    }
    const existed = await Screening.findOne({
      MovieID,
      RoomID,
      ScreenTypeID,
      TimeSlotID
    });
    if (existed) {
      return res.status(400).json({ message: 'Screening with these details already exists!' });
    }
    const screening = new Screening({ MovieID, RoomID, ScreenTypeID, TimeSlotID });
    await screening.save();
    await screening.populate('RoomID ScreenTypeID TimeSlotID MovieID');

    // Bổ sung: Tạo seatStatus cho tất cả ghế của room
    // 1. Lấy danh sách seat thuộc room
    const seats = await Seat.find({ Rooms: RoomID });
    // 2. Lấy statusId mặc định (Active)
    const availableStatus = await Status.findOne({ StatusName: 'Active' });
    if (!availableStatus) return res.status(500).json({ message: 'Default seat status not found' });
    // 3. Tạo seatStatus cho từng seat
    const seatStatusDocs = seats.map(seat => ({
      ScreeningID: screening._id,
      SeatID: seat._id,
      StatusID: availableStatus._id
    }));
    await SeatStatus.insertMany(seatStatusDocs);

    res.status(201).json(screening);
  } catch (err) {
    next(err);
  }
};

exports.updateScreening = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { MovieID, RoomID, ScreenTypeID, TimeSlotID } = req.body;
    if (!MovieID || !RoomID || !ScreenTypeID || !TimeSlotID) {
      return res.status(400).json({ message: 'Missing required fields!' });
    }
    const screening = await Screening.findById(id);
    if (!screening) return res.status(404).json({ message: 'Screening not found' });
    screening.MovieID = MovieID;
    screening.RoomID = RoomID;
    screening.ScreenTypeID = ScreenTypeID;
    screening.TimeSlotID = TimeSlotID;
    await screening.save();
    await screening.populate('RoomID ScreenTypeID TimeSlotID MovieID');
    res.status(200).json(screening);
  } catch (err) {
    next(err);
  }
}; 