const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const CustomError = require("../errors/index");

//for admin : Dashboard
const adminGetUserData = {
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Cannot fetching users." });
    }
  },
};

// delete user (for admins)
const deleteUser = async (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  try {
    const deleteUser = await User.findByIdAndDelete({ _id: userId });

    if (!deleteUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Cannot deleting user" });
  }
};

//get user data
const getUserData = async (req, res) => {
  try {
    await User.findById(req.params.id).then((userFound) => {
      if (!userFound) {
        return res.status(404).json({ message: "No user found" });
      } else {
        return res.status(200).json(userFound);
      }
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

// allow user to ubdate
const updateUserProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const { user_name, email, profileName } = req.body;
    if (!user_name || !email || !profileName) {
      throw new CustomError.BadRequestError("All fields must be provided");
    }
    const user = await User.findOneAndUpdate(
      { _id: id },
      {
        user_name: user_name,
        email: email,
        profile: {
          name: profileName,
        },
      }
    );
    return res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "An error occurred" });
  }
};

// update user password
const updateUserPassword = async (req, res) => {
  const id = req.params.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      throw new CustomError.BadRequestError("No user found");
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({ message: "Incorrect current password" });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { _id: id },
      { $set: { password: hashedNewPassword } }
    );
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred" });
  }
};

module.exports = {
  adminGetUserData,
  deleteUser,
  getUserData,
  updateUserProfile,
  updateUserPassword,
};
