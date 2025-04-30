import React, { useState, useContext, useEffect } from 'react';
import RankingContext from '../../context/ranking/RankingContext';

type RankingListFormProps = {
  onClose: () => void;
};

const RankingListForm: React.FC<RankingListFormProps> = ({ onClose }) => {
  const rankingContext = useContext(RankingContext);
  const { addList, updateList, currentList, clearCurrentList } = rankingContext;

  const [list, setList] = useState({
    name: '',
    mode: 'distributed'
  });

  useEffect(() => {
    if (currentList !== null) {
      setList({
        name: currentList.name,
        mode: currentList.mode
      });
    } else {
      setList({
        name: '',
        mode: 'distributed'
      });
    }
  }, [currentList]);

  const { name, mode } = list;

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setList({ ...list, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (name.trim() === '') {
      alert('Please enter a name for the list');
      return;
    }

    if (currentList === null) {
      addList({
        name,
        mode: mode as 'incremental' | 'distributed'
      });
    } else {
      updateList({
        ...currentList,
        name,
        mode: mode as 'incremental' | 'distributed'
      });
    }

    clearAll();
    onClose();
  };

  const clearAll = () => {
    clearCurrentList();
  };

  return (
    <form onSubmit={onSubmit} className="bg-white shadow-md rounded px-6 pt-4 pb-6 mb-4">
      <h2 className="text-xl font-bold mb-4">{currentList ? 'Edit List' : 'Add List'}</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Name
        </label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="List Name"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="mode">
          Mode
        </label>
        <select
          name="mode"
          value={mode}
          onChange={onChange}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="distributed">Distributed (0-100 scale)</option>
          <option value="incremental">Incremental (Sequential numbers)</option>
        </select>
        <p className="text-xs text-gray-500 mt-1">
          {mode === 'distributed' 
            ? 'Values will be evenly distributed between 0-100 when reset' 
            : 'Values will be sequential integers when reset'}
        </p>
      </div>
      <div className="flex items-center justify-between">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {currentList ? 'Update List' : 'Add List'}
        </button>
        {currentList && (
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

export default RankingListForm;
