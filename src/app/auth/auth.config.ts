import {PassedInitialConfig} from 'angular-auth-oidc-client';
import {environment} from '../../environments/environment';

export const authConfig: PassedInitialConfig = {
	config: {
		authority: environment.api.authority,
		redirectUrl: window.location.origin,
		postLogoutRedirectUri: window.location.origin,
		clientId: 'pedalmon',
		scope: 'openid profile',
		responseType: 'code',
		silentRenew: true,
		useRefreshToken: true,
		renewTimeBeforeTokenExpiresInSeconds: 60,
		postLoginRoute: '/',
		secureRoutes: [environment.api.baseUrl],
	}
}
