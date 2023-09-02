const fileUpload = require("../config/fileUpload.js");
const uploadMiddleware = fileUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "slider_image", maxCount: 1 },
    { name: "category_image", maxCount: 1 },
    { name: "event_image", maxCount: 1 },
    { name: "post_image", maxCount: 1 },
]);
module.exports = uploadMiddleware;