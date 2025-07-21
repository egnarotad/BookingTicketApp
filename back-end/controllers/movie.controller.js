const Movie = require('../models/movie.model');
const Genre = require('../models/genre.model');
const Status = require('../models/status.model')

exports.getAllMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find().populate('Genres').populate('StatusID');
    res.status(200).json(movies);
  } catch (err) {
    next(err);
  }
};

exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id).populate('Genres').populate('StatusID');
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.status(200).json(movie);
  } catch (err) {
    next(err);
  }
};

exports.searchMovies = async (req, res, next) => {
  try {
    const { name } = req.query;
    const movies = await Movie.find({ Name: { $regex: name, $options: 'i' } }).populate('Genres').populate('StatusID');
    res.status(200).json(movies);
  } catch (err) {
    next(err);
  }
};

exports.addMovie = async (req, res, next) => {
  try {
    const { Name, Director, Genres, Premiere, Duration, Language, Description, Trailer, PosterPath, BackgroundImagePath, StatusID, VoteAverage, VoteCount } = req.body;
    // Validate các trường bắt buộc
    if (!Name || !Director || !Genres || !Premiere || !Duration || !Language) {
      return res.status(400).json({ message: 'Missing required fields!' });
    }
    // Kiểm tra duplicate theo Name, Director, Premiere
    const existed = await Movie.findOne({ Name, Director, Premiere });
    if (existed) {
      return res.status(400).json({ message: 'Movie with these details already exists!' });
    }
    const newMovie = new Movie({ Name, Director, Genres, Premiere, Duration, Language, Description, Trailer, PosterPath, BackgroundImagePath, StatusID, VoteAverage, VoteCount });
    await newMovie.save();
    await newMovie.populate('Genres').populate('StatusID');
    res.status(201).json(newMovie);
  } catch (err) {
    next(err);
  }
};

exports.updateMovie = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      Name,
      Director,
      Genres,
      Premiere,
      Duration,
      Language,
      Description,
      Trailer,
      PosterPath,
      BackgroundImagePath,
      StatusID,
      VoteAverage,
      VoteCount
    } = req.body;

    // Validate các trường bắt buộc
    if (!Name || !Director || !Genres || !Premiere || !Duration || !Language) {
      return res.status(400).json({ message: 'Missing required fields!' });
    }

    const movie = await Movie.findById(id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });

    movie.Name = Name;
    movie.Director = Director;
    movie.Genres = Genres;
    movie.Premiere = Premiere;
    movie.Duration = Duration;
    movie.Language = Language;
    movie.Description = Description;
    movie.Trailer = Trailer;
    movie.PosterPath = PosterPath;
    movie.BackgroundImagePath = BackgroundImagePath;
    movie.StatusID = StatusID;
    movie.VoteAverage = VoteAverage;
    movie.VoteCount = VoteCount;

    await movie.save();
    await movie.populate('Genres').populate('StatusID');
    res.status(201).json(movie);
  } catch (err) {
    next(err);
  }
};

exports.getActiveMovies = async (req, res, next) => {
  try {
    // Tìm statusID của status "Active"
    const statusActive = await Status.findOne({ StatusName: 'Active' });
    if (!statusActive) return res.status(404).json({ message: 'Status Active not found' });
    const movies = await Movie.find({ StatusID: statusActive._id }).populate('Genres').populate('StatusID');
    res.status(200).json(movies);
  } catch (err) {
    next(err);
  }
};

exports.getUpcomingMovies = async (req, res, next) => {
  try {
    // Tìm statusID của status "Upcoming"
    const statusActive = await Status.findOne({ StatusName: 'Upcoming' });
    if (!statusActive) return res.status(404).json({ message: 'Status Upcoming not found' });
    const movies = await Movie.find({ StatusID: statusActive._id }).populate('Genres').populate('StatusID');
    res.status(200).json(movies);
  } catch (err) {
    next(err);
  }
}; 