import { RankingList, RankingItem } from './RankingContext';

type RankingState = {
  lists: RankingList[];
  currentList: RankingList | null;
  items: RankingItem[];
  currentItem: RankingItem | null;
  loading: boolean;
  error: string | null;
};

type RankingAction =
  | { type: 'GET_LISTS'; payload: RankingList[] }
  | { type: 'ADD_LIST'; payload: RankingList }
  | { type: 'UPDATE_LIST'; payload: RankingList }
  | { type: 'DELETE_LIST'; payload: string }
  | { type: 'SET_CURRENT_LIST'; payload: RankingList }
  | { type: 'CLEAR_CURRENT_LIST' }
  | { type: 'GET_ITEMS'; payload: RankingItem[] }
  | { type: 'ADD_ITEM'; payload: RankingItem }
  | { type: 'UPDATE_ITEM'; payload: RankingItem }
  | { type: 'DELETE_ITEM'; payload: string }
  | { type: 'SET_CURRENT_ITEM'; payload: RankingItem }
  | { type: 'CLEAR_CURRENT_ITEM' }
  | { type: 'RESET_ITEMS'; payload: RankingItem[] }
  | { type: 'RANKING_ERROR'; payload: string }
  | { type: 'CLEAR_ERRORS' };

const rankingReducer = (state: RankingState, action: RankingAction): RankingState => {
  switch (action.type) {
    case 'GET_LISTS':
      return {
        ...state,
        lists: action.payload,
        loading: false
      };
    case 'ADD_LIST':
      return {
        ...state,
        lists: [action.payload, ...state.lists],
        loading: false
      };
    case 'UPDATE_LIST':
      return {
        ...state,
        lists: state.lists.map(list =>
          list._id === action.payload._id ? action.payload : list
        ),
        loading: false
      };
    case 'DELETE_LIST':
      return {
        ...state,
        lists: state.lists.filter(list => list._id !== action.payload),
        currentList: state.currentList?._id === action.payload ? null : state.currentList,
        items: state.currentList?._id === action.payload ? [] : state.items,
        loading: false
      };
    case 'SET_CURRENT_LIST':
      return {
        ...state,
        currentList: action.payload
      };
    case 'CLEAR_CURRENT_LIST':
      return {
        ...state,
        currentList: null,
        items: [],
        currentItem: null
      };
    case 'GET_ITEMS':
      return {
        ...state,
        items: action.payload,
        loading: false
      };
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload].sort((a, b) => a.value - b.value),
        loading: false
      };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item._id === action.payload._id ? action.payload : item
        ).sort((a, b) => a.value - b.value),
        loading: false
      };
    case 'DELETE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item._id !== action.payload),
        currentItem: state.currentItem?._id === action.payload ? null : state.currentItem,
        loading: false
      };
    case 'SET_CURRENT_ITEM':
      return {
        ...state,
        currentItem: action.payload
      };
    case 'CLEAR_CURRENT_ITEM':
      return {
        ...state,
        currentItem: null
      };
    case 'RESET_ITEMS':
      return {
        ...state,
        items: action.payload,
        loading: false
      };
    case 'RANKING_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false // Ensure loading is set to false when an error occurs
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

export default rankingReducer;
