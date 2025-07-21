const mongoose = require('mongoose');
const { Schema } = mongoose;

const invoiceSchema = new Schema({
  UserID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  Date: { type: Date, default: Date.now },
  TotalPrice: { type: Number, required: true },
  TicketID: { type: Schema.Types.ObjectId, ref: 'Ticket', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
