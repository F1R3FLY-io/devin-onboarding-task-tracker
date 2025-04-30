import React, { useContext } from 'react';
import { format } from 'date-fns';
import TaskContext from '../../context/task/TaskContext';

type TaskProps = {
  task: {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    status: 'pending' | 'completed';
  };
};

const TaskItem: React.FC<TaskProps> = ({ task }) => {
  const taskContext = useContext(TaskContext);
  const { deleteTask, setCurrent, clearCurrent } = taskContext;
  const { _id, title, description, dueDate, status } = task;

  const onDelete = () => {
    deleteTask(_id);
    clearCurrent();
  };

  const formatDate = (dateString: string) => {
    try {
      const dateWithTime = dateString.includes('T') ? dateString : `${dateString}T00:00:00`;
      const date = new Date(dateWithTime);
      return format(date, 'MMMM dd, yyyy h:mm a');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className={`card bg-white p-4 rounded shadow-md ${status === 'completed' ? 'border-l-4 border-green-500' : 'border-l-4 border-yellow-500'}`}>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="mb-2">{description}</p>
      <p className="text-sm text-gray-600 mb-2">
        <strong>Due Date:</strong> {formatDate(dueDate)}
      </p>
      <p className="text-sm mb-3">
        <span className={`px-2 py-1 rounded-full text-white ${status === 'completed' ? 'bg-green-500' : 'bg-yellow-500'}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </p>
      <div className="flex justify-end">
        <button
          onClick={() => setCurrent(task)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
