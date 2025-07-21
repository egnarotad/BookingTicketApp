const mongoose = require('mongoose');
const { Schema } = mongoose;

const placeSchema = new Schema({
  Name: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Place', placeSchema);
