import React, { useContext, useState } from 'react';
import { RankingList } from '../../context/ranking/RankingContext';
import RankingContext from '../../context/ranking/RankingContext';

type RankingListsProps = {
  lists: RankingList[];
};

const RankingLists: React.FC<RankingListsProps> = ({ lists }) => {
  const rankingContext = useContext(RankingContext);
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
      alert('List name cannot be empty');
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

  if (lists.length === 0) {
    return (
      <div className="bg-gray-100 p-4 rounded-lg text-center">
        <p>No lists found. Create a new list to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {lists.map(list => (
        <div 
          key={list._id} 
          className="bg-white p-4 rounded shadow-md hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => editingListId !== list._id && setCurrentList(list)}
        >
          <div className="flex justify-between items-center">
            {editingListId === list._id ? (
              <div className="flex items-center">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="border rounded py-1 px-2 mr-2 text-lg"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveListName(list);
                    if (e.key === 'Escape') cancelEditing();
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <button 
                  onClick={() => saveListName(list)} 
                  className="text-green-500 hover:text-green-700 mr-1" 
                  title="Save"
                >
                  ✓
                </button>
                <button 
                  onClick={cancelEditing} 
                  className="text-red-500 hover:text-red-700" 
                  title="Cancel"
                >
                  ✗
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <h3 className="text-lg font-semibold">{list.name}</h3>
                <button 
                  onClick={(e) => startEditing(list, e)} 
                  className="ml-2 text-gray-500 hover:text-gray-700 text-sm"
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
                  if (window.confirm('Are you sure you want to delete this list?')) {
                    deleteList(list._id);
                    clearCurrentList();
                  }
                }}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                <i className="fas fa-trash-alt"></i>
                Delete
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-1">
            Mode: {list.mode.charAt(0).toUpperCase() + list.mode.slice(1)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default RankingLists;
