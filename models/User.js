const mongoose = require("mongoose");

module.exports = mongoose.model(
  "User",
  new mongoose.Schema({
    userId: Number,
    username: String,
    firstName: String,
    premium: {
      type: Boolean,
      default: false
    },
    referrals: {
      type: Number,
      default: 0
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  })
);
