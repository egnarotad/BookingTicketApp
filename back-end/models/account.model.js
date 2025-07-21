const mongoose = require('mongoose');
const { Schema } = mongoose;

const accountSchema = new Schema({
  UserID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  Password: { type: String, required: true },
  Role: { type: String, required: true, default: 'Customer' },
  StatusID: { type: Schema.Types.ObjectId, ref: 'Status'}
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);
