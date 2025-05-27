const Todo = require('../models/Todo.js');

// CREATE
const createTodo = async (req, res) => {
  try {
    console.log("Create Todo - Req.user:", req.user);
    const newTodo = new Todo({ ...req.body, userId: req.user.id });
    const saved = await newTodo.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error in createTodo:", err.message);
    res.status(500).json({ error: err.message });
  }
};

const getTodos = async (req, res) => {
  try {
    console.log("Get Todos - Req.user:", req.user);
    const todos = await Todo.find({ userId: req.user.id }).sort({ dueDate: 1 });
    res.status(200).json(todos);
  } catch (err) {
    console.error("Error in getTodos:", err.message);
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
