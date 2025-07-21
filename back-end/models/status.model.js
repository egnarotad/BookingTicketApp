const mongoose = require('mongoose');
const { Schema } = mongoose;

const statusSchema = new Schema({
  StatusName: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Status', statusSchema);
