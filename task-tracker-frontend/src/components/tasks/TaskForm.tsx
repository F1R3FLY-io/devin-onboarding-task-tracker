import React, { useState, useContext, useEffect } from 'react';
import TaskContext from '../../context/task/TaskContext';

const TaskForm = () => {
  const taskContext = useContext(TaskContext);
  const { addTask, updateTask, current, clearCurrent } = taskContext;

  const [task, setTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'pending'
  });

  useEffect(() => {
    if (current !== null) {
      setTask({
        title: current.title,
        description: current.description,
        dueDate: current.dueDate.substring(0, 10),
        status: current.status
      });
    } else {
      setTask({
        title: '',
        description: '',
        dueDate: '',
        status: 'pending'
      });
    }
  }, [current]);

  const { title, description, dueDate, status } = task;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (current === null) {
      addTask(task);
    } else {
      updateTask({
        ...task,
        _id: current._id,
        user: current.user,
        createdAt: current.createdAt
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
          type="date"
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
        <select
          name="status"
          value={status}
          onChange={onChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
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
