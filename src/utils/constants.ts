export const SSO_URL = process.env.REACT_APP_SSO_URL;
export const API_URL = process.env.REACT_APP_API_URL;
export const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

export const LOGIN_URL = `${SSO_URL}/auth/realms/shoppinglist/protocol/openid-connect/auth?response_type=code&client_id=App&scope=openid&redirect_uri=${FRONTEND_URL}/home`;
