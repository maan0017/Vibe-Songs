import mongoose, { Schema } from 'mongoose';

const followersSchema = new mongoose.Schema(
  {
    followers: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true },
);

export const Subscription = mongoose.model('Subscription', followersSchema);
