import mongoose, { Schema } from 'mongoose';

const songSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    singer: {
      type: [String],
    },
    img: {
      type: String, //file path
    },
    language: {
      type: [String],
      lowercase: true,
    },
    lyrics: {
      type: String,
      default: null,
    },
    category: [
      {
        type: String,
      },
    ],
    tags: {
      type: {},
    },
    genere: {
      type: String,
      trim: true,
      enum: ['Pop', 'Rock', 'Hip-Hop', 'Classicals', 'Jazz', 'Electronic', 'Country', 'Other'],
    },
    duration: {
      type: Number, //Duration in seconds
    },
    likes: {
      type: Number,
      default: 0,
    },
    plays: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    timesPlayed: {
      type: Number,
      default: 0,
    },
    lastPlayed: {
      type: Date,
    },
    url: {
      type: String,
    },
    ready: {
      type: Boolean,
      default: false,
    },
    releasedAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Song = mongoose.model('Song', songSchema);
