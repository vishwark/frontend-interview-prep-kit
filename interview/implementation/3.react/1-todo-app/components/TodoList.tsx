import React from 'react';
import TodoItem from './TodoItem';

// Define the Todo item type
interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

// Props for the TodoList component
interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

/**
 * TodoList Component
 * 
 * Renders a list of TodoItem components
 * Handles passing down the appropriate props to each TodoItem
 */
const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onDelete, onEdit }) => {
  // If there are no todos, display a message
  if (todos.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No todos to display. Add a new todo to get started!
      </div>
    );
  }

  return (
    <div className="mt-4">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default TodoList;
