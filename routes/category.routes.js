const express = require("express");
const router = express.Router();
const { authenticationUser } = require("../middlewares/authentication.js");
const { createCategory } = require("../controllers/categoryController.js");

// router.get("/", DisplayAllPostsCtrl);
// router.get("/search", searchInBlogBosts);
// router.get("/:id", DisplayPostCtrl);
router.post("/create", authenticationUser, createCategory);
// router.put("/update/:id", authenticationUser, UpdatePostCtrl);
// router.delete("/delete/:id", authenticationUser, DeletePostCtrl);

module.exports = router;
