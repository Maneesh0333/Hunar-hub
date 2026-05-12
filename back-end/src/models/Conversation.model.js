import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participantsKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      validate: [(arr) => arr.length === 2, "Only 2 participants allowed"],
    },
    lastMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

const Conversation =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);

export default Conversation;
