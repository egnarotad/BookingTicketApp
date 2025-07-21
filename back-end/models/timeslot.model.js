const mongoose = require('mongoose');
const { Schema } = mongoose;

const timeslotSchema = new Schema({
  Time: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('TimeSlot', timeslotSchema);
