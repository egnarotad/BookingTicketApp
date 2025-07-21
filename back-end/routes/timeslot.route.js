const express = require('express');
const timeslotRouter = express.Router();
const { getAllTimeSlots, getTimeSlotById } = require('../controllers/timeslot.controller');

/**
 * @swagger
 * /api/timeslots:
 *   get:
 *     summary: Get all time slots
 *     tags: [TimeSlot]
 *     responses:
 *       200:
 *         description: List of time slots
 */
timeslotRouter.get('/', getAllTimeSlots);

/**
 * @swagger
 * /api/timeslots/{id}:
 *   get:
 *     summary: Get time slot by ID
 *     tags: [TimeSlot]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: TimeSlot ID
 *     responses:
 *       200:
 *         description: TimeSlot data
 *       404:
 *         description: TimeSlot not found
 */
timeslotRouter.get('/:id', getTimeSlotById);

module.exports = timeslotRouter; 