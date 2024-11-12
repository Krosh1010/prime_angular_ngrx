import { createReducer, on } from '@ngrx/store';
import { loginSuccess, loginFailure, logout, registerSuccess, registerFailure } from '../actions/auth.actions';

export interface AuthState {
  token: string | null;
  error: string | null;
  email: string | null;
}

// auth.reducer.ts
const initialState: AuthState = initializeAuthState();

export function initializeAuthState(): AuthState {
  const token = localStorage.getItem('token');
  const email = localStorage.getItem('email');
  if (token && email) {
    return {
      token,
      email,
      error: null,
    };
  }
  return {
    token: null,
    email: null,
    error: null,
  };
}

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, registerSuccess, (state, { token, email }) => {
    // Salvăm token-ul și email-ul în localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('email', email);
    return {
      ...state,
      token,
      email,
      error: null,
    };
  }),
  on(loginFailure, registerFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(logout, (state) => {
    // Eliminăm token-ul și email-ul din localStorage la logout
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    return {
      ...state,
      token: null,
      email: null,
      error: null,
    };
  })
);


