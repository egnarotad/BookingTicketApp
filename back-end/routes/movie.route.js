const express = require('express');
const movieRouter = express.Router();
const { getAllMovies, getMovieById, searchMovies, addMovie, updateMovie, getActiveMovies, getUpcomingMovies } = require('../controllers/movie.controller');
const { jwtAuth } = require('../middleware/auth');

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Get all movies
 *     tags: [Movie]
 *     responses:
 *       200:
 *         description: List of movies
 */
movieRouter.get('/', getAllMovies);

/**
 * @swagger
 * /api/movies:
 *   post:
 *     summary: Add a new movie
 *     tags: [Movie]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Director:
 *                 type: string
 *               Genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               Premiere:
 *                 type: string
 *                 format: date
 *               Duration:
 *                 type: number
 *               Language:
 *                 type: string
 *               Description:
 *                 type: string
 *               Trailer:
 *                 type: string
 *               PosterPath:
 *                 type: string
 *               BackgroundImagePath:
 *                 type: string
 *               StatusID:
 *                 type: string
 *               VoteAverage:
 *                 type: number
 *               VoteCount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Movie created
 *       400:
 *         description: Validation error
 */
movieRouter.post('/', addMovie);

/**
 * @swagger
 * /api/movies/active:
 *   get:
 *     summary: Get all active movies
 *     tags: [Movie]
 *     responses:
 *       200:
 *         description: List of active movies
 */
movieRouter.get('/active', getActiveMovies);

/**
 * @swagger
 * /api/movies/active:
 *   get:
 *     summary: Get all upcoming movies
 *     tags: [Movie]
 *     responses:
 *       200:
 *         description: List of upcoming movies
 */
movieRouter.get('/upcoming', getUpcomingMovies);

/**
 * @swagger
 * /api/movies/search:
 *   get:
 *     summary: Search movies by name
 *     tags: [Movie]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Movie name to search
 *     responses:
 *       200:
 *         description: List of movies matching the search
 */
movieRouter.get('/search', searchMovies);

/**
 * @swagger
 * /api/movies/{id}:
 *   get:
 *     summary: Get movie by ID
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Movie ID
 *     responses:
 *       200:
 *         description: Movie data
 *       404:
 *         description: Movie not found
 */
movieRouter.get('/:id', getMovieById);

/**
 * @swagger
 * /api/movies/{id}:
 *   put:
 *     summary: Update movie by ID
 *     tags: [Movie]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Movie ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Director:
 *                 type: string
 *               Genres:
 *                 type: array
 *                 items:
 *                   type: string
 *               Premiere:
 *                 type: string
 *                 format: date
 *               Duration:
 *                 type: number
 *               Language:
 *                 type: string
 *               Description:
 *                 type: string
 *               Trailer:
 *                 type: string
 *               PosterPath:
 *                 type: string
 *               BackgroundImagePath:
 *                 type: string
 *               StatusID:
 *                 type: string
 *               VoteAverage:
 *                 type: number
 *               VoteCount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Movie updated
 *       404:
 *         description: Movie not found
 */
movieRouter.put('/:id', jwtAuth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  updateMovie(req, res, next);
});

module.exports = movieRouter; 