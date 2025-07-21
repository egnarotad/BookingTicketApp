const mongoose = require('mongoose');
const { Schema } = mongoose;

const ticketSchema = new Schema({
  UserID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  ScreeningID: { type: Schema.Types.ObjectId, ref: 'Screening', required: true },
  SeatID: [{ type: Schema.Types.ObjectId, ref: 'Seat', required: true }],
  date: {
    date: { type: Number }, // ngày (số)
    day: { type: String }   // thứ (Mon, Tue,...)
  }
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);
