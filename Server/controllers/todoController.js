const Todo = require('../models/Todo.js');

// CREATE
const createTodo = async (req, res) => {
  try {
    const newTodo = new Todo({ ...req.body, userId: req.user.id });
    const saved = await newTodo.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// READ
const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id }).sort({ dueDate: 1 });
    res.status(200).json(todos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
const updateTodo = async (req, res) => {
  try {
    const updated = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
const deleteTodo = async (req, res) => {
  try {
    await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.status(200).json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo
};
