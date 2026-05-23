const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    icon: {
      type: String,
      default: ""
    },

    color: {
      type: String,
      default: "#1F4E79"
    },

    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Category", categorySchema);