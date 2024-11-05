// src/app/store/seo.selectors.ts
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { SEOState } from '../reducers/seo.reducer';

export const selectSEOState = createFeatureSelector<SEOState>('seo');

export const selectSEOData = createSelector(selectSEOState, state => state.data);
export const selectSEOLoading = createSelector(selectSEOState, state => state.loading);
export const selectSEOError = createSelector(selectSEOState, state => state.error);
