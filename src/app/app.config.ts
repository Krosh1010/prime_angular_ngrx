import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authReducer } from './store/reducers/auth.reducers'; 
import { AuthEffects } from './store/effects/auth.effects'; 
import { SEOEfects } from './store/effects/seo.effects';
import { seoReducer } from './store/reducers/seo.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    ReactiveFormsModule,
    provideStore({
      auth: authReducer, 
      seo: seoReducer
    }),
    provideEffects([AuthEffects, SEOEfects]), 
    provideRouterStore(),
    provideStoreDevtools(),
  ],
};
