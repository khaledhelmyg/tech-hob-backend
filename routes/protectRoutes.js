const express = require("express");
const router = express.Router();

const { authenticationUser } = require("../middlewares/authentication.js");

const { isAdmin, isUser, isVisitor } = require("../middlewares/authorization");

const {
  adminGetUserData,
  deleteUser,
  updateUserProfile,
  updateUserPassword,
} = require("../controllers/userController");

// Admin-only route
router.get(
  "/admin/",
  authenticationUser,
  isAdmin,
  adminGetUserData.getAllUsers
);
router.patch(
  "/admin/updateProfile/:id",
  authenticationUser,
  isAdmin,
  updateUserProfile
);
router.put(
  "/admin/updatePassword/:id",
  authenticationUser,
  isAdmin,
  updateUserPassword
);
router.delete("/admin/deleteUser/:id", authenticationUser, isAdmin, deleteUser);

// User and Admin route
// Users and Admins can interactive(like, comment) blog posts

// Visitor route

module.exports = router;
