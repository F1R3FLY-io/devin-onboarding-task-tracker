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
          <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded shadow-lg">
            <div className="flex justify-between">
              <p className="font-bold">Note</p>
              <button 
                onClick={() => rankingContext.clearErrors()}
                className="text-yellow-800 hover:text-yellow-600"
              >
                ×
              </button>
            </div>
            <p>Values are automatically adjusted to prevent duplicates.</p>
            <div className="mt-2 text-sm">
              <p>Items are sorted by their value (highest at top).</p>
              <p>Each item must have a unique value between 0-100.</p>
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="fixed top-4 right-4 z-50 max-w-md">
        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded shadow-lg">
          <div className="flex justify-between">
            <p className="font-bold">Error</p>
            <button 
              onClick={() => rankingContext.clearErrors()}
              className="text-red-800 hover:text-red-600"
            >
              ×
            </button>
          </div>
          <p>{error}</p>
          <button 
            onClick={() => {
              rankingContext.clearErrors();
              
              if (currentList) {
                getItems(currentList._id);
              } else {
                getLists();
              }
            }} 
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 font-bold py-1 px-3 rounded text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Render error notification if there is an error */}
      {renderErrorNotification()}
      
      <div className="md:col-span-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Priority Arrays</h2>
          <button
            onClick={toggleListForm}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
          >
            {showListForm ? 'Cancel' : 'Add Priority Array'}
          </button>
        </div>
        
        {showListForm && <RankingListForm onClose={() => setShowListForm(false)} />}
        
        {rankingLoading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mb-2"></div>
            <p>Loading priority arrays...</p>
          </div>
        ) : lists.length === 0 ? (
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <p className="mb-2">You don't have any priority arrays yet.</p>
            <button
              onClick={toggleListForm}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
            >
              Create Your First Priority Array
            </button>
          </div>
        ) : (
          <RankingLists lists={lists} />
        )}
      </div>
      
      <div className="md:col-span-2">
        {currentList ? (
          <>
            {isEditingTitle ? (
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="border rounded py-1 px-2 mr-2 text-2xl font-bold"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveTitleEdit();
                    if (e.key === 'Escape') cancelTitleEditing();
                  }}
                />
                <button 
                  onClick={saveTitleEdit} 
                  className="text-green-500 hover:text-green-700 mr-1 text-xl" 
                  title="Save"
                >
                  ✓
                </button>
                <button 
                  onClick={cancelTitleEditing} 
                  className="text-red-500 hover:text-red-700 text-xl" 
                  title="Cancel"
                >
                  ✗
                </button>
              </div>
            ) : (
              <div className="flex items-center mb-4">
                <h2 className="text-2xl font-bold mr-2">{currentList.name}</h2>
                <button 
                  onClick={startTitleEditing} 
                  className="text-gray-500 hover:text-gray-700 text-sm"
                  title="Rename"
                >
                  ✏️
                </button>
              </div>
            )}
            <p className="mb-4 text-gray-600">
              Higher values (0-100) indicate higher priority
            </p>
            <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 p-3 rounded text-sm">
              <p><strong>How Priority Arrays Work:</strong></p>
              <ul className="list-disc pl-5 mt-1">
                <li>Items are automatically sorted by value (highest at top)</li>
                <li>Each item must have a unique value between 0-100</li>
                <li>Drag items to reorder them or use the up/down arrows</li>
                <li>Edit values directly in the number field</li>
                <li>Values are automatically adjusted to prevent duplicates</li>
              </ul>
            </div>
            <RankingItems items={items} listId={currentList._id} mode="unified" />
          </>
        ) : (
          <div className="bg-gray-100 p-6 rounded-lg text-center">
            <h3 className="text-xl mb-2">No Priority Array Selected</h3>
            <p>Select a priority array from the sidebar or create a new one to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValueRank;
