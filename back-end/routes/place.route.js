const express = require('express');
const placeRouter = express.Router();
const { getAllPlaces } = require('../controllers/place.controller');

/**
 * @swagger
 * /api/places:
 *   get:
 *     summary: Get all places
 *     tags: [Place]
 *     responses:
 *       200:
 *         description: List of places
 */
placeRouter.get('/', getAllPlaces);

module.exports = placeRouter; 