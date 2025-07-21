const mongoose = require('mongoose');
const { Schema } = mongoose;

const seatSchema = new Schema({
  Row: { type: String, required: true },
  Number: { type: Number, required: true },
  Rooms: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Seat', seatSchema);
