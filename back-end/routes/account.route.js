const express = require('express');
const { login, register, getAllAccounts } = require('../controllers/account.controller');
const { jwtAuth } = require('../middleware/auth');
const accountRouter = express.Router();

accountRouter.use(express.json());
/**
 * @swagger
 * /api/accounts/register:
 *   post:
 *     summary: Register a new account
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               mail:
 *                 type: string
 *               phone:
 *                 type: string
 *               placeId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Register successful
 *       400:
 *         description: Validation error
 */
accountRouter.post('/register', register);

/**
 * @swagger
 * /api/accounts/login:
 *   post:
 *     summary: Login with phone and password
 *     tags: [Account]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
accountRouter.post('/login', login);

/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Get all accounts
 *     tags: [Account]
 *     responses:
 *       200:
 *         description: List of accounts
 */
accountRouter.get('/', jwtAuth, (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
  getAllAccounts(req, res, next);
});

module.exports = accountRouter; 