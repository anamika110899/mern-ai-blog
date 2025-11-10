const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

//  REGISTER
router.post("/register", async (req, res) => {
  try {
    console.log(" Incoming Request Body:", req.body);
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    //  FIXED: role variable removed
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "writer", // default value
    });

    await newUser.save();
    console.log(" User saved successfully!");
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(" Registration Error:", err);
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
});


//  LOGIN
router.post("/login", async (req, res) => {
  try {
    console.log(" Login request:", req.body);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log("👤 Found user:", user);

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(" Password match:", isMatch);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    console.error(" Login Error:", err);
    res.status(500).json({ message: "Login failed" });
  }
});


module.exports = router;
