"use client";

import { createContext, useContext, useReducer } from 'react';

const CheckoutContext = createContext();

const initialState = {
  shipping: {
    id: "",
    cost: 0,
    isCalculating: false,
    error: null
  },
  coupon: {
    name: "",
    applied: false,
    type: null, // 'fixed' o 'percentage'
    discount: 0,
    coupon: null
  },
  payment: {
    isProcessing: false,
    error: null
  }
};

function checkoutReducer(state, action) {
  switch (action.type) {
    case 'SET_SHIPPING':
      return {
        ...state,
        shipping: {
          ...state.shipping,
          ...action.payload
        }
      };
    case 'SET_COUPON':
      return {
        ...state,
        coupon: {
          ...state.coupon,
          ...action.payload
        }
      };
    case 'CLEAR_COUPON':
      return {
        ...state,
        coupon: {
          name: "",
          applied: false,
          type: null,
          discount: 0,
          coupon: null
        }
      };
    case 'SET_PAYMENT_ERROR':
      return {
        ...state,
        payment: {
          ...state.payment,
          error: action.payload
        }
      };
    case 'RESET_CHECKOUT':
      return initialState;
    default:
      return state;
  }
}

export function CheckoutProvider({ children }) {
  const [state, dispatch] = useReducer(checkoutReducer, initialState);

  return (
    <CheckoutContext.Provider value={{ state, dispatch }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};