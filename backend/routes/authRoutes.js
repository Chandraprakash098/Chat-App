const express = require("express");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const { allUsers } = require("../controllers/userController");
const {protect}=require('../middleware/authMiddleware')

const router = express.Router();

// Register route
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "Please fill all the fields" });
      throw new Error("Please fill all the fields");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      pic,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Failed to create the user" });
      throw new Error("Failed to create the user");
    }
  })
);

// Login route
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
      throw new Error("Invalid email or password");
    }
  })
);

router.route('/').get(protect,allUsers)

module.exports = router;
