const express = require('express');
const {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo
} = require('../controllers/todoController');

const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createTodo);         // Create
router.get('/', auth, getTodos);            // Read all
router.put('/:id', auth, updateTodo);       // Update
router.delete('/:id', auth, deleteTodo);    // Delete

module.exports = router;
