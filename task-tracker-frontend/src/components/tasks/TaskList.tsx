import React, { useContext, useEffect, useState } from 'react';
import TaskContext from '../../context/task/TaskContext';
import TaskItem from './TaskItem';

const TaskList = () => {
  const taskContext = useContext(TaskContext);
  const { tasks, getTasks, loading } = taskContext;
  
  const [sortField, setSortField] = useState<'title' | 'dueDate'>('dueDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    getTasks();
  }, []);

  if (tasks?.length === 0 && !loading) {
    return <h4 className="text-center text-xl mt-4">No tasks to show</h4>;
  }
  
  const sortedTasks = [...(tasks || [])].sort((a, b) => {
    if (sortField === 'title') {
      const comparison = a.title.localeCompare(b.title);
      return sortDirection === 'asc' ? comparison : -comparison;
    } else {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Your Tasks</h2>
        <div className="flex items-center space-x-2">
          <select 
            value={sortField}
            onChange={(e) => setSortField(e.target.value as 'title' | 'dueDate')}
            className="border rounded py-1 px-2 text-sm"
          >
            <option value="dueDate">Due Date</option>
            <option value="title">Title</option>
          </select>
          <button
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded text-sm"
            title={`Sort ${sortDirection === 'asc' ? 'Descending' : 'Ascending'}`}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
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
