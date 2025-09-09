import React from 'react';

// Define the filter types
type FilterType = 'all' | 'active' | 'completed';

// Props for the TodoFilter component
interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
}

/**
 * TodoFilter Component
 * 
 * Provides UI for:
 * - Filtering todos by status (All, Active, Completed)
 * - Displaying count of remaining todos
 * - Clearing all completed todos
 */
const TodoFilter: React.FC<TodoFilterProps> = ({
  currentFilter,
  onFilterChange,
  activeCount,
  completedCount,
  onClearCompleted
}) => {
  // Helper function to determine button style based on current filter
  const getButtonClass = (filterType: FilterType) => {
    const baseClass = "px-3 py-1 rounded mx-1";
    return currentFilter === filterType
      ? `${baseClass} bg-blue-500 text-white`
      : `${baseClass} bg-gray-200 hover:bg-gray-300`;
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-3 bg-white rounded shadow mt-4">
      {/* Item count */}
      <div className="mb-2 sm:mb-0">
        <span className="text-gray-600">
          {activeCount} {activeCount === 1 ? 'item' : 'items'} left
        </span>
      </div>

      {/* Filter buttons */}
      <div className="flex mb-2 sm:mb-0">
        <button
          className={getButtonClass('all')}
          onClick={() => onFilterChange('all')}
        >
          All
        </button>
        <button
          className={getButtonClass('active')}
          onClick={() => onFilterChange('active')}
        >
          Active
        </button>
        <button
          className={getButtonClass('completed')}
          onClick={() => onFilterChange('completed')}
        >
          Completed
        </button>
      </div>

      {/* Clear completed button */}
      {completedCount > 0 && (
        <button
          className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
          onClick={onClearCompleted}
        >
          Clear completed ({completedCount})
        </button>
      )}
    </div>
  );
};

export default TodoFilter;
