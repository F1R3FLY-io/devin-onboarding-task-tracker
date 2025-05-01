import React, { useContext } from 'react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import TaskContext, { Task } from '../../context/task/TaskContext';
import RankingContext from '../../context/ranking/RankingContext';

type TaskProps = {
  task: Task;
};

const TaskItem: React.FC<TaskProps> = ({ task }) => {
  const taskContext = useContext(TaskContext);
  const rankingContext = useContext(RankingContext);
  const navigate = useNavigate();
  const { deleteTask, setCurrent, clearCurrent, updateTask } = taskContext;
  const { lists, items, setCurrentList } = rankingContext;
  const { _id, title, description, dueDate, status, listIds = [], itemIds = [] } = task;

  const onDelete = () => {
    deleteTask(_id);
    clearCurrent();
  };

  const toggleStatus = () => {
    const updatedTask: Task = {
      ...task,
      status: status === 'pending' ? 'completed' : 'pending'
    };
    updateTask(updatedTask);
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

  const associatedLists = lists.filter(list => listIds.includes(list._id));
  const associatedItems = items?.filter(item => itemIds.includes(item._id)) || [];

  return (
    <div className={`card bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft backdrop-blur-md bg-opacity-90 dark:bg-opacity-90 ${status === 'completed' ? 'bg-gradient-to-r from-green-50 to-white dark:from-green-900/20 dark:to-gray-800' : 'bg-gradient-to-r from-yellow-50 to-white dark:from-yellow-900/20 dark:to-gray-800'}`}>
      <h3 className="text-xl font-bold mb-3 text-gray-800 dark:text-gray-100">{title}</h3>
      <p className="mb-3 text-gray-700 dark:text-gray-300">{description}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        <strong>Due Date:</strong> {formatDate(dueDate)}
      </p>
      <p className="text-sm mb-4">
        <button 
          onClick={toggleStatus}
          className={`px-3 py-1.5 rounded-xl text-white shadow-soft transition-all duration-200 ${status === 'completed' ? 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700' : 'bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700'}`}
        >
          {status === 'completed' ? '✅ Completed' : '⏳ Pending'}
        </button>
      </p>
      
      {/* Display associated lists */}
      {associatedLists.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50/70 dark:bg-blue-900/20 rounded-xl backdrop-blur-sm">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>🔗 Associated Priority Arrays:</strong></p>
          <div className="flex flex-wrap gap-2">
            {associatedLists.map(list => (
              <button 
                key={list._id} 
                className="inline-block bg-blue-100/80 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 text-xs px-3 py-1.5 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-700/60 transition-colors flex items-center shadow-soft"
                onClick={() => {
                  setCurrentList(list);
                  navigate('/valuerank');
                }}
                title={`View ${list.name} priority array`}
              >
                {list.name}
                <span className="ml-1 text-blue-600 dark:text-blue-300">→</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Display associated line items */}
      {associatedItems.length > 0 && (
        <div className="mb-4 p-3 bg-purple-50/70 dark:bg-purple-900/20 rounded-xl backdrop-blur-sm">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>📊 Associated Line Items:</strong></p>
          <div className="flex flex-wrap gap-2">
            {associatedItems.map(item => (
              <button 
                key={item._id} 
                className="inline-block bg-purple-100/80 dark:bg-purple-800/50 text-purple-800 dark:text-purple-200 text-xs px-3 py-1.5 rounded-xl hover:bg-purple-200 dark:hover:bg-purple-700/60 transition-colors flex items-center shadow-soft"
                title={`Item from ${lists.find(l => l._id === item.list)?.name || 'Unknown priority array'}`}
                onClick={() => {
                  const list = lists.find(l => l._id === item.list);
                  if (list) {
                    setCurrentList(list);
                    navigate('/valuerank');
                  }
                }}
              >
                {item.text} <span className="ml-1 text-purple-600 dark:text-purple-300">(Value: {item.value})</span>
                <span className="ml-1 text-purple-600 dark:text-purple-300">→</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-end mt-2">
        <button
          onClick={() => setCurrent(task)}
          className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl mr-3 shadow-soft transition-all duration-200 flex items-center"
        >
          <span className="mr-1">✏️</span> Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-transparent hover:bg-red-500 text-red-500 hover:text-white border border-red-500 hover:border-transparent font-medium py-2 px-4 rounded-xl shadow-soft transition-all duration-200 flex items-center"
        >
          <span className="mr-1">🗑️</span> Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
