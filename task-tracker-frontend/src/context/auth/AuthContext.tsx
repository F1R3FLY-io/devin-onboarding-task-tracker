import React, { createContext, useReducer } from 'react';
import axios from 'axios';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken';

type User = {
  _id: string;
  name: string;
  email: string;
};

type AuthState = {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  error: string | null;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
};

type LoginData = {
  email: string;
  password: string;
};

type AuthContextType = {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  error: string | null;
  register: (formData: RegisterData) => Promise<void>;
  login: (formData: LoginData) => Promise<void>;
  logout: () => void;
  clearErrors: () => void;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null,
  register: async () => {},
  login: async () => {},
  logout: () => {},
  clearErrors: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialState: AuthState = {
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    loading: true,
    user: null,
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get(`${API_URL}/auth`);

      dispatch({
        type: 'USER_LOADED',
        payload: res.data
      });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR' });
    }
  };

  const register = async (formData: RegisterData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post(
        `${API_URL}/users`,
        formData,
        config
      );

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data
      });

      await loadUser();
    } catch (err: any) {
      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data.msg || 'Registration failed'
      });
    }
  };

  const login = async (formData: LoginData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      console.log('Login attempt with:', formData.email);
      console.log('API URL:', `${API_URL}/auth`);
      
      const res = await axios.post(
        `${API_URL}/auth`,
        formData,
        config
      );

      console.log('Login response:', res.data);
      
      localStorage.setItem('token', res.data.token);
      setAuthToken(res.data.token);
      console.log('Auth token set in localStorage and axios headers');
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data
      });
      
      setTimeout(async () => {
        console.log('Loading user after delay, token:', localStorage.getItem('token'));
        try {
          await loadUser();
        } catch (loadErr: any) {
          console.error('Error loading user after login:', loadErr.message);
        }
      }, 500);
    } catch (err: any) {
      console.error('Login error:', err.response?.data || err.message);
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data.msg || 'Login failed'
      });
    }
  };

  const logout = () => dispatch({ type: 'LOGOUT' });

  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  React.useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        clearErrors
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
