
import { createAction, props } from '@ngrx/store';
import { SEOData } from '../../models/seo_model';

export const loadSEOData = createAction('[SEO] Load Data');
export const loadSEODataSuccess = createAction('[SEO] Load Data Success', props<{ data: SEOData }>());
export const loadSEODataFailure = createAction('[SEO] Load Data Failure', props<{ error: any }>());
