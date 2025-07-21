const express = require('express');
const invoiceRouter = express.Router();
const { createInvoice, getAllInvoice } = require('../controllers/invoice.controller');
const { jwtAuth } = require('../middleware/auth');

/**
 * @swagger
 * /api/invoices:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoice]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               UserID:
 *                 type: string
 *               TotalPrice:
 *                 type: number
 *               TicketID:
 *                   type: string
 *     responses:
 *       201:
 *         description: Invoice created
 *       400:
 *         description: Validation error
 */
invoiceRouter.post('/', jwtAuth, createInvoice);

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Invoice]
 *     responses:
 *       200:
 *         description: List of all invoices
 */
invoiceRouter.get('/', jwtAuth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  getAllInvoice(req, res, next);
});

module.exports = invoiceRouter; 