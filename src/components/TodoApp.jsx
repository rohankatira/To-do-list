// 📁 src/components/TodoApp.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  addTask,
  deleteTask,
  toggleTask,
  editTask,
  setFilter,
  setSearch,
} from "../features/tasks/taskSlice";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import "./TodoApp.css";

const TodoApp = () => {
  const dispatch = useDispatch();
  const { tasks, filter, search } = useSelector((state) => state.tasks);

  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAdd = () => {
    if (text.trim()) {
      dispatch(addTask(text));
      setText("");
    }
  };

  const handleEditSave = (id) => {
    if (editText.trim()) {
      dispatch(editTask({ id, text: editText }));
      setEditingId(null);
      setEditText("");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.text.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed);
    return matchesSearch && matchesFilter;
  });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;

  return (
    <div className="container-fluid p-0">
      <div className="todo-container">
        <div className="todo-header">
          <h1>Todo Master</h1>
          <p>Organize your work and life, finally.</p>
        </div>
        <div className="todo-body">
          <div className="add-task-container">
            <input
              type="text"
              className="form-control add-task-input"
              placeholder="What needs to be done?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button className="btn btn-primary add-task-btn" onClick={handleAdd}>
              <i className="fas fa-plus me-2"></i>Add Task
            </button>
          </div>

          <div className="controls-container">
            <input
              type="text"
              className="form-control search-input"
              placeholder="Search tasks..."
              onChange={(e) => dispatch(setSearch(e.target.value))}
            />
            <select
              className="form-select filter-select"
              onChange={(e) => dispatch(setFilter(e.target.value))}
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div className="stats-container">
            <div className="stat-item">
              <div>Total</div>
              <div className="stat-value">{total}</div>
            </div>
            <div className="stat-item">
              <div>Completed</div>
              <div className="stat-value">{completed}</div>
            </div>
            <div className="stat-item">
              <div>Pending</div>
              <div className="stat-value">{pending}</div>
            </div>
          </div>

          <ul className="task-list">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`task-item ${task.completed ? "completed" : ""}`}
              >
                <div
                  className={`priority-indicator ${
                    task.priority === "high"
                      ? "priority-high"
                      : task.priority === "medium"
                      ? "priority-medium"
                      : "priority-low"
                  }`}
                ></div>
                <input
                  type="checkbox"
                  className="task-checkbox"
                  checked={task.completed}
                  onChange={() =>
                    dispatch(toggleTask({ id: task.id, completed: !task.completed }))
                  }
                />
                {editingId === task.id ? (
                  <input
                    type="text"
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                ) : (
                  <span
                    className={`task-text ${task.completed ? "completed" : ""}`}
                    onClick={() => {
                      setEditingId(task.id);
                      setEditText(task.text);
                    }}
                  >
                    {task.text}
                  </span>
                )}
                {editingId === task.id ? (
                  <button
                    className="action-btn save-btn"
                    onClick={() => handleEditSave(task.id)}
                  >
                    💾
                  </button>
                ) : (
                  <>
                    <button
                      className="action-btn edit-btn"
                      onClick={() => {
                        setEditingId(task.id);
                        setEditText(task.text);
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => dispatch(deleteTask(task.id))}
                    >
                      <FaTrashAlt />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TodoApp;
