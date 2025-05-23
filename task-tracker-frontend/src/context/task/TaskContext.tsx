import React, { createContext, useReducer } from 'react';
import axios from 'axios';
import taskReducer from './taskReducer';

type Task = {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'completed';
  user: string;
  createdAt: string;
};

type TaskState = {
  tasks: Task[];
  current: Task | null;
  loading: boolean;
  error: string | null;
};

type TaskContextType = {
  tasks: Task[];
  current: Task | null;
  loading: boolean;
  error: string | null;
  getTasks: () => Promise<void>;
  addTask: (task: Omit<Task, '_id' | 'user' | 'createdAt'>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setCurrent: (task: Task) => void;
  clearCurrent: () => void;
  updateTask: (task: Task) => Promise<void>;
  clearTasks: () => void;
  clearErrors: () => void;
};

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  current: null,
  loading: true,
  error: null,
  getTasks: async () => {},
  addTask: async () => {},
  deleteTask: async () => {},
  setCurrent: () => {},
  clearCurrent: () => {},
  updateTask: async () => {},
  clearTasks: () => {},
  clearErrors: () => {}
});

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState: TaskState = {
    tasks: [],
    current: null,
    loading: true,
    error: null
  };

  const [state, dispatch] = useReducer(taskReducer, initialState);

  const getTasks = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/tasks`);

      dispatch({
        type: 'GET_TASKS',
        payload: res.data
      });
    } catch (err: any) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response?.data.msg || 'Error fetching tasks'
      });
    }
  };

  const addTask = async (task: Omit<Task, '_id' | 'user' | 'createdAt'>) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/tasks`,
        task,
        config
      );

      dispatch({
        type: 'ADD_TASK',
        payload: res.data
      });
    } catch (err: any) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response?.data.msg || 'Error adding task'
      });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/tasks/${id}`);

      dispatch({
        type: 'DELETE_TASK',
        payload: id
      });
    } catch (err: any) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response?.data.msg || 'Error deleting task'
      });
    }
  };

  const setCurrent = (task: Task) => {
    dispatch({ type: 'SET_CURRENT', payload: task });
  };

  const clearCurrent = () => {
    dispatch({ type: 'CLEAR_CURRENT' });
  };

  const updateTask = async (task: Task) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/tasks/${task._id}`,
        task,
        config
      );

      dispatch({
        type: 'UPDATE_TASK',
        payload: res.data
      });
    } catch (err: any) {
      dispatch({
        type: 'TASK_ERROR',
        payload: err.response?.data.msg || 'Error updating task'
      });
    }
  };

  const clearTasks = () => {
    dispatch({ type: 'CLEAR_TASKS' });
  };

  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
  };

  return (
    <TaskContext.Provider
      value={{
        tasks: state.tasks,
        current: state.current,
        loading: state.loading,
        error: state.error,
        getTasks,
        addTask,
        deleteTask,
        setCurrent,
        clearCurrent,
        updateTask,
        clearTasks,
        clearErrors
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
