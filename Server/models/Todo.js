const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: String,
  dueDate: Date,
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Low',
  },
  tags: [String],
  isCompleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Todo', todoSchema);
