const express = require("express");
const router = express.Router();
const { authenticationUser } = require("../middlewares/authentication.js");
const {
  createReview,
  getMyReviews,
  getParentReviews,
} = require("../controllers/review.controllers.js");

router.get("/", authenticationUser, getMyReviews);
router.post("/", authenticationUser, createReview);
router.get("/:parentId", getParentReviews);

module.exports = router;
