import React, { useState } from 'react';

// Define the Todo item type
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// Props for the TodoItem component
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

/**
 * TodoItem Component
 * 
 * Renders an individual todo item with options to:
 * - Toggle completion status
 * - Edit the todo text
 * - Delete the todo
 */
const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onDelete, onEdit }) => {
  // State to track if the item is being edited
  const [isEditing, setIsEditing] = useState(false);
  // State to store the edited text
  const [editText, setEditText] = useState(todo.text);

  // Handle saving the edited text
  const handleSave = () => {
    // Don't save empty todos
    if (editText.trim()) {
      onEdit(todo.id, editText);
      setIsEditing(false);
    }
  };

  // Handle key press events in the edit input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      // Cancel editing and restore original text
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <div className={`flex items-center my-2 p-2 rounded ${todo.completed ? 'bg-gray-100' : 'bg-white'}`}>
      {/* Checkbox for toggling completion status */}
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className="mr-3"
      />

      {/* Todo text or edit input */}
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyPress}
          autoFocus
          className="flex-1 p-1 border border-gray-300 rounded"
        />
      ) : (
        <span
          className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : 'text-black'}`}
        >
          {todo.text}
        </span>
      )}

      {/* Action buttons */}
      <div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="mr-2 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit
          </button>
        )}
        <button 
          onClick={() => onDelete(todo.id)}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TodoItem;
