const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "resolved"],
      default: "pending",
    },
    responder: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Alert", alertSchema);