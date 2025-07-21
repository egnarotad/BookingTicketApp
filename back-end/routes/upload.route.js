const express = require('express');
const multer = require('multer');
const path = require('path');
const { uploadAvatar, deleteAvatar } = require('../controllers/upload.controller');
const { jwtAuth } = require('../middleware/auth');

const router = express.Router();

// Cấu hình lưu file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Thư mục lưu file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Tên file duy nhất
  }
});
const upload = multer({ storage: storage });

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     summary: Upload user avatar
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *       400:
 *         description: No file uploaded
 */
router.post('/avatar', jwtAuth, upload.single('avatar'), uploadAvatar);

/**
 * @swagger
 * /api/upload/avatar:
 *   delete:
 *     summary: Delete user avatar
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Avatar deleted successfully
 *       400:
 *         description: No url provided or invalid url
 */
router.delete('/avatar', jwtAuth, deleteAvatar);

module.exports = router;
