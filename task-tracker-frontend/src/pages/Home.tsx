import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TaskForm from '../components/tasks/TaskForm';
import TaskList from '../components/tasks/TaskList';
import AuthContext from '../context/auth/AuthContext';
import { TaskProvider } from '../context/task/TaskContext';

const Home = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const { isAuthenticated, loading } = authContext;

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  return (
    <TaskProvider>
      <div className="container mx-auto px-4 py-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <TaskForm />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Tasks</h2>
            <TaskList />
          </div>
        </div>
      </div>
    </TaskProvider>
  );
};

export default Home;
