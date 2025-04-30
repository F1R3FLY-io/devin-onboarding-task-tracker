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

type AuthAction =
  | { type: 'USER_LOADED'; payload: User }
  | { type: 'REGISTER_SUCCESS'; payload: { token: string } }
  | { type: 'LOGIN_SUCCESS'; payload: { token: string } }
  | { type: 'REGISTER_FAIL' }
  | { type: 'AUTH_ERROR' }
  | { type: 'LOGIN_FAIL' }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'REGISTER_FAIL'; payload: string }
  | { type: 'LOGIN_FAIL'; payload: string };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'REGISTER_SUCCESS':
    case 'LOGIN_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    case 'REGISTER_FAIL':
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: 'payload' in action ? action.payload : null
      };
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

export default authReducer;
