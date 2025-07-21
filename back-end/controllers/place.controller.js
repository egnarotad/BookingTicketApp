const Place = require('../models/place.model');

exports.getAllPlaces = async (req, res, next) => {
  try {
    const places = await Place.find();
    res.status(200).json(places);
  } catch (err) {
    next(err);
  }
};