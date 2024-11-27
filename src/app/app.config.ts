import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideToastr } from 'ngx-toastr';
import { ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(FormsModule,
      BrowserAnimationsModule,
      ToastrModule.forRoot({timeOut: 3000, // 기본 알림 시간
      positionClass: 'toast-bottom-right', // 알림 위치
      preventDuplicates: true,})
      ),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideToastr(),
  ]
};
