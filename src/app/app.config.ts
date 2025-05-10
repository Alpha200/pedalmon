import {ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';
import {routes} from './app.routes';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {authConfig} from './auth/auth.config';
import {authInterceptor, OidcSecurityService, provideAuth} from 'angular-auth-oidc-client';
import {firstValueFrom} from 'rxjs';

export const appConfig: ApplicationConfig = {
	providers: [
		provideZoneChangeDetection({ eventCoalescing: true }),
		provideRouter(routes),
		provideHttpClient(withInterceptors([authInterceptor()])),
		provideAuth(authConfig),
		provideAppInitializer(() =>{
			const oss = inject(OidcSecurityService);
			return firstValueFrom(oss.checkAuth());
		})
	]
};
