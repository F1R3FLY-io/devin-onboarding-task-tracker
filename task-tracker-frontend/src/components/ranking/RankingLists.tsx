import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RankingList } from '../../context/ranking/RankingContext';
import RankingContext from '../../context/ranking/RankingContext';
import TaskContext from '../../context/task/TaskContext';

type RankingListsProps = {
  lists: RankingList[];
};

const RankingLists: React.FC<RankingListsProps> = ({ lists }) => {
  const rankingContext = useContext(RankingContext);
  const taskContext = useContext(TaskContext);
  const navigate = useNavigate();
  const { setCurrentList, deleteList, clearCurrentList, updateList } = rankingContext;
  
  const [editingListId, setEditingListId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startEditing = (list: RankingList, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingListId(list._id);
    setEditName(list.name);
  };

  const saveListName = (list: RankingList) => {
    if (editName.trim() === '') {
      alert('Priority array name cannot be empty');
      return;
    }

    updateList({
      ...list,
      name: editName
    });
    
    setEditingListId(null);
  };

  const cancelEditing = () => {
    setEditingListId(null);
  };
  
  const getAssociatedTasks = (listId: string) => {
    if (!taskContext?.tasks) return [];
    return taskContext.tasks.filter(task => 
      task.listIds && task.listIds.includes(listId)
    );
  };

  if (lists.length === 0) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <p>No priority arrays found. Create a new priority array to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {lists.map(list => (
        <div 
          key={list._id} 
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-soft hover:shadow-lg transition-shadow cursor-pointer backdrop-blur-md bg-opacity-90 dark:bg-opacity-90"
          onClick={() => editingListId !== list._id && setCurrentList(list)}
        >
          <div className="flex justify-between items-center">
            {editingListId === list._id ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border rounded-xl py-1 px-2 mr-2 text-lg bg-white dark:bg-gray-700 dark:text-gray-100"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveListName(list);
                    if (e.key === 'Escape') cancelEditing();
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <button 
                  onClick={() => saveListName(list)} 
                  className="text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 mr-1" 
                  title="Save"
                >
                  ✓
                </button>
                <button 
                  onClick={cancelEditing} 
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" 
                  title="Cancel"
                >
                  ✗
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{list.name}</h3>
                <button 
                  onClick={(e) => startEditing(list, e)} 
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 text-sm"
                  title="Rename"
                >
                  ✏️
                </button>
              </div>
            )}
            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm('Are you sure you want to delete this priority array?')) {
                    deleteList(list._id);
                    clearCurrentList();
                  }
                }}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 ml-2"
              >
                <i className="fas fa-trash-alt"></i>
                Delete
              </button>
            </div>
          </div>
          
          {/* Associated Tasks Section - Always show */}
          <div className="mt-4 p-3 bg-blue-50/70 dark:bg-blue-900/20 rounded-xl backdrop-blur-sm">
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2"><strong>🔗 Associated Tasks:</strong></p>
            {getAssociatedTasks(list._id).length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {getAssociatedTasks(list._id).map(task => (
                  <button 
                    key={task._id} 
                    className="inline-block bg-blue-100/80 dark:bg-blue-800/50 text-blue-800 dark:text-blue-200 text-xs px-3 py-1.5 rounded-xl hover:bg-blue-200 dark:hover:bg-blue-700/60 transition-colors flex items-center shadow-soft"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/');
                      taskContext.setCurrent(task);
                    }}
                    title={`View ${task.title} task`}
                  >
                    {task.title}
                    <span className="ml-1 text-blue-600 dark:text-blue-300">→</span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No associated tasks yet.</p>
            )}
          </div>
          {/* Mode field hidden as requested */}
        </div>
      ))}
    </div>
  );
};

export default RankingLists;
