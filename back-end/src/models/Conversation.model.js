import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participantsKey: {
      type: String,
      required: true,
      unique: true,
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
  },
  { timestamps: true },
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
