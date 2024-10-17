import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { ReactiveFormsModule } from '@angular/forms';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouterStore } from '@ngrx/router-store';
import { provideStoreDevtools } from '@ngrx/store-devtools';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    ReactiveFormsModule,
    provideStore({
     // Adaugă reducer-ele tale aici
    }),
    provideEffects(), // Adaugă efectele tale aici
    provideRouterStore(),
    provideStoreDevtools(),
  ],
};
