const mongoose = require("mongoose");
const { Schema } = mongoose;
const BlogPostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    status: {
      type: String,
      enum: ["deleted", "draft", "published"],
    },
    image: {
      type: String,
      required: true,
    },
  },

  {
    timestamps: true,
  }
);
BlogPostSchema.pre(/^find/, function () {
  this.populate([
    {
      path: "author",
      select: "user_name -password",
    },
  ]);
});
const BlogPost = mongoose.model("BlogPost", BlogPostSchema);
module.exports = BlogPost;
