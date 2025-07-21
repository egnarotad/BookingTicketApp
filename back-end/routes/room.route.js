const express = require('express');
const roomRouter = express.Router();
const { getAllRooms, getRoomById, addRoom, updateRoomStatus } = require('../controllers/room.controller');
const { jwtAuth } = require('../middleware/auth');

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Room]
 *     responses:
 *       200:
 *         description: List of rooms
 */
roomRouter.get('/', getAllRooms);

/**
 * @swagger
 * /api/rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags: [Room]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room data
 *       404:
 *         description: Room not found
 */
roomRouter.get('/:id', getRoomById);

/**
 * @swagger
 * /api/rooms:
 *   post:
 *     summary: Add a new room
 *     tags: [Room]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Name:
 *                 type: string
 *               Capacity:
 *                 type: number
 *               CinemaID:
 *                 type: string
 *               StatusID:
 *                 type: string
 *     responses:
 *       201:
 *         description: Room created
 *       400:
 *         description: Validation error
 */
roomRouter.post('/', jwtAuth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  addRoom(req, res, next);
});

/**
 * @swagger
 * /api/rooms/{id}/status:
 *   patch:
 *     summary: Update room status
 *     tags: [Room]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Room ID
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
 *         description: Room status updated
 *       404:
 *         description: Room not found
 */
roomRouter.patch('/:id/status', jwtAuth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  updateRoomStatus(req, res, next);
});

module.exports = roomRouter; 