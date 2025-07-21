const mongoose = require('mongoose');
const { Schema } = mongoose;

const genreSchema = new Schema({
  Name: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Genre', genreSchema);
