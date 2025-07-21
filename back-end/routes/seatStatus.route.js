const express = require('express');
const seatStatusRouter = express.Router();
const { getSeatStatusByScreening, updateSeatStatus } = require('../controllers/seatStatus.controller');

/**
 * @swagger
 * /api/seat-status/by-screening/{screeningId}:
 *   get:
 *     summary: Get seat status by screening
 *     tags: [SeatStatus]
 *     parameters:
 *       - in: path
 *         name: screeningId
 *         schema:
 *           type: string
 *         required: true
 *         description: Screening ID
 *     responses:
 *       200:
 *         description: List of seat status for the screening
 *       400:
 *         description: Missing screeningId param
 */
seatStatusRouter.get('/by-screening/:screeningId', getSeatStatusByScreening);

/**
 * @swagger
 * /api/seat-status/{id}:
 *   patch:
 *     summary: Update seat status
 *     tags: [SeatStatus]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: SeatStatus document ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               StatusID:
 *                 type: string
 *     responses:
 *       200:
 *         description: Seat status updated
 *       400:
 *         description: Missing StatusID
 *       404:
 *         description: SeatStatus not found
 */
seatStatusRouter.patch('/:id', updateSeatStatus);

module.exports = seatStatusRouter; 