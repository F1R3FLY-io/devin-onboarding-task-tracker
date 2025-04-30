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
  const [apiUrlError, setApiUrlError] = useState<string | null>(null);

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      setApiUrlError('API URL is not set. Please check your .env file and ensure VITE_API_URL is defined.');
    }
  }, []);

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

  if (apiUrlError) {
    return (
      <div className="text-center py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Configuration Error</p>
          <p>{apiUrlError}</p>
        </div>
      </div>
    );
  }

  if (authLoading || (isAuthenticated === null)) {
    console.log('ValueRank - Loading state, waiting for authentication');
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p>Authenticating...</p>
      </div>
    );
  }
  
  if (error) {
    console.log('ValueRank - Error state:', error);
    return (
      <div className="text-center py-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button 
          onClick={() => getLists()} 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Try Again
        </button>
      </div>
    );
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
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p>Loading lists...</p>
          </div>
        ) : lists.length === 0 ? (
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="mb-2">You don't have any lists yet.</p>
            <button
              onClick={toggleListForm}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
            >
              Create Your First List
            </button>
          </div>
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
