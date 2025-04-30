import React, { useContext } from 'react';
import { RankingList } from '../../context/ranking/RankingContext';
import RankingContext from '../../context/ranking/RankingContext';

type RankingListsProps = {
  lists: RankingList[];
};

const RankingLists: React.FC<RankingListsProps> = ({ lists }) => {
  const rankingContext = useContext(RankingContext);
  const { setCurrentList, deleteList, clearCurrentList } = rankingContext;

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
          onClick={() => setCurrentList(list)}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{list.name}</h3>
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
