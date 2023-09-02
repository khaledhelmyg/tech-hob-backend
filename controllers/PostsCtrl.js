const asyncHandler = require("express-async-handler");
const BlogPost = require("../models/blogPost.model");
const SearchHelper = require("../utilities/search.helper.utils.js");
const { uploadFileAndGetSignedUrl } = require("../services/gcp.service");

const DisplayPostCtrl = asyncHandler(async (req, res) => {
  const Posts = await BlogPost.findById(req.params.id);
  res.json({
    success: true,
    message: "Posts Fetched Successfully",
    Posts,
  });
});
// search blogposts get limited data with skip and filttration with sort
const searchInBlogBosts = asyncHandler(async (req, res, next) => {
  let searchHelper = new SearchHelper(BlogPost.find(), req.query)
    .paginate()
    .filter()
    .fields()
    .search()
    .sort();

  //? execute query
  let result = await searchHelper.mongooseQuery.populate([
    { path: "author", select: "name email" },
    { path: "categories", select: "name" },
  ]);
  res.status(200).json({
    message: "get Search Result successfully",
    result,
    page: searchHelper.page,
  });
});

const DisplayAllPostsCtrl = asyncHandler(async (req, res) => {
  let posts = await BlogPost.find().populate("categories");
  //page
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;

  const startIndex = (page - 1) * limit;

  const endIndex = page * limit;

  const total = await BlogPost.countDocuments();

  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  res.json({
    status: "success",
    total,
    pagination,
    results: posts.length,
    message: "Products fetched successfully",
    posts,
  });
});
const CreatePostCtrl = asyncHandler(async (req, res) => {
  let { title, content, categories, status } = req.body;
  try {
    categories = JSON.parse(categories);

    let image_url;
    if (req.files.post_image[0]) {
      console.log(req.files);
      const filePath = req.files.post_image[0].path;
      const destFileName = req.files.post_image[0].originalname;
      const bucketName = "taxi-app-36499.appspot.com";
      const uploadResponse = await uploadFileAndGetSignedUrl(
        filePath,
        destFileName,
        bucketName
      );
      image_url = uploadResponse;
    }
    const Post = await BlogPost.create({
      title,
      content,
      author: req.user.userId,
      categories,
      status,
      image: image_url,
    });
    if (!Post) {
      throw new Error("Invalid Post Data");
    }
    res.json({
      success: true,
      message: "Post Created Successfully",
      Post,
    });
  } catch (err) {
    console.log(err);
  }
});
const UpdatePostCtrl = asyncHandler(async (req, res) => {
  const { title, content, categories } = req.body;
  const Post = await BlogPost.findByIdAndUpdate(req.params.id, {
    title,
    content,
    author,
    categories,
    UpdateAt: Date.now(),
  });
  if (!Post) {
    throw new Error("Post Not Found");
  }
  res.json({
    success: true,
    message: "Post Updated Successfully",
    Post,
  });
});
const DeletePostCtrl = asyncHandler(async (req, res) => {
  const Post = await BlogPost.findByIdAndDelete(req.params.id);
  if (!Post) {
    throw new Error("Post Not Found");
  }
  res.json({
    success: true,
    message: "Post Deleted Successfully",
    Post,
  });
});

module.exports = {
  DisplayPostCtrl,
  CreatePostCtrl,
  UpdatePostCtrl,
  DisplayAllPostsCtrl,
  DeletePostCtrl,
  searchInBlogBosts,
};
