const mongoose = require('mongoose');
const { Schema } = mongoose;

const screenTypeSchema = new Schema({
  TypeName: { type: String, required: true },
  Price: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('ScreenType', screenTypeSchema);
