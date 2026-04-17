const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //Validation
    if (!name || !email || !password)
      return res.status(400).json({ message: "Please enter all fields" });

    // Check if user already exists 
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res
        .status(400).
        json({ message: "User already exists with this email", 
      });

      // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
       name, 
       email, 
       password: hashedPassword,
       role: "user", // Default role
       });

    await user.save();

    res.status(201).json({
      message: "User registered successfully" });
  } catch (err) {
    console.error("Register Error:",err);//Debugging
    res.status(500).json({ 
      message: err.message || "Server error" 
    });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ 
        success: false,
        message: "Invalid email or password" 
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ 
        success: false,
        message: "Invalid email or password" });
      
    const token = jwt.sign(
      { id: user._id, role: user.role },
       process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ 
      success: true,
      token, 
      user 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Server error" });
}
});

module.exports = router;