const mongoose = require("mongoose");

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parentType: {
      type: String,
      enum: ["BlogPost", "Event"],
      required: true,
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "parentType",
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
reviewSchema.pre(["save"], function () {
  this.populate("parent");
});
const ReviewModel = mongoose.model("Review", reviewSchema);
module.exports = ReviewModel;
