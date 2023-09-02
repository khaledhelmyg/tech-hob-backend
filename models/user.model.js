const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: [true, "You must provide a name"],
  },
  email: {
    type: String,
    required: [true, "You must provide an email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email!"],
  },
  profile: {
    name: {
      type: String,
      required: [true, "You must provide a name"],
    },
    avatar: {
      type: String,
      default: "default.jpg", //Set the default Image url here
    },
    bio: {
      type: String,
    },
  },
  last_active: Date,
  is_active: {
    type: Boolean,
    default: true,
    select: false,
  },
  role : {
    type: String,
    enum : ["admin", "user", "visitor"],
    default : "user"
  },
  is_admin: {
    type: Boolean,
    default: false
  },
  created_at: Date,
  updated_at: Date,
  deleted_at: Date,
  password: {
    type: String,
    required: [true, "You must provide a password "],
    match: [
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, //Minimum six characters, at least one letter and one number
      "Please provide a valid password",
    ],
    select: true,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password "],
    validate: {
      //This only works on save .create() || .save()
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  posts: [{ type: mongoose.Schema.ObjectId, ref: "blog_post" }],
  following_categories: [{ type: mongoose.Schema.ObjectId, ref: "category" }],
  following_users: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  saved_posts: [{ type: mongoose.Schema.ObjectId, ref: "blog_post" }],
});

//Before Save , Check if the password is NOT Modified, then hash it and save into the db.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

//Before Save , Check if the password is NOT Modified, then update passwordChangedAt to the now date minus 1 Second which is the time taken to handle the request.
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  console.log(resetToken);
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
