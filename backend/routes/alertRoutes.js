const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");
const authMiddleware = require("../middleware/authMiddleware");

// 🔴 Create SOS Alert
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    const alert = new Alert({
      userEmail: req.user.email,
      latitude,
      longitude,
      status: "pending",
    });

    await alert.save();
    res.status(201).json(alert);
  } catch (error) {
    console.error("Create Alert Error:",error);
    res.status(500).json({ message: "Error creating alert" });
  }
});

// 📜 Get All Alerts
router.get("/", authMiddleware, async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching alerts" });
  }
});

// ✅ Accept Alert (Volunteer)
router.put("/accept/:id", authMiddleware, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      {
        status: "accepted",
        responder: req.user.email,
      },
      { new: true }
    );
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: "Error accepting alert" });
  }
});

// ✔️ Resolve Alert
router.put("/resolve/:id", authMiddleware, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { new: true }
    );
    res.json(alert);
  } catch (error) {
    res.status(500).json({ message: "Error resolving alert" });
  }
});

// 🗑️ Delete Alert (Admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    
    await Alert.findByIdAndDelete(req.params.id); 
    res.json({ message: "Alert deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting alert" });
  }
});

module.exports = router;