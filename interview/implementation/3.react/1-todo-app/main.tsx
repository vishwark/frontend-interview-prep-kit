import React, { useState, useEffect } from 'react';
import TodoList from './components/TodoList';
import TodoFilter from './components/TodoFilter';

// Define the Todo item type
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// Define the filter types
type FilterType = 'all' | 'active' | 'completed';

/**
 * TodoApp Component
 * 
 * Main component that:
 * - Manages the todo state
 * - Handles adding, editing, deleting todos
 * - Manages filtering and display logic
 * - Optionally persists todos in localStorage
 */
const TodoApp: React.FC = () => {
  // State for todos
  const [todos, setTodos] = useState<Todo[]>([]);

  // Load todos from localStorage on client-side only
  useEffect(() => {
    // This code only runs on the client after the component mounts
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);
  
  // State for the new todo input
  const [newTodo, setNewTodo] = useState('');
  
  // State for the current filter
  const [filter, setFilter] = useState<FilterType>('all');

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Filter todos based on the current filter
  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true; // 'all' filter
  });

  // Count active and completed todos
  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.length - activeCount;

  // Add a new todo
  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't add empty todos
    if (!newTodo.trim()) return;
    
    // Create a new todo with a unique ID
    const newTodoItem: Todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false
    };
    
    // Add the new todo to the list
    setTodos([...todos, newTodoItem]);
    
    // Clear the input
    setNewTodo('');
  };

  // Toggle a todo's completed status
  const handleToggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete a todo
  const handleDeleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  // Edit a todo
  const handleEditTodo = (id: number, newText: string) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, text: newText } : todo
      )
    );
  };

  // Clear all completed todos
  const handleClearCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Todo App</h1>
      
      {/* Form to add new todos */}
      <form onSubmit={handleAddTodo} className="flex mb-4">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 p-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add
        </button>
      </form>
      
      {/* List of todos */}
      <TodoList
        todos={filteredTodos}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
        onEdit={handleEditTodo}
      />
      
      {/* Filter and stats */}
      {todos.length > 0 && (
        <TodoFilter
          currentFilter={filter}
          onFilterChange={setFilter}
          activeCount={activeCount}
          completedCount={completedCount}
          onClearCompleted={handleClearCompleted}
        />
      )}
    </div>
  );
};

export default TodoApp;
