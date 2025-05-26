import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import TodoForm from './TodoForm';
import "../../Styles/todo.css";

const TodoList = () => {
  const { token, logout } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTodo, setEditingTodo] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTodos = async () => {
    try {
      const res = await axios.get('http://localhost:5599/api/todos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    } catch (error) {
      console.error('Fetch Todos Error:', error);
      alert('Error fetching todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTodos();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      setActionLoading(true);
      await axios.delete(`http://localhost:5599/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error('Delete Todo Error:', error);
      alert('Error deleting todo');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleComplete = async (todo) => {
    try {
      setActionLoading(true);
      const updated = await axios.put(
        `http://localhost:5599/api/todos/${todo._id}`,
        { isCompleted: !todo.isCompleted },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos((prev) => prev.map((t) => (t._id === todo._id ? updated.data : t)));
    } catch (error) {
      console.error('Toggle Complete Error:', error);
      alert('Error updating todo');
    } finally {
      setActionLoading(false);
    }
  };

  const startEdit = (todo) => {
    setEditingTodo(todo);
  };

  const stopEdit = () => {
    setEditingTodo(null);
  };

  const onTodoSaved = (newOrUpdatedTodo) => {
    if (editingTodo) {
      setTodos((prev) => prev.map((t) => (t._id === newOrUpdatedTodo._id ? newOrUpdatedTodo : t)));
    } else {
      setTodos((prev) => [newOrUpdatedTodo, ...prev]);
    }
    setEditingTodo(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!token) return <p className="todo-message">Please login to see your tasks.</p>;
  if (loading) return <p className="todo-message">Loading tasks...</p>;

  return (
    <div className="todo-container">
      <div className="todo-header">
        <h2>Your To-Do List</h2>
        <button onClick={handleLogout} className="btn btn-logout">
          Logout
        </button>
      </div>

      <TodoForm editingTodo={editingTodo} onSaved={onTodoSaved} onCancel={stopEdit} />

      {todos.length === 0 && <p className="todo-message">No tasks found. Add one!</p>}

      <ul className="todo-list">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className={`todo-item ${todo.isCompleted ? 'completed' : ''}`}
          >
            <div className="todo-info">
              <strong>{todo.title}</strong>{' '}
              <small className="todo-date">{new Date(todo.dueDate).toLocaleDateString()}</small>
              <p>{todo.description}</p>
              <span className={`todo-priority ${todo.priority.toLowerCase()}`}>
                {todo.priority}
              </span>
              {todo.tags && todo.tags.length > 0 && (
                <div className="todo-tags">
                  {todo.tags.map((tag, i) => (
                    <span key={i} className="todo-tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="todo-actions">
              <button
                onClick={() => toggleComplete(todo)}
                className="btn btn-complete"
                disabled={actionLoading}
                aria-label={todo.isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {todo.isCompleted ? 'Undo' : 'Complete'}
              </button>
              <button
                onClick={() => startEdit(todo)}
                className="btn btn-edit"
                disabled={actionLoading}
                aria-label="Edit task"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(todo._id)}
                className="btn btn-delete"
                disabled={actionLoading}
                aria-label="Delete task"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
