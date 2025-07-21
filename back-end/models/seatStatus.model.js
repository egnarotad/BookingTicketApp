const mongoose = require('mongoose');
const { Schema } = mongoose;

const seatStatusSchema = new Schema({
    ScreeningID: {
        type: Schema.Types.ObjectId,
        ref: 'Screening',
        required: true
    },
    SeatID: {
        type: Schema.Types.ObjectId,
        ref: 'Seat',
        required: true
    },
    StatusID: {
        type: Schema.Types.ObjectId,
        ref: 'Status',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('SeatStatus', seatStatusSchema);