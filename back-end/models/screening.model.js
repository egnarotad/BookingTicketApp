const mongoose = require('mongoose');
const { Schema } = mongoose;

const screeningSchema = new Schema({
  MovieID: { type: Schema.Types.ObjectId, ref: 'Movie', required: true },
  RoomID: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  ScreenTypeID: { type: Schema.Types.ObjectId, ref: 'ScreenType', required: true },
  TimeSlotID: { type: Schema.Types.ObjectId, ref: 'TimeSlot', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Screening', screeningSchema);
