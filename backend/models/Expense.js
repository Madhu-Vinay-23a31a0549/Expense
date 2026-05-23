const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01
    },

    description: {
      type: String,
      maxlength: 500,
      default: ""
    },

    expense_date: {
      type: Date,
      required: true
    },

    deleted_at: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Expense", expenseSchema);