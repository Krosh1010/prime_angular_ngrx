import { createReducer, on } from '@ngrx/store';
import { loginSuccess, loginFailure, logout, registerSuccess, registerFailure } from '../actions/auth.actions';

export interface AuthState {
  token: string | null;
  error: string | null;
  email: string | null;
}

const initialState: AuthState = {
  token: null,
  error: null,
  email: null,
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { token, email }) => ({
    ...state,
    token,
    email,
    error: null,
  })),
  on(loginFailure, registerFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(registerSuccess, (state, { token, email }) => ({
    ...state,
    token,
    email,
    error: null,
  })),
  on(registerFailure, (state, { error }) => ({
    ...state,
    error,
  })),
  on(logout, (state) => ({
    ...state,
    token: null,
    email: null,
    error: null,
  }))
);
