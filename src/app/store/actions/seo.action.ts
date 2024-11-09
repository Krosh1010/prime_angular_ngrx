
import { createAction, props } from '@ngrx/store';
import { SEOData } from '../../models/seo_model';

export const loadSEOData = createAction('[SEO] Load Data');
export const loadSEODataSuccess = createAction('[SEO] Load Data Success', props<{ data: SEOData }>());
export const loadSEODataFailure = createAction('[SEO] Load Data Failure', props<{ error: any }>());

export const submitSeoLink = createAction(
    '[SEO] Submit SEO Link',
    props<{ url: string }>() // URL-ul trimis la backend pentru procesare
  );
  
  export const submitSeoLinkSuccess = createAction(
    '[SEO] Submit SEO Link Success'
  );
  
  export const submitSeoLinkFailure = createAction(
    '[SEO] Submit SEO Link Failure',
    props<{ error: any }>()
  );
