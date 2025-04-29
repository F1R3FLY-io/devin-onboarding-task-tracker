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

type TaskAction =
  | { type: 'GET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'DELETE_TASK'; payload: string }
  | { type: 'SET_CURRENT'; payload: Task }
  | { type: 'CLEAR_CURRENT' }
  | { type: 'UPDATE_TASK'; payload: Task }
  | { type: 'TASK_ERROR'; payload: string }
  | { type: 'CLEAR_TASKS' }
  | { type: 'CLEAR_ERRORS' };

const taskReducer = (state: TaskState, action: TaskAction): TaskState => {
  switch (action.type) {
    case 'GET_TASKS':
      return {
        ...state,
        tasks: action.payload,
        loading: false
      };
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [action.payload, ...state.tasks],
        loading: false
      };
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task._id !== action.payload),
        loading: false
      };
    case 'SET_CURRENT':
      return {
        ...state,
        current: action.payload
      };
    case 'CLEAR_CURRENT':
      return {
        ...state,
        current: null
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task._id === action.payload._id ? action.payload : task
        ),
        loading: false
      };
    case 'TASK_ERROR':
      return {
        ...state,
        error: action.payload
      };
    case 'CLEAR_TASKS':
      return {
        ...state,
        tasks: [],
        current: null,
        loading: false,
        error: null
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

export default taskReducer;
