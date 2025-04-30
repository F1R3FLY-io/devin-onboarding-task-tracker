import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth/AuthContext';
import RankingContext from '../context/ranking/RankingContext';
import RankingListForm from '../components/ranking/RankingListForm';
import RankingLists from '../components/ranking/RankingLists';
import RankingItems from '../components/ranking/RankingItems';

const ValueRank = () => {
  const authContext = useContext(AuthContext);
  const rankingContext = useContext(RankingContext);
  const navigate = useNavigate();

  const { isAuthenticated, loading: authLoading } = authContext;
  const { 
    lists, 
    currentList, 
    items, 
    getLists, 
    getItems, 
    loading: rankingLoading,
    error 
  } = rankingContext;

  console.log('ValueRank - Auth State:', { isAuthenticated, authLoading });
  console.log('ValueRank - Ranking State:', { lists, currentList, rankingLoading });

  const [showListForm, setShowListForm] = useState(false);

  useEffect(() => {
    console.log('ValueRank - Auth Effect triggered', { isAuthenticated, authLoading });
    if (!isAuthenticated && !authLoading) {
      console.log('ValueRank - Redirecting to login');
      navigate('/login');
    } else if (isAuthenticated) {
      console.log('ValueRank - Fetching lists');
      getLists();
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (currentList) {
      console.log('ValueRank - Fetching items for list:', currentList._id);
      getItems(currentList._id);
    }
  }, [currentList]);

  const toggleListForm = () => {
    setShowListForm(!showListForm);
  };

  if (authLoading || (isAuthenticated === null)) {
    console.log('ValueRank - Loading state, waiting for authentication');
    return <div className="text-center py-10">Loading...</div>;
  }
  
  if (error) {
    console.log('ValueRank - Error state:', error);
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Lists</h2>
          <button
            onClick={toggleListForm}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
          >
            {showListForm ? 'Cancel' : 'Add List'}
          </button>
        </div>
        
        {showListForm && <RankingListForm onClose={() => setShowListForm(false)} />}
        
        {rankingLoading ? (
          <p>Loading lists...</p>
        ) : (
          <RankingLists lists={lists} />
        )}
      </div>
      
      <div className="md:col-span-2">
        {currentList ? (
          <>
            <h2 className="text-2xl font-bold mb-4">{currentList.name}</h2>
            <p className="mb-4 text-gray-600">
              Mode: {currentList.mode.charAt(0).toUpperCase() + currentList.mode.slice(1)}
            </p>
            <RankingItems items={items} listId={currentList._id} mode={currentList.mode} />
          </>
        ) : (
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <h3 className="text-xl mb-2">No List Selected</h3>
            <p>Select a list from the sidebar or create a new one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValueRank;
