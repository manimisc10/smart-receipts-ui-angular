import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { Amplify } from 'aws-amplify';
import { cognitoConfig } from './config/cognito.config';

// Configure Amplify once at application startup
const cognito: any = {
  userPoolId: cognitoConfig.userPoolId,
  userPoolClientId: cognitoConfig.userPoolClientId,
  signUpVerificationMethod: cognitoConfig.signUpVerificationMethod ?? 'code',
  loginWith: cognitoConfig.loginWith ?? { email: true }
};

if (cognitoConfig.identityPoolId) {
  cognito.identityPoolId = cognitoConfig.identityPoolId;
}

Amplify.configure({
  Auth: {
    Cognito: cognito
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient()
  ]
};
