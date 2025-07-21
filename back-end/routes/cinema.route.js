const express = require('express');
const cinemaRouter = express.Router();
const { getCinemasByPlace, getAllCinemas, updateCinemaStatus, updateCinema, addCinema } = require('../controllers/cinema.controller');
const { jwtAuth } = require('../middleware/auth');

/**
 * @swagger
 * /api/cinemas:
 *   get:
 *     summary: Get cinemas by place
 *     tags: [Cinema]
 *     parameters:
 *       - in: query
 *         name: placeId
 *         schema:
 *           type: string
 *         required: false
 *         description: Place ID to filter cinemas
 *     responses:
 *       200:
 *         description: List of cinemas
 */
cinemaRouter.get('/', getCinemasByPlace);

/**
 * @swagger
 * /api/cinemas/all:
 *   get:
 *     summary: Get all cinemas
 *     tags: [Cinema]
 *     responses:
 *       200:
 *         description: List of all cinemas
 */
cinemaRouter.get('/all', getAllCinemas);

/**
 * @swagger
 * /api/cinemas/{id}:
 *   put:
 *     summary: Update cinema by ID
 *     tags: [Cinema]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Cinema ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               PlaceID:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cinema updated
 *       404:
 *         description: Cinema not found
 */
cinemaRouter.put('/:id', jwtAuth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  updateCinema(req, res, next);
});

/**
 * @swagger
 * /api/cinemas:
 *   post:
 *     summary: Add a new cinema
 *     tags: [Cinema]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               PlaceID:
 *                 type: string
 *               StatusID:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cinema created
 *       400:
 *         description: Validation error
 */
cinemaRouter.post('/', jwtAuth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  addCinema(req, res, next);
});

/**
 * @swagger
 * /api/cinemas/{id}/status:
 *   patch:
 *     summary: Update cinema status
 *     tags: [Cinema]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Cinema ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               statusId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cinema status updated
 *       404:
 *         description: Cinema not found
 */
cinemaRouter.patch('/:id/status', jwtAuth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  updateCinemaStatus(req, res, next);
});

module.exports = cinemaRouter; 