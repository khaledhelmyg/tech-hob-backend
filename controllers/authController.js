const User = require("../models/user.model");
const crypto = require("crypto");
const { StatusCodes } = require("http-status-codes");
const axios = require("axios");
const CustomError = require("../errors/index");
const Email = require("../utilities/email");
const catchAsync = require("../utilities/catchAsync");
const AppError = require("../utilities/appError");
const {
  createToken,
  isTokenValid,
  attachCookieToResponse,
  neededPayload,
} = require("../services/userServices");
// =============================================
const register = async (req, res) => {
  // using google recaptcha
  const {
    user_name,
    email,
    password,
    passwordConfirm,
    profileName,
    role,
    //recaptchaToken,
  } = req.body;
  console.log(req.body);
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  if (
    !email ||
    !password ||
    !user_name ||
    !passwordConfirm ||
    !profileName ||
    !role
  ) {
    throw new CustomError.BadRequestError("All fields must be provided");
  }
  // try {
  //   const response = await axios.post(
  //     "https://www.google.com/recaptcha/api/siteverify",
  //     {
  //       secret: secretKey,
  //       response: recaptchaToken,
  //     }
  //   );
  // if (response.data.success)
  //{
  const isAdminEmail = email === process.env.ADMIN_EMAIL;
  try {
    const newUser = await User.create({
      user_name: user_name,
      email,
      password,
      passwordConfirm,
      profile: {
        name: profileName,
      },
      role,
      is_admin: isAdminEmail,
      createdAt: new Date(Date.now()),
    });

    const payload = neededPayload(newUser);
    payload.role = newUser.role;
    payload.is_admin = newUser.is_admin;
    // create token and attach cookie
    attachCookieToResponse({ res, payload });
    res.status(StatusCodes.CREATED).json({ user: payload });
    // } else {
    //   // The reCAPTCHA verification failed.
    //   res
    //     .status(StatusCodes.BAD_REQUEST)
    //     .json({ message: "Failed to verify reCAPTCHA" });
    // }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error.message);
    res.status(500).json({ message: "An error occurred" });
  }
};
// =============================================
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new CustomError.BadRequestError("All fields must be provided");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new CustomError.NotFoundError("No user with this Email");
  }
  const isMatch = await user.correctPassword(password);
  if (!isMatch) {
    throw new CustomError.UnauthorizedError("Wrong password");
  }
  const payload = neededPayload(user);
  attachCookieToResponse({ res, payload });
  res.status(StatusCodes.OK).json({ user: payload });
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.send("logout user");
    //res.redirect('/') home page
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError("There is no user with such email address!!", 404)
    );
  }
  const resetToken = await user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //FIXME:
  try {
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/reset-password/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset(res);
    res.status(200).json({
      status: "success",
      message: "reset token sent to your email",
      resetToken,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err);
    return next(
      new AppError(
        "There was an error sending the email , Try again Later! ",
        500
      )
    );
  }
});

const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Token is Invalid or Has Expired", 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const payload = neededPayload(user);
  // create token and attach cookie
  attachCookieToResponse({ res, payload });
  res.status(StatusCodes.CREATED).json({ user: payload });
});

module.exports = { register, login, logout, forgotPassword, resetPassword };
