const mongoose = require('mongoose');
const { Schema } = mongoose;

const roomSchema = new Schema({
  Name: { type: String, required: true },
  Capacity: { type: Number, required: true },
  CinemaID: { type: Schema.Types.ObjectId, ref: 'Cinema', required: true },
  StatusID: { type: Schema.Types.ObjectId, ref: 'Status'}
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
