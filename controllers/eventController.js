const catchAsync = require("../utilities/catchAsync");
const Event = require("../models/event.model");
const AppError = require("../utilities/appError");
const { uploadFileAndGetSignedUrl } = require("../services/gcp.service");
const getAllEvents = catchAsync(async (req, res) => {
  const events = await Event.find();

  //pagination
  const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;

  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;

  const startIndex = (page - 1) * limit;

  const endIndex = page * limit;

  const total = await Event.countDocuments();

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
    results: events.length,
    message: "events fetched successfully",
    events,
  });
});
const getEvent = catchAsync(async (req, res) => {
  const event = await Event.findById(req.params.id).populate("attendance");
  res.json({
    success: true,
    message: "The Event Fetched Successfully.",
    event,
  });
});

const registerToEvent = catchAsync(async (req, res) => {
  const event = await Event.findById(req.params.id);

  if (event.attendance.includes(req.user.userId)) {
    throw new AppError("You registered before!", 409);
  }

  const updatedEvent = await Event.findByIdAndUpdate(req.params.id, {
    $push: {
      attendance: req.user.userId,
    },
  });
  if (!event) {
    throw new AppError("There is no such Event", 404);
  }
  res.json({
    success: true,
    message: "you registered to this Event Successfully",
    updatedEvent,
  });
});
const DisplayEventCtrl = catchAsync(async (req, res) => {
  const eventshown = await event.findById(req.params.id);
  res.json({
    success: true,
    message: "Posts Fetched Successfully",
    eventshown,
  });
});
const DisplayAllEventsCtrl = catchAsync(async (req, res) => {
  let eventQuery = await event.find();
  //Filter by category
  if (req.query.category) {
    eventQuery = eventQuery.find({
      name: { $regex: req.query.category, $options: "i" },
    });
  }
  //Filter by Tag
  if (req.query.tag) {
    eventQuery = eventQuery.find({
      band: { $regex: req.query.tag, $options: "i" },
    });
  }
  res.json({
    status: "success",
    results: eventQuery.length,
    message: "Products fetched successfully",
    eventQuery,
  });
});
const SearchEventCtrl = catchAsync(async (req, res) => {
  const eventfound = await event.find({
    name: { $regex: req.query.name, $options: "i" },
  });
  res.json({
    status: "success",
    total,
    results: event.length,
    message: "Events fetched successfully",
    eventfound,
  });
});
const ScheduleEventCtrl = catchAsync(async (req, res) => {
  const currentDate = new Date();

  collection
    .find({ date: { $lte: currentDate } })
    .toArray((err, outdatedDates) => {
      if (err) {
        console.error("Error querying outdated dates:", err);
        return;
      }
      // Update outdated dates and mark them as finished
      outdatedDates.forEach((date) => {
        collection.updateOne(
          { _id: date._id },
          { $set: { status: "finished" } },
          (updateErr, result) => {
            if (updateErr) {
              console.error("Error updating date:", updateErr);
              return;
            }
            console.log(`Date ${date.date} marked as finished`);
          }
        );
      });
    });
});
const CreateEventCtrl = catchAsync(async (req, res) => {
  let { name, categories, status, description } = req.body;
  categories = JSON.parse(categories);
  let image_url;
  if (req.files.event_image[0]) {
    console.log(req.files);
    const filePath = req.files.event_image[0].path;
    const destFileName = req.files.event_image[0].originalname;
    const bucketName = "taxi-app-36499.appspot.com";
    const uploadResponse = await uploadFileAndGetSignedUrl(
      filePath,
      destFileName,
      bucketName
    );
    image_url = uploadResponse;
  }
  const eventcreated = await Event.create({
    name,
    description,
    status,
    categories,
    image: image_url,
  });
  if (!eventcreated) {
    throw new Error("Invalid Event Data");
  }
  res.json({
    status: "success",
    message: "Event created successfully",
    eventcreated,
  });
});

module.exports = {
  CreateEventCtrl,
  SearchEventCtrl,
  getEvent,
  getAllEvents,
  DisplayEventCtrl,
  DisplayAllEventsCtrl,
  ScheduleEventCtrl,
  registerToEvent,
};
