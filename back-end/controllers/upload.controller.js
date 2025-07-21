const fs = require('fs');
const path = require('path');

exports.uploadAvatar = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Đường dẫn public cho client
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.status(200).json({ url: fileUrl });
};

exports.deleteAvatar = (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ message: 'No url provided' });
  }
  // Lấy tên file từ url
  const filename = url.split('/uploads/')[1];
  if (!filename) {
    return res.status(400).json({ message: 'Invalid url' });
  }
  const filePath = path.join(__dirname, '..', 'uploads', filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to delete file', error: err.message });
    }
    res.status(200).json({ message: 'File deleted' });
  });
};
