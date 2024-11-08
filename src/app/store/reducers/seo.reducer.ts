// src/app/store/seo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as SEOActions from '../actions/seo.action';
import { SEOData } from '../../models/seo_model';


export interface SEOState {
  data: SEOData | null;
  loading: boolean;
  error: any;
}

export const initialState: SEOState = {
  data: null,
  loading: false,
  error: null,
};

export const seoReducer = createReducer(
  initialState,
  on(SEOActions.loadSEOData, state => ({ ...state, loading: true })),
  on(SEOActions.loadSEODataSuccess, (state, { data }) => ({ ...state, loading: false, data })),
  on(SEOActions.loadSEODataFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
