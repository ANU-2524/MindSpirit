


const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Task = require('../models/Task');

// Analytics: tasks completed per day for current week
router.get('/analytics', auth, async (req, res) => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday
    startOfWeek.setHours(0,0,0,0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    // Get all completed tasks for this user in this week
    const tasks = await Task.find({
      user: req.user.id,
      completed: true,
      updatedAt: { $gte: startOfWeek, $lt: endOfWeek }
    });

    // Count per day (Sun-Sat)
    const completedPerDay = Array(7).fill(0);
    tasks.forEach(task => {
      const d = new Date(task.updatedAt);
      const day = d.getDay(); // 0=Sun, 6=Sat
      completedPerDay[day]++;
    });
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    res.json({ completedPerDay, days });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Get all tasks for user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Create a new task
router.post('/', auth, async (req, res) => {
  const { title, description, dueDate, priority, category } = req.body;
  try {
    const newTask = new Task({
      user: req.user.id,
      title,
      description,
      dueDate,
      priority,
      category,
    });
    const task = await newTask.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Update a task
router.put('/:id', auth, async (req, res) => {
  const { title, description, completed, dueDate, priority, category } = req.body;
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    if (completed !== undefined) task.completed = completed;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (priority !== undefined) task.priority = priority;
    if (category !== undefined) task.category = category;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ msg: 'Task not found' });
    res.json({ msg: 'Task removed' });
  } catch (err) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
