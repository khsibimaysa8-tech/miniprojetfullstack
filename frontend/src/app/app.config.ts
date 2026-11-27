import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { routes } from './app.routes';

// bch les montants yetaffichiw b format français (2 000,000)
registerLocaleData(localeFr);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),     // les routes
    provideHttpClient(),       // bch nesta3mlou HttpClient
    { provide: LOCALE_ID, useValue: 'fr-FR' }
  ]
};
