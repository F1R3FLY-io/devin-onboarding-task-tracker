import React, { useState, useContext, useEffect } from 'react';
import TaskContext from '../../context/task/TaskContext';
import RankingContext from '../../context/ranking/RankingContext';

const TaskForm = () => {
  const taskContext = useContext(TaskContext);
  const rankingContext = useContext(RankingContext);
  const { lists } = rankingContext;
  const { addTask, updateTask, current, clearCurrent } = taskContext;
  
  const [searchTerm, setSearchTerm] = useState('');

  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending',
    listIds: [] as string[]
  });

  useEffect(() => {
    if (current !== null) {
      let formattedDate = '';
      try {
        const date = new Date(current.dueDate);
        formattedDate = date.toISOString().substring(0, 16);
      } catch (error) {
        console.error('Error formatting date:', error);
        formattedDate = '';
      }
      
      setTask({
        title: current.title,
        description: current.description,
        dueDate: formattedDate,
        status: current.status,
        listIds: current.listIds || []
      });
    } else {
      setTask({
        title: '',
        description: '',
        dueDate: '',
        status: 'pending',
        listIds: []
      });
    }
  }, [current]);

  const { title, description, dueDate, status, listIds } = task;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };
  
  const handleListChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setTask({ ...task, listIds: selectedOptions });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (current === null) {
      addTask({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status as 'pending' | 'completed',
        listIds: task.listIds
      });
    } else {
      updateTask({
        _id: current._id,
        user: current.user,
        createdAt: current.createdAt,
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        status: task.status as 'pending' | 'completed',
        listIds: task.listIds
      });
    }
    clearAll();
  };

  const clearAll = () => {
    clearCurrent();
  };

  return (
    <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h2 className="text-xl font-bold mb-4">{current ? 'Edit Task' : 'Add Task'}</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={title}
          onChange={onChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          name="description"
          value={description}
          onChange={onChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="dueDate">
          Due Date
        </label>
        <input
          type="datetime-local"
          name="dueDate"
          value={dueDate}
          onChange={onChange}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
          Status
        </label>
        <button
          type="button"
          onClick={() => setTask({ ...task, status: status === 'pending' ? 'completed' : 'pending' })}
          className={`px-2 py-1 rounded-full text-white ${status === 'completed' ? 'bg-green-500 hover:bg-green-600' : 'bg-yellow-500 hover:bg-yellow-600'}`}
        >
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </button>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="listIds">
          Associated Lists (Optional)
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for lists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-1"
          />
          <select
            name="listIds"
            multiple
            value={listIds}
            onChange={handleListChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            size={Math.min(5, lists.filter(list => 
              searchTerm === '' || list.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).length)}
          >
            {lists?.filter(list => 
              searchTerm === '' || list.name.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(list => (
              <option key={list._id} value={list._id}>
                {list.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Hold Ctrl (or Cmd) to select multiple lists
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {current ? 'Update Task' : 'Add Task'}
        </button>
        {current && (
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={clearAll}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
