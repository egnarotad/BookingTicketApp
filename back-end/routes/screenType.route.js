const express = require('express');
const screenTypeRouter = express.Router();
const { getAllScreenTypes, getScreenTypeById } = require('../controllers/screenType.controller');

/**
 * @swagger
 * /api/screentypes:
 *   get:
 *     summary: Get all screen types
 *     tags: [ScreenType]
 *     responses:
 *       200:
 *         description: List of screen types
 */
screenTypeRouter.get('/', getAllScreenTypes);

/**
 * @swagger
 * /api/screentypes/{id}:
 *   get:
 *     summary: Get screen type by ID
 *     tags: [ScreenType]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ScreenType ID
 *     responses:
 *       200:
 *         description: ScreenType data
 *       404:
 *         description: ScreenType not found
 */
screenTypeRouter.get('/:id', getScreenTypeById);

module.exports = screenTypeRouter; 