// src/app/store/seo.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as SEOActions from '../actions/seo.action';
import { SEOData } from '../../models/seo_model';
import { MOCK_SEO_DATA } from '../mok.data/mok_seo_data';

export interface SEOState {
  data: SEOData | null;
  loading: boolean;
  error: any;
}

export const initialState: SEOState = {
  data: MOCK_SEO_DATA,
  loading: false,
  error: null,
};

export const seoReducer = createReducer(
  initialState,
  on(SEOActions.loadSEOData, state => ({ ...state, loading: true })),
  on(SEOActions.loadSEODataSuccess, (state, { data }) => ({ ...state, loading: false, data })),
  on(SEOActions.loadSEODataFailure, (state, { error }) => ({ ...state, loading: false, error }))
);
