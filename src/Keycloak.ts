import Keycloak, { KeycloakInitOptions } from "keycloak-js";
import { SSO_URL } from "./utils/constants";

const keycloak = Keycloak({
  url: `${SSO_URL}/auth`,
  realm: "shoppinglist",
  clientId: "App",
});

export const initOptions: KeycloakInitOptions = {
  onLoad: "check-sso",
  silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
  checkLoginIframe: false,
};

export default keycloak;
