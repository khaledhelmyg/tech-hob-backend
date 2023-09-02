const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      require: [true, "Category required"],
      unique: [true, "Category must be unique"],
      minlength: [3, "Too short Category name"],
      maxlengtht: [32, "Too long Category name"],
    },
    slug: {
      type: String,
      require: true,
      lowercase: true,
    },
    status: { enum: ["deleted", "draft", "published"] },
    blogPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BlogPost",
        required: true,
      },
    ],
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "event",
        required: true,
      },
    ],
  },
  { timestamps: true }
);
const CategoryModel = mongoose.model("Category", categorySchema);
module.exports = CategoryModel;
