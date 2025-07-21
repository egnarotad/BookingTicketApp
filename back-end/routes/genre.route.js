const express = require('express');
const genreRouter = express.Router();
const { getAllGenres, getGenreById } = require('../controllers/genre.controller');

/**
 * @swagger
 * /api/genres:
 *   get:
 *     summary: Get all genres
 *     tags: [Genre]
 *     responses:
 *       200:
 *         description: List of genres
 */
genreRouter.get('/', getAllGenres);

/**
 * @swagger
 * /api/genres/{id}:
 *   get:
 *     summary: Get genre by ID
 *     tags: [Genre]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Genre ID
 *     responses:
 *       200:
 *         description: Genre data
 *       404:
 *         description: Genre not found
 */
genreRouter.get('/:id', getGenreById);

module.exports = genreRouter; 