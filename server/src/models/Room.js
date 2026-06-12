import mongoose from "mongoose";

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

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

const Room = mongoose.model("Room", RoomSchema);
export default Room;
