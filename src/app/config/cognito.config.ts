export interface CognitoConfig {
  userPoolId: string;
  userPoolClientId: string;
  region: string;
  identityPoolId?: string;
  signUpVerificationMethod?: 'code' | 'link';
  loginWith?: {
    email?: boolean;
    phone?: boolean;
    username?: boolean;
  };
}

// TODO: Replace placeholder values with your actual Cognito configuration
export const cognitoConfig: CognitoConfig = {
  userPoolId: 'us-east-1_UNBEtoOO9',
  userPoolClientId: '1m4odg7biild9dujdobtrh0q7r',
  region: 'us-east-1', // e.g. 'us-east-1'
  // identityPoolId: 'YOUR_IDENTITY_POOL_ID', // optional, only if you use Federated Identities
  signUpVerificationMethod: 'code',
  loginWith: { email: true, phone: false, username: false }
};


