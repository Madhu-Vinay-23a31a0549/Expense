const express = require("express");
const Expense = require("../models/Expense");
const Category = require("../models/Category");
const protect = require("../middleware/auth.middleware");

const router = express.Router();

// CREATE EXPENSE
router.post("/", protect, async (req, res) => {
  try {
    const { amount, description, category, expense_date } = req.body;

    if (!amount || !category || !expense_date) {
      return res.status(400).json({
        success: false,
        message: "Amount, category, and expense date are required"
      });
    }

    let categoryDoc = await Category.findOne({ name: category });

    if (!categoryDoc) {
      categoryDoc = await Category.create({
        name: category,
        icon: "",
        color: "#1F4E79"
      });
    }

    const expense = await Expense.create({
      user_id: req.user._id,
      category_id: categoryDoc._id,
      amount,
      description,
      expense_date
    });

    const populatedExpense = await Expense.findById(expense._id).populate(
      "category_id",
      "name icon color"
    );

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense: populatedExpense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add expense",
      error: error.message
    });
  }
});

// GET ALL EXPENSES OF LOGGED-IN USER
router.get("/", protect, async (req, res) => {
  try {
    const expenses = await Expense.find({
      user_id: req.user._id,
      deleted_at: null
    })
      .populate("category_id", "name icon color")
      .sort({ expense_date: -1 });

    res.json({
      success: true,
      count: expenses.length,
      expenses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch expenses",
      error: error.message
    });
  }
});

// UPDATE EXPENSE
router.put("/:id", protect, async (req, res) => {
  try {
    const { amount, description, category, expense_date } = req.body;

    const expense = await Expense.findOne({
      _id: req.params.id,
      user_id: req.user._id,
      deleted_at: null
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    if (category) {
      let categoryDoc = await Category.findOne({ name: category });

      if (!categoryDoc) {
        categoryDoc = await Category.create({
          name: category,
          icon: "",
          color: "#1F4E79"
        });
      }

      expense.category_id = categoryDoc._id;
    }

    if (amount) expense.amount = amount;
    if (description !== undefined) expense.description = description;
    if (expense_date) expense.expense_date = expense_date;

    await expense.save();

    const updatedExpense = await Expense.findById(expense._id).populate(
      "category_id",
      "name icon color"
    );

    res.json({
      success: true,
      message: "Expense updated successfully",
      expense: updatedExpense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update expense",
      error: error.message
    });
  }
});

// DELETE EXPENSE
router.delete("/:id", protect, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user_id: req.user._id,
      deleted_at: null
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found"
      });
    }

    expense.deleted_at = new Date();
    await expense.save();

    res.json({
      success: true,
      message: "Expense deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete expense",
      error: error.message
    });
  }
});

module.exports = router;