const mongoose = require('mongoose');
const { Schema } = mongoose;

const cinemaSchema = new Schema({
  Name: { type: String, required: true },
  PlaceID: { type: Schema.Types.ObjectId, ref: 'Place', required: true },
  StatusID: { type: Schema.Types.ObjectId, ref: 'Status'}
}, { timestamps: true });

module.exports = mongoose.model('Cinema', cinemaSchema);
