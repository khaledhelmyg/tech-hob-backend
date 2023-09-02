const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: [true, "event required"],
      minlength: [3, "Too short event name"],
      maxlengtht: [32, "Too long event name"],
    },
    description: {
      type: String,
      trim: true,
      require: [true, "event required"],
      minlength: [3, "Too short event name"],
    },
    status: {
      type: String,
      enum: ["deleted", "draft", "published"],
      default: "published",
    },
    attendance: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    image: String,
  },
  { timestamps: true }
);

const EventModel = mongoose.model("Event", eventSchema);
module.exports = EventModel;
