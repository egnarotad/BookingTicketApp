const Cinema = require('../models/cinema.model');

exports.getCinemasByPlace = async (req, res, next) => {
  try {
    const { placeId } = req.query;
    const cinemas = await Cinema.find({ PlaceID: placeId }).populate('PlaceID').populate('StatusID');
    res.status(200).json(cinemas);
  } catch (err) {
    next(err);
  }
};

exports.getAllCinemas = async (req, res) => {
  try {
    const cinemas = await Cinema.find().populate('PlaceID').populate('StatusID');
    res.status(200).json(cinemas);
  } catch (err) {
    next(err);
  }
};

exports.updateCinemaStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { statusId } = req.body;
    const cinema = await Cinema.findById(id);
    if (!cinema) return res.status(404).json({ message: 'Cinema not found' });
    cinema.StatusID = statusId;
    await cinema.save();
    res.status(201).json(cinema);
  } catch (err) {
    next(err);
  }
};

exports.updateCinema = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { Name, PlaceID } = req.body;
    const cinema = await Cinema.findById(id);
    if (!cinema) return res.status(404).json({ message: 'Cinema not found' });
    if (Name) cinema.Name = Name;
    if (PlaceID) cinema.PlaceID = PlaceID;
    await cinema.save();
    res.status(201).json(cinema);
  } catch (err) {
    next(err);
  }
};

exports.addCinema = async (req, res, next) => {
  try {
    const { Name, PlaceID, StatusID } = req.body;
    if (!Name || !PlaceID) {
      return res.status(400).json({ message: 'Missing required fields!' });
    }
    const cinema = new Cinema({ Name, PlaceID, StatusID });
    await cinema.save();
    res.status(201).json(cinema);
  } catch (err) {
    next(err);
  }
}; 