const Genre = require('../models/genre.model');

exports.getAllGenres = async (req, res, next) => {
  try {
    const genres = await Genre.find();
    res.json(genres);
  } catch (err) {
    next(err);
  }
};

exports.getGenreById = async (req, res, next) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre) return res.status(404).json({ message: 'Genre not found' });
    res.json(genre);
  } catch (err) {
    next(err);
  }
};