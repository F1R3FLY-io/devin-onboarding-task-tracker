import React, { useState, useContext, useEffect } from 'react';
import RankingContext from '../../context/ranking/RankingContext';
import TaskContext from '../../context/task/TaskContext';

type RankingItemFormProps = {
  listId: string;
  onClose: () => void;
};

const RankingItemForm: React.FC<RankingItemFormProps> = ({ listId, onClose }) => {
  const rankingContext = useContext(RankingContext);
  const taskContext = useContext(TaskContext);
  
  const { addItem, updateItem, currentItem, clearCurrentItem, items } = rankingContext;
  const { tasks } = taskContext;

  const [item, setItem] = useState({
    text: '',
    value: '',
    taskId: ''
  });
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (currentItem !== null) {
      setItem({
        text: currentItem.text,
        value: currentItem.value.toString(),
        taskId: currentItem.taskId || ''
      });
    } else {
      let suggestedValue = '';
      
      if (items.length === 0) {
        suggestedValue = '50';
      } else {
        const highestValue = Math.max(...items.map(i => i.value));
        suggestedValue = (highestValue + 1).toString();
      }
      
      setItem({
        text: '',
        value: suggestedValue,
        taskId: ''
      });
    }
  }, [currentItem, items]);

  const { text, value, taskId } = item;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (text.trim() === '') {
      alert('Please enter text for the item');
      return;
    }

    if (value.trim() === '' || isNaN(parseFloat(value))) {
      alert('Please enter a valid number for the value');
      return;
    }

    if (currentItem === null) {
      addItem({
        text,
        value: parseFloat(value),
        taskId: taskId || null
      }, listId);
    } else {
      updateItem({
        ...currentItem,
        text,
        value: parseFloat(value),
        taskId: taskId || null
      });
    }

    clearAll();
    onClose();
  };

  const clearAll = () => {
    clearCurrentItem();
  };

  return (
    <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-6 pt-4 pb-6 mb-4">
      <h2 className="text-xl font-bold mb-4">{currentItem ? 'Edit Item' : 'Add Item'}</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="text">
          Text
        </label>
        <textarea
          name="text"
          value={text}
          onChange={onChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Item Text"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="value">
          Value (0-100)
        </label>
        <input
          type="number"
          name="value"
          value={value}
          onChange={onChange}
          step="0.01"
          min="0"
          max="100"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          required
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter a unique value between 0 and 100. Decimal values are allowed.
        </p>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="taskId">
          Associated Task (Optional)
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a task..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-1"
          />
          <select
            name="taskId"
            value={taskId}
            onChange={onChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            size={Math.min(5, tasks.filter(task => 
              searchTerm === '' || task.title.toLowerCase().includes(searchTerm.toLowerCase())
            ).length + 1)}
          >
            <option value="">None</option>
            {tasks?.filter(task => 
              searchTerm === '' || task.title.toLowerCase().includes(searchTerm.toLowerCase())
            ).map(task => (
              <option key={task._id} value={task._id}>
                {task.title}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Type in the search box to filter tasks
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {currentItem ? 'Update Item' : 'Add Item'}
        </button>
        {currentItem && (
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={() => {
              clearAll();
              onClose();
            }}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default RankingItemForm;
