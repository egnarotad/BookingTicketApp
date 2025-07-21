const express = require('express');
const screeningRouter = express.Router();
const { getAllScreenings, getScreeningsByMovieId, getScreeningById, addScreening, updateScreening } = require('../controllers/screening.controller');
const { jwtAuth } = require('../middleware/auth');

/**
 * @swagger
 * /api/screenings:
 *   get:
 *     summary: Get all screenings
 *     tags: [Screening]
 *     responses:
 *       200:
 *         description: List of all screenings
 */
screeningRouter.get('/', getAllScreenings);

/**
 * @swagger
 * /api/screenings/by-movie/{movieId}:
 *   get:
 *     summary: Get screenings by movie ID
 *     tags: [Screening]
 *     parameters:
 *       - in: path
 *         name: movieId
 *         schema:
 *           type: string
 *         required: true
 *         description: Movie ID to filter screenings
 *     responses:
 *       200:
 *         description: List of screenings for the movie
 *       400:
 *         description: Missing movieId param
 */
screeningRouter.get('/by-movie/:movieId', getScreeningsByMovieId);

/**
 * @swagger
 * /api/screenings:
 *   post:
 *     summary: Add a new screening
 *     tags: [Screening]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MovieID:
 *                 type: string
 *               RoomID:
 *                 type: string
 *               ScreenTypeID:
 *                 type: string
 *               TimeSlotID:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Screening created
 *       400:
 *         description: Validation error
 */
screeningRouter.post('/', jwtAuth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  addScreening(req, res, next);
});

/**
 * @swagger
 * /api/screenings/{id}:
 *   get:
 *     summary: Get screening by ID
 *     tags: [Screening]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Screening ID
 *     responses:
 *       200:
 *         description: Screening data
 *       404:
 *         description: Screening not found
 */
screeningRouter.get('/:id', getScreeningById);

/**
 * @swagger
 * /api/screenings/{id}:
 *   put:
 *     summary: Update a screening
 *     tags: [Screening]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Screening ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               MovieID:
 *                 type: string
 *               RoomID:
 *                 type: string
 *               ScreenTypeID:
 *                 type: string
 *               TimeSlotID:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Screening updated
 *       400:
 *         description: Validation error
 *       404:
 *         description: Screening not found
 */
screeningRouter.put('/:id', jwtAuth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  updateScreening(req, res, next);
});

module.exports = screeningRouter; 