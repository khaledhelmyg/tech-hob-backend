require("dotenv").config();
require("express-async-errors");
const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const cors = require("cors");

// ================ DB  =======================
const connectDB = require("./config/db");
// ==============   ROUTES   ======================
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/usersRoutes");
const postsRouter = require("./routes/postsRoutes");
const dashboardRouter = require("./routes/protectRoutes");
const eventRouter = require("./routes/eventRoutes");
const categoryRouter = require("./routes/category.routes");
const reviewRouter = require("./routes/review.routes");

// ============   PACKAGES   =======================
const cookieParser = require("cookie-parser");
// ===========    MIDDLEWARES   =================
const notFound = require("./middlewares/not-found");
const errorHandlerMiddleware = require("./middlewares/error-handler");
// ===========================================
// express app
const app = express();
// Middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/event", eventRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/review", reviewRouter);

app.use(notFound);
app.use(errorHandlerMiddleware);
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode:${process.env.NODE_ENV}`);
}

const PORT = process.env.PORT || 8000;
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log(`Sever is up on port: ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};
start();
