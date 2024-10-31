import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';  
import { appConfig } from './app/app.config'; 

bootstrapApplication(AppComponent, {
  providers: [
    appConfig.providers,
    importProvidersFrom(HttpClientModule),  
  ],
}).catch(err => console.error('Error bootstrapping application:', err));
