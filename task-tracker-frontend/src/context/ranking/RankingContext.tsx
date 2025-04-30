import React, { createContext, useReducer } from 'react';
import axios from 'axios';
import rankingReducer from './rankingReducer';

export type RankingList = {
  _id: string;
  name: string;
  mode: 'unified';
  user: string;
  createdAt: string;
};

export type RankingItem = {
  _id: string;
  text: string;
  value: number;
  list: string;
  user: string;
  taskId: string | null;
  createdAt: string;
};

type RankingState = {
  lists: RankingList[];
  currentList: RankingList | null;
  items: RankingItem[];
  currentItem: RankingItem | null;
  loading: boolean;
  error: string | null;
};

type RankingContextType = {
  lists: RankingList[];
  currentList: RankingList | null;
  items: RankingItem[];
  currentItem: RankingItem | null;
  loading: boolean;
  error: string | null;
  getLists: () => Promise<void>;
  addList: (list: Omit<RankingList, '_id' | 'user' | 'createdAt'>) => Promise<void>;
  updateList: (list: RankingList) => Promise<void>;
  deleteList: (id: string) => Promise<void>;
  setCurrentList: (list: RankingList) => void;
  clearCurrentList: () => void;
  getItems: (listId: string) => Promise<void>;
  addItem: (item: Omit<RankingItem, '_id' | 'user' | 'createdAt' | 'list'>, listId: string) => Promise<void>;
  updateItem: (item: RankingItem) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  setCurrentItem: (item: RankingItem) => void;
  clearCurrentItem: () => void;
  resetItemValues: (listId: string) => Promise<void>;
  addItemBetween: (text: string, listId: string, beforeValue?: number, afterValue?: number, taskId?: string) => Promise<void>;
  clearErrors: () => void;
};

const RankingContext = createContext<RankingContextType>({
  lists: [],
  currentList: null,
  items: [],
  currentItem: null,
  loading: true,
  error: null,
  getLists: async () => {},
  addList: async () => {},
  updateList: async () => {},
  deleteList: async () => {},
  setCurrentList: () => {},
  clearCurrentList: () => {},
  getItems: async () => {},
  addItem: async () => {},
  updateItem: async () => {},
  deleteItem: async () => {},
  setCurrentItem: () => {},
  clearCurrentItem: () => {},
  resetItemValues: async () => {},
  addItemBetween: async () => {},
  clearErrors: () => {}
});

