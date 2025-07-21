const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  Name: { type: String, required: true },
  DateofBirth: { type: Date },
  Mail: { type: String, required: true, unique: true },
  PhoneNumber: { type: String, required: true },
  PlaceID: { type: Schema.Types.ObjectId, ref: 'Place' },
  avatar: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
