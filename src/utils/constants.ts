export const SSO_URL = "https://keycloak.bjarke.xyz";
export const API_URL = "http://localhost:5000";
export const FRONTEND_URL = "http://localhost:3000";

export const LOGIN_URL = `${SSO_URL}/auth/realms/shoppinglist/protocol/openid-connect/auth?response_type=code&client_id=App&scope=openid&redirect_uri=${FRONTEND_URL}/home`;
