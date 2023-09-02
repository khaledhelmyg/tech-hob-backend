const express = require("express");
const router = express.Router();

const { authenticationUser } = require('../middlewares/authentication')
const { getUserData, updateUserProfile, updateUserPassword } = require('../controllers/userController')
const { resetPassword } = require('../controllers/authController');

router.get('/getuser/:id', authenticationUser, getUserData)
router.patch('/updateProfile/:id', authenticationUser, updateUserProfile)
router.put('/updatePassword/:id', authenticationUser, updateUserPassword);
router.patch('/reset-password/:token', resetPassword);

module.exports = router;