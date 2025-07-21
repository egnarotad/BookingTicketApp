const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema({
  Name: { type: String, required: true },
  Director: { type: String, required: true },
  Genres: [{ type: Schema.Types.ObjectId, ref: 'Genre', required: true }],
  Premiere: { type: Date, required: true },
  Duration: { type: Number, required: true },
  Language: { type: String, required: true },
  Description: { type: String },
  Trailer: { type: String },
  PosterPath: { type: String },
  BackgroundImagePath: { type: String },
  StatusID: { type: Schema.Types.ObjectId, ref: 'Status'},
  VoteAverage: { type: Number, default: 0 },
  VoteCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Movie', movieSchema);
