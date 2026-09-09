import React, { createContext, useReducer, useMemo } from 'react';

const getInitialState = () => {
  let savedUser = {};
  let isLoggedIn = false;
  let isMerchant = false;

  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
    const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
    const userEmail = typeof window !== 'undefined' ? localStorage.getItem('user_email') : null;
    const userName = typeof window !== 'undefined' ? localStorage.getItem('user_name') : null;
    const savedMerchant = typeof window !== 'undefined' ? localStorage.getItem('user_is_merchant') : null;

    if (token || userEmail) {
      isLoggedIn = true;
      isMerchant = savedMerchant === 'true';
      savedUser = {
        _id: userId || 'usr_01',
        email: userEmail || 'user@gmail.com',
        name: userName || (userEmail ? userEmail.split('@')[0] : 'User'),
        isMerchant: isMerchant,
      };
    }
  } catch (e) {}

  return {
    loading: true,
    isLoggedIn,
    isMerchant,
    page: {
      login: true,
      registration: false,
      item: false,
    },
    items: [],
    error: {
      error: false,
      msg: '',
    },
    success: {
      error: false,
      msg: '',
    },
    user: savedUser,
    categories: [],
    states: [],
    search: {
      name: '',
      state: '',
      city: '',
      category: '',
    },
  };
};

const initial = getInitialState();
export const GlobalContext = createContext(initial);
const reducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoggedIn: true,
      };
    case 'SET_MERCHANT':
      localStorage.setItem('user_is_merchant', String(action.isMerchant));
      return {
        ...state,
        isMerchant: action.isMerchant,
      };
    case 'LOGOUT':
      localStorage.removeItem('auth-token');
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_name');
      localStorage.removeItem('user_is_merchant');
      return {
        ...state,
        page: { login: true, registration: false, item: false },
        user: {},
        isLoggedIn: false,
        isMerchant: false,
      };
    case 'SET_SEARCH_PARAMS':
      return {
        ...state,
        search: action.payload,
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
      };
    case 'SET_STATES':
      return {
        ...state,
        states: action.payload,
      };
    case 'SET_USER':
      if (action.payload) {
        if (action.payload._id) localStorage.setItem('user_id', action.payload._id);
        if (action.payload.email) localStorage.setItem('user_email', action.payload.email);
        if (action.payload.name) localStorage.setItem('user_name', action.payload.name);
        if (action.payload.isMerchant !== undefined) {
          localStorage.setItem('user_is_merchant', String(action.payload.isMerchant));
        }
      }
      return {
        ...state,
        user: action.payload,
        isLoggedIn: true,
        isMerchant: !!(action.payload && action.payload.isMerchant),
      };
    case 'SET_HOBBI':
      return {
        ...state,
        items: action.payload,
        loading: false,
      };
    case 'DELETE_HOBBI':
      return {
        ...state,
        // eslint-disable-next-line no-underscore-dangle
        items: state.items.filter((item) => item._id !== action.payload),
      };
    case 'ADD_HOBBI':
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case 'REGISTRACTIONPAGE':
      return {
        ...state,
        page: { login: false, registration: true, item: false },
      };
    case 'ITEMPAGE':
      return {
        ...state,
        page: { login: false, registration: false, item: true },
      };
    case 'LOGINPAGE':
      return {
        ...state,
        page: { login: true, registration: false, item: false },
      };

    case 'ERROR':
      return {
        ...state,
        error: {
          error: true,
          msg: action.payload,
        },
      };
    case 'SUCCESS':
      return {
        ...state,
        success: {
          success: true,
          msg: action.payload,
        },
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: {
          error: false,
          msg: '',
        },
        success: {
          success: false,
          msg: '',
        },
      };
    default:
      return state;
  }
};
export function Provider({ children }) {
  const [data, dispatch] = useReducer(reducer, initial);
  const value = useMemo(() => ({ data, dispatch }), [data, dispatch]);
  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}
