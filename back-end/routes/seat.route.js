const express = require('express');
const seatRouter = express.Router();
const { getAllSeats, getSeatsByRoomId, addSeatToRoom, removeSeatFromRoom } = require('../controllers/seat.controller');
const { jwtAuth } = require('../middleware/auth');

/**
 * @swagger
 * /api/seats:
 *   get:
 *     summary: Get all seats
 *     tags: [Seat]
 *     responses:
 *       200:
 *         description: List of seats
 */
seatRouter.get('/', getAllSeats);

/**
 * @swagger
 * /api/seats/by-room/{roomId}:
 *   get:
 *     summary: Get seats by room ID
 *     tags: [Seat]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *         description: Room ID
 *     responses:
 *       200:
 *         description: List of seats in the room
 *       400:
 *         description: Missing roomId
 */
seatRouter.get('/by-room/:roomId', getSeatsByRoomId);

/**
 * @swagger
 * /api/seats/{id}/rooms:
 *   post:
 *     summary: Add seat to room
 *     tags: [Seat]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Seat ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               RoomID:
 *                 type: string
 *     responses:
 *       200:
 *         description: Seat updated
 *       404:
 *         description: Seat not found
 */
seatRouter.post('/:id/rooms', jwtAuth, (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    addSeatToRoom(req, res, next);
});

/**
 * @swagger
 * /api/seats/{id}/rooms:
 *   delete:
 *     summary: Remove seat from room
 *     tags: [Seat]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Seat ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               RoomID:
 *                 type: string
 *     responses:
 *       200:
 *         description: Seat updated
 *       404:
 *         description: Seat or room not found
 */
seatRouter.delete('/:id/rooms', jwtAuth, (req, res, next) => {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    removeSeatFromRoom(req, res, next);
});

module.exports = seatRouter; 