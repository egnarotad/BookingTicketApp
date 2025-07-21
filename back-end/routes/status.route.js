const express = require('express');
const statusRouter = express.Router();
const { getAllStatus, getStatusById } = require('../controllers/status.controller');

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Get all status
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: List of status
 */
statusRouter.get('/', getAllStatus);

/**
 * @swagger
 * /api/status/{id}:
 *   get:
 *     summary: Get status by ID
 *     tags: [Status]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Status ID
 *     responses:
 *       200:
 *         description: Status data
 *       404:
 *         description: Status not found
 */
statusRouter.get('/:id', getStatusById);

module.exports = statusRouter; 