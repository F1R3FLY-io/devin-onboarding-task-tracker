import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/auth/AuthContext';
import RankingContext, { RankingList } from '../context/ranking/RankingContext';
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
    updateList,
    loading: rankingLoading,
    error 
  } = rankingContext;

  const [showListForm, setShowListForm] = useState(false);
  const [apiUrlError, setApiUrlError] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      setApiUrlError('API URL is not set. Please check your .env file and ensure VITE_API_URL is defined.');
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      navigate('/login');
    } else if (isAuthenticated) {
      getLists();
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (currentList) {
      getItems(currentList._id);
    }
  }, [currentList]);

  useEffect(() => {
    if (currentList) {
      setEditedTitle(currentList.name);
    }
  }, [currentList]);

  const toggleListForm = () => {
    setShowListForm(!showListForm);
  };
  
  const startTitleEditing = () => {
    if (currentList) {
      setIsEditingTitle(true);
      setEditedTitle(currentList.name);
    }
  };
  
  const saveTitleEdit = () => {
    if (currentList && editedTitle.trim() !== '') {
      updateList({
        ...currentList,
        name: editedTitle
      });
      setIsEditingTitle(false);
    } else if (editedTitle.trim() === '') {
      alert('List name cannot be empty');
    }
  };
  
  const cancelTitleEditing = () => {
    if (currentList) {
      setEditedTitle(currentList.name);
      setIsEditingTitle(false);
    }
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
    return (
      <div className="text-center py-10">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
        <p>Authenticating...</p>
      </div>
    );
  }
  
  const renderErrorNotification = () => {
    if (!error) return null;
    
    if (error.includes('An item with this value already exists')) {
      return (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <div className="bg-yellow-50/90 dark:bg-yellow-900/90 backdrop-blur-md rounded-xl shadow-soft px-5 py-4 border-0">
            <div className="flex justify-between items-center">
              <p className="font-bold text-yellow-800 dark:text-yellow-200 flex items-center">
                <span className="mr-2">ℹ️</span> Note
              </p>
              <button 
                onClick={() => rankingContext.clearErrors()}
                className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-300 dark:hover:text-yellow-100 transition-colors"
              >
                ×
              </button>
            </div>
            <p className="text-yellow-700 dark:text-yellow-300 mt-1">Values are automatically adjusted to prevent duplicates.</p>
            <div className="mt-3 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-100/50 dark:bg-yellow-800/30 p-3 rounded-lg">
              <p className="mb-1">• Items are sorted by their value (highest at top)</p>
              <p>• Each item must have a unique value between 0-100</p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <div className="bg-red-50/90 dark:bg-red-900/90 backdrop-blur-md rounded-xl shadow-soft px-5 py-4 border-0">
          <div className="flex justify-between items-center">
            <p className="font-bold text-red-800 dark:text-red-200 flex items-center">
              <span className="mr-2">⚠️</span> Error
            </p>
            <button 
              onClick={() => rankingContext.clearErrors()}
              className="text-red-600 hover:text-red-800 dark:text-red-300 dark:hover:text-red-100 transition-colors"
            >
              ×
            </button>
          </div>
          <p className="text-red-700 dark:text-red-300 mt-1">{error}</p>
          <button 
            onClick={() => {
              rankingContext.clearErrors();
              
              if (currentList) {
                getItems(currentList._id);
              } else {
                getLists();
              }
            }} 
            className="mt-3 bg-red-200/70 hover:bg-red-300/70 dark:bg-red-800/50 dark:hover:bg-red-700/50 text-red-800 dark:text-red-200 font-medium py-2 px-4 rounded-lg text-sm transition-colors shadow-soft"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Render error notification if there is an error */}
      {renderErrorNotification()}
      
      <div className="md:col-span-1">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">📊 Your Priority Arrays</h2>
            <button
              onClick={toggleListForm}
              className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl shadow-soft transition-all duration-200"
            >
              {showListForm ? '✖️ Cancel' : '➕ Add Priority Array'}
            </button>
          </div>
          
          {showListForm && <RankingListForm onClose={() => setShowListForm(false)} />}
          
          {rankingLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-3"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading priority arrays...</p>
            </div>
          ) : lists.length === 0 ? (
            <div className="bg-blue-50/70 dark:bg-blue-900/20 p-6 rounded-xl text-center backdrop-blur-sm">
              <p className="mb-4 text-gray-700 dark:text-gray-300">You don't have any priority arrays yet.</p>
              <button
                onClick={toggleListForm}
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl shadow-soft transition-all duration-200"
              >
                ✨ Create Your First Priority Array
              </button>
            </div>
          ) : (
            <RankingLists lists={lists} />
          )}
        </div>
      </div>
      
      <div className="md:col-span-2">
        {currentList ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-soft p-6 backdrop-blur-md bg-opacity-90 dark:bg-opacity-90">
            {isEditingTitle ? (
              <div className="flex items-center mb-6">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="shadow-soft appearance-none bg-white dark:bg-gray-700 rounded-xl py-2 px-4 mr-2 text-2xl font-bold text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveTitleEdit();
                    if (e.key === 'Escape') cancelTitleEditing();
                  }}
                />
                <button 
                  onClick={saveTitleEdit} 
                  className="text-green-500 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 mr-2 text-xl transition-colors" 
                  title="Save"
                >
                  ✓
                </button>
                <button 
                  onClick={cancelTitleEditing} 
                  className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-xl transition-colors" 
                  title="Cancel"
                >
                  ✗
                </button>
              </div>
            ) : (
              <div className="flex items-center mb-6">
                <h2 className="text-2xl font-bold mr-2 text-gray-800 dark:text-gray-100">{currentList.name}</h2>
                <button 
                  onClick={startTitleEditing} 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-sm transition-colors"
                  title="Rename"
                >
                  ✏️
                </button>
              </div>
            )}
            <p className="mb-4 text-gray-600 dark:text-gray-300">
              Higher values (0-100) indicate higher priority
            </p>
            <div className="mb-6 bg-blue-50/70 dark:bg-blue-900/20 p-4 rounded-xl backdrop-blur-sm">
              <p className="text-blue-800 dark:text-blue-200 font-medium"><strong>🔍 How Priority Arrays Work:</strong></p>
              <ul className="list-disc pl-6 mt-2 text-blue-700 dark:text-blue-300 space-y-1">
                <li>Items are automatically sorted by value (highest at top)</li>
                <li>Each item must have a unique value between 0-100</li>
                <li>Drag items to reorder them or use the up/down arrows</li>
                <li>Edit values directly in the number field</li>
                <li>Values are automatically adjusted to prevent duplicates</li>
              </ul>
            </div>
            <RankingItems items={items} listId={currentList._id} mode="unified" />
          </div>
        ) : (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-2xl text-center shadow-soft backdrop-blur-md">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">🔍 No Priority Array Selected</h3>
            <p className="text-gray-600 dark:text-gray-300">Select a priority array from the sidebar or create a new one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValueRank;
