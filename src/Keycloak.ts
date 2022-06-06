import Keycloak, { KeycloakInitOptions } from "keycloak-js";
import { SSO_URL } from "./utils/contants";

export function getKeycloak(): {
  authClient: any;
  initOptions: KeycloakInitOptions;
} {
  const authClient = Keycloak({
    url: `${SSO_URL}/auth`,
    realm: "shoppinglist",
    clientId: "App",
  });
  const initOptions: KeycloakInitOptions = {
    onLoad: "login-required",
    enableLogging: true,
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    checkLoginIframe: false,
  };
  return { authClient, initOptions };
}
