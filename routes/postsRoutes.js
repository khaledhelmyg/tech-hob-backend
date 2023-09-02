const express = require("express");
const router = express.Router();
const { authenticationUser } = require("../middlewares/authentication.js");
const uploadMiddleware = require("../config/multer.config.js");

const {
  DisplayAllPostsCtrl,
  DisplayPostCtrl,
  CreatePostCtrl,
  UpdatePostCtrl,
  DeletePostCtrl,
  searchInBlogBosts,
} = require("../controllers/PostsCtrl.js");

router.get("/", DisplayAllPostsCtrl);
router.post("/", authenticationUser, uploadMiddleware, CreatePostCtrl);
router.get("/:id", DisplayPostCtrl);
router.put("/update/:id", authenticationUser, UpdatePostCtrl);
router.delete("/delete/:id", authenticationUser, DeletePostCtrl);

module.exports = router;
