const express = require('express');
const ticketRouter = express.Router();
const { createTicket, getTicketsByUser, getTicketById } = require('../controllers/ticket.controller');
const { jwtAuth } = require('../middleware/auth');

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Ticket]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *               ScreeningID:
 *                 type: string
 *               SeatID:
 *                 type: array
 *                 items:
 *                   type: string
 *               date:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: number
 *                   day:
 *                     type: string
 *     responses:
 *       201:
 *         description: Ticket created
 *       400:
 *         description: Validation error
 */
ticketRouter.post('/', jwtAuth, createTicket);

/**
 * @swagger
 * /api/tickets/user/{id}:
 *   get:
 *     summary: Get tickets by user ID
 *     tags: [Ticket]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of tickets for the user
 *       400:
 *         description: Missing userId
 */
ticketRouter.get('/user/:userId', jwtAuth, getTicketsByUser);

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get ticket by ID
 *     tags: [Ticket]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Ticket ID
 *     responses:
 *       200:
 *         description: Ticket data
 *       404:
 *         description: Ticket not found
 */
ticketRouter.get('/:id', getTicketById);

module.exports = ticketRouter; 