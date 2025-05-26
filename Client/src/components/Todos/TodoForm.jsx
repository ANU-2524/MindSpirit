import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import "../../Styles/todo.css";

const TodoForm = ({ editingTodo, onSaved, onCancel }) => {
  const { token } = useContext(AuthContext);
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Low',
    tags: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTodo) {
      setForm({
        title: editingTodo.title || '',
        description: editingTodo.description || '',
        dueDate: editingTodo.dueDate ? editingTodo.dueDate.slice(0, 10) : '',
        priority: editingTodo.priority || 'Low',
        tags: editingTodo.tags ? editingTodo.tags.join(', ') : '',
      });
    } else {
      setForm({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Low',
        tags: '',
      });
    }
  }, [editingTodo]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const tagsArr = form.tags.split(',').map((t) => t.trim()).filter((t) => t);

    try {
      setSubmitting(true);
      let res;
      if (editingTodo) {
        res = await axios.put(
          `http://localhost:5599/api/todos/${editingTodo._id}`,
          { ...form, tags: tagsArr },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        res = await axios.post(
          'http://localhost:5599/api/todos',
          { ...form, tags: tagsArr },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      onSaved(res.data);
      setForm({ title: '', description: '', dueDate: '', priority: 'Low', tags: '' });
    } catch (error) {
      console.error('Save Todo Error:', error);
      alert('Error saving todo');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <h3>{editingTodo ? 'Edit Task' : 'Add New Task'}</h3>
      <input
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        required
        disabled={submitting}
        className="todo-input"
      />
      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows={3}
        disabled={submitting}
        className="todo-textarea"
      />
      <input
        type="date"
        name="dueDate"
        value={form.dueDate}
        onChange={handleChange}
        disabled={submitting}
        className="todo-input"
      />
      <select
        name="priority"
        value={form.priority}
        onChange={handleChange}
        disabled={submitting}
        className="todo-select"
      >
        <option value="Low">Low Priority</option>
        <option value="Medium">Medium Priority</option>
        <option value="High">High Priority</option>
      </select>
      <input
        name="tags"
        placeholder="Tags (comma separated)"
        value={form.tags}
        onChange={handleChange}
        disabled={submitting}
        className="todo-input"
      />
      <div className="todo-form-actions">
        <button type="submit" className="btn btn-submit" disabled={submitting}>
          {submitting ? (editingTodo ? 'Updating...' : 'Adding...') : editingTodo ? 'Update Task' : 'Add Task'}
        </button>
        {editingTodo && (
          <button type="button" className="btn btn-cancel" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TodoForm;
