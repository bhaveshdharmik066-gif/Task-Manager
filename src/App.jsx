import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newTask = {
      id: Date.now(),
      text: inputValue,
      completed: false,
      createdAt: new Date().toLocaleString(),
      priority: priority,
    };

    setTasks([newTask, ...tasks]);
    setInputValue('');
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const saveEdit = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, text: editText } : task
    ));
    setEditingId(null);
  };

  const clearCompleted = () => {
    setTasks(tasks.filter(task => !task.completed));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <div className="container">
      <header className="header">
        <h1>Task Manager</h1>
      </header>

      <form className="input-section" onSubmit={addTask}>
        <input 
          type="text" 
          placeholder="Enter a task..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <select 
          className="filter-btn" 
          value={priority} 
          onChange={(e) => setPriority(e.target.value)}
          style={{ padding: '0 0.5rem' }}
        >
          <option value="low">Low</option>
          <option value="medium">Med</option>
          <option value="high">High</option>
        </select>
        <button type="submit" className="add-btn">Add Task</button>
      </form>

      <div className="filter-section">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >All</button>
        <button 
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >Completed</button>
        <button 
          className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >Pending</button>
      </div>

      <main className="task-list">
        {filteredTasks.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No tasks found.</p>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className={`task-card ${task.completed ? 'completed' : ''}`}>
              <input 
                type="checkbox" 
                className="checkbox" 
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />
              
              <div className="task-content">
                <div className="task-header">
                  {editingId === task.id ? (
                    <input 
                      type="text" 
                      value={editText} 
                      onChange={(e) => setEditText(e.target.value)}
                      onBlur={() => saveEdit(task.id)}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit(task.id)}
                      autoFocus
                    />
                  ) : (
                    <span className="task-text">{task.text}</span>
                  )}
                  <span className={`priority-badge priority-${task.priority}`}>
                    {task.priority}
                  </span>
                </div>
                <div className="task-meta">
                  {task.createdAt}
                </div>
              </div>

              <div className="actions">
                <button className="icon-btn" onClick={() => editingId === task.id ? saveEdit(task.id) : startEdit(task)}>
                  {editingId === task.id ? '💾' : '✏️'}
                </button>
                <button className="icon-btn delete-btn" onClick={() => deleteTask(task.id)}>
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </main>

      <footer className="footer">
        <div>
          Total: <strong>{tasks.length}</strong> | Completed: <strong>{completedCount}</strong>
        </div>
        <button className="clear-btn" onClick={clearCompleted}>
          Clear Completed
        </button>
      </footer>
    </div>
  );
}

export default App;
