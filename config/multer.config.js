const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

const uploadMiddleware = upload.fields([
  { name: "image", maxCount: 1 },
  { name: "post_image", maxCount: 1 },
  { name: "category_image", maxCount: 1 },
  { name: "event_image", maxCount: 1 },
]);
module.exports = uploadMiddleware;
