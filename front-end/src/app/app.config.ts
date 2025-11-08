import { provideAppInitializer, inject, ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { LookupsService } from './core/services/lookups/lookups.service';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideStore } from '@ngrx/store';
import { UsersEffects } from './store/users/users.effects';
import { usersReducer } from './store/users/users.reducer';
import { AppInitService } from './app.service';
import { AnnouncementsEffects } from './store/announcements/announcements.effects';
import { announcementsReducer } from './store/announcements/announcements.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(async () => {
      const lookupsService = inject(LookupsService);
      const appService = inject(AppInitService);
      const lookups = await firstValueFrom(lookupsService.getAllLookups());
      lookupsService.setLookups(lookups);
      appService.initCurrentUser();
    }),
    provideHttpClient(withFetch()),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({
      users: usersReducer,
      announcements: announcementsReducer
    }),
    provideStoreDevtools({ maxAge: 25 }),
    provideEffects([UsersEffects, AnnouncementsEffects]),
  ]
};