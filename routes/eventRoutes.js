const express = require("express");
const router = express.Router();
const { authenticationUser } = require("../middlewares/authentication.js");
const uploadMiddleware = require("../config/multer.config.js");
const {
  getAllEvents,
  getEvent,
  registerToEvent,
  CreateEventCtrl,
} = require("../controllers/eventController.js");

router.post("/", uploadMiddleware, CreateEventCtrl);
router.get("/", getAllEvents);
router.get("/:id", getEvent);
router.patch("/:id", authenticationUser, registerToEvent);

module.exports = router;
