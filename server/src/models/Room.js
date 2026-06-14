import mongoose from "mongoose";

const MovieSchema = mongoose.Schema(
  {
    movieId: Number,
    title: String,
    overview: String,
    posterUrl: String,
    releaseDate: String,
    rating: Number,
  },
  { _id: false },
);

const SwipeSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    movieId: {
      type: Number,
      required: true,
    },

    liked: {
      type: Boolean,
      required: true,
    },

    swipedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false },
);

const RoomSchema = mongoose.Schema(
  {
    roomCode: {
      type: String,
      required: true,
      unique: true,
    },

    host: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],

    currentSession: {
      status: {
        type: String,
        enum: ["waiting", "active", "completed"],
        default: "waiting",
      },

      movieDeck: [MovieSchema],

      swipes: [SwipeSchema],
      
      matches: [MovieSchema],

      startedAt: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Room = mongoose.model("Room", RoomSchema);
export default Room;