export const RankingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState: RankingState = {
    lists: [],
    currentList: null,
    items: [],
    currentItem: null,
    loading: true,
    error: null
  };

  const [state, dispatch] = useReducer(rankingReducer, initialState);

  const getLists = async () => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/rankinglists`;
      const res = await axios.get(apiUrl);

      dispatch({
        type: 'GET_LISTS',
        payload: res.data
      });
    } catch (err: any) {
      dispatch({
        type: 'RANKING_ERROR',
        payload: err.response?.data.msg || 'Error fetching ranking lists'
      });
    }
  };

  const addList = async (list: Omit<RankingList, '_id' | 'user' | 'createdAt'>) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/rankinglists`;
      const res = await axios.post(
        apiUrl,
        list,
        config
      );

      dispatch({
        type: 'ADD_LIST',
        payload: res.data
      });
    } catch (err: any) {
      dispatch({
        type: 'RANKING_ERROR',
        payload: err.response?.data.msg || 'Error adding ranking list'
      });
    }
  };

  const updateList = async (list: RankingList) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/rankinglists/${list._id}`,
        {
          name: list.name,
          mode: list.mode
        },
        config
      );

      dispatch({
        type: 'UPDATE_LIST',
        payload: res.data
      });
    } catch (err: any) {
      dispatch({
        type: 'RANKING_ERROR',
        payload: err.response?.data.msg || 'Error updating ranking list'
      });
    }
  };

  const deleteList = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/rankinglists/${id}`);

      dispatch({
        type: 'DELETE_LIST',
        payload: id
      });
    } catch (err: any) {
      dispatch({
        type: 'RANKING_ERROR',
        payload: err.response?.data.msg || 'Error deleting ranking list'
      });
    }
  };

  const setCurrentList = (list: RankingList) => {
    dispatch({ type: 'SET_CURRENT_LIST', payload: list });
  };

  const clearCurrentList = () => {
    dispatch({ type: 'CLEAR_CURRENT_LIST' });
  };

  const getItems = async (listId: string) => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL}/rankingitems/${listId}`;
      const res = await axios.get(apiUrl);

      dispatch({
        type: 'GET_ITEMS',
        payload: res.data
      });
    } catch (err: any) {
      dispatch({
        type: 'RANKING_ERROR',
        payload: err.response?.data.msg || 'Error fetching items'
      });
    }
  };

  const addItem = async (
    item: Omit<RankingItem, '_id' | 'user' | 'createdAt' | 'list'>,
    listId: string
  ) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/rankingitems/${listId}`,
        item,
        config
      );

      dispatch({
        type: 'ADD_ITEM',
        payload: res.data
      });
    } catch (err: any) {
      dispatch({
        type: 'RANKING_ERROR',
        payload: err.response?.data.msg || 'Error adding item'
      });
    }
  };

  const updateItem = async (item: RankingItem) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/rankingitems/${item._id}`,
        {
          text: item.text,
          value: item.value,
          taskId: item.taskId
        },
        config
      );

      dispatch({
        type: 'UPDATE_ITEM',
        payload: res.data
      });
    } catch (err: any) {
      dispatch({
        type: 'RANKING_ERROR',
        payload: err.response?.data.msg || 'Error updating item'
      });
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/rankingitems/${id}`);

      dispatch({
        type: 'DELETE_ITEM',
        payload: id
      });
    } catch (err: any) {
      dispatch({
        type: 'RANKING_ERROR',
        payload: err.response?.data.msg || 'Error deleting item'
      });
    }
  };

  const setCurrentItem = (item: RankingItem) => {
    dispatch({ type: 'SET_CURRENT_ITEM', payload: item });
  };

  const clearCurrentItem = () => {
    dispatch({ type: 'CLEAR_CURRENT_ITEM' });
  };

  const resetItemValues = async (listId: string) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/rankingitems/${listId}/reset`);

      dispatch({
        type: 'RESET_ITEMS',
        payload: res.data
      });
    } catch (err: any) {
      dispatch({
        type: 'RANKING_ERROR',
        payload: err.response?.data.msg || 'Error resetting item values'
      });
    }
  };

  const addItemBetween = async (
    text: string,
    listId: string,
    beforeValue?: number,
    afterValue?: number,
    taskId?: string
  ) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const data: any = { text };
    if (beforeValue !== undefined) data.beforeValue = beforeValue;
    if (afterValue !== undefined) data.afterValue = afterValue;
    if (taskId) data.taskId = taskId;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/rankingitems/${listId}/addBetween`,
        data,
        config
      );

      dispatch({
        type: 'ADD_ITEM',
        payload: res.data
      });
    } catch (err: any) {
      dispatch({
        type: 'RANKING_ERROR',
        payload: err.response?.data.msg || 'Error adding item between values'
      });
    }
  };

  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  return (
    <RankingContext.Provider
      value={{
        lists: state.lists,
        currentList: state.currentList,
        items: state.items,
        currentItem: state.currentItem,
        loading: state.loading,
        error: state.error,
        getLists,
        addList,
        updateList,
        deleteList,
        setCurrentList,
        clearCurrentList,
        getItems,
        addItem,
        updateItem,
        deleteItem,
        setCurrentItem,
        clearCurrentItem,
        resetItemValues,
        addItemBetween,
        clearErrors
      }}
    >
      {children}
    </RankingContext.Provider>
  );
};

export default RankingContext;
