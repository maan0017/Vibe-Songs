import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const playlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    discription: String, //optional
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    songs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song',
      },
    ],
    // songs: {
    //   type: {
    //     type: [mongoose.Schema.ObjectId],
    //     ref: 'Song',
    //   },
    //   validate: {
    //     validator: function (songs) {
    //       // Ensures the array has unique values (no duplicate songs)
    //       return Array.isArray(songs) && new Set(songs).size === songs.length;
    //     },
    //     message: 'Songs array contains duplicates',
    //   },
    // },
  },
  { timestamps: true },
);
playlistSchema.plugin(mongooseAggregatePaginate);

export const Playlist = mongoose.model('Playlist', playlistSchema);

// const songSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   artist: { type: String, required: true },
//   duration: { type: Number }, // Duration in seconds
//   url: { type: String }, // Link to the song
// });

// const playlistSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   songs: [songSchema], // Array of song subdocuments
//   createdAt: { type: Date, default: Date.now },
// });

// const Playlist = mongoose.model('Playlist', playlistSchema);
