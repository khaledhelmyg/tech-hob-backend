const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const { authenticationUser } = require("../middlewares/authentication");
const { forgotPassword } = require("../controllers/authController");

const { login, register, logout } = require("../controllers/authController");
router.route("/login").post(login);
router.route("/register").post(register);
router.post("/logout", authenticationUser, logout);
router.post("/forgot-password", forgotPassword);

module.exports = router;
