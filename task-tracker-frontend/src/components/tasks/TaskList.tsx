import React, { useContext, useEffect, useState } from 'react';
import TaskContext, { TaskFilter } from '../../context/task/TaskContext';
import TaskItem from './TaskItem';

const TaskList = () => {
  const taskContext = useContext(TaskContext);
  const { filteredTasks, getTasks, loading, filter, setFilter } = taskContext;
  
  const [sortField, setSortField] = useState<'title' | 'dueDate'>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    getTasks();
  }, []);

  if (filteredTasks?.length === 0 && !loading) {
    return <h4 className="text-center text-xl mt-4">No tasks to show</h4>;
  }
  
  const sortedTasks = [...(filteredTasks || [])].sort((a, b) => {
    if (sortField === 'title') {
      const comparison = a.title.localeCompare(b.title);
      return sortDirection === 'asc' ? comparison : -comparison;
    } else {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });

  const handleFilterChange = (newFilter: TaskFilter) => {
    setFilter(newFilter);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <h2 className="text-xl font-bold">Your Tasks</h2>
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex rounded-md overflow-hidden border border-gray-300">
            <button
              onClick={() => handleFilterChange('all')}
              className={`px-3 py-1 text-sm ${
                filter === 'all'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleFilterChange('pending')}
              className={`px-3 py-1 text-sm ${
                filter === 'pending'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => handleFilterChange('completed')}
              className={`px-3 py-1 text-sm ${
                filter === 'completed'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Completed
            </button>
          </div>
          
          {/* Sort Controls */}
          <div className="flex items-center">
            <select 
              value={sortField}
              onChange={(e) => setSortField(e.target.value as 'title' | 'dueDate')}
              className="border rounded-l py-1 px-2 text-sm"
            >
              <option value="dueDate">Due Date</option>
              <option value="title">Title</option>
            </select>
            <button
              onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-r text-sm"
              title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
            >
              {sortDirection === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid gap-4">
        {sortedTasks.map(task => (
          <TaskItem key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
