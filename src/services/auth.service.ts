/* eslint-disable no-console */
import axios from "axios";
import { IdentityUser, IToken, SSOError, Token } from "../types/SSO";
import { FRONTEND_URL, SSO_URL } from "../utils/constants";
import { ApiService } from "./api.service";

class AuthService extends ApiService {
  async loginViaCode(credentials: {
    code: string;
    path: string;
  }): Promise<[boolean, SSOError | null]> {
    if (
      !this.token ||
      (this.token.isAccessExpired() && this.token.isRefreshExpired())
    ) {
      try {
        await new Promise((r) => setTimeout(r, 1000));
        const params = new URLSearchParams();
        params.append("client_id", this.clientId);
        params.append("client_secret", this.clientSecret);
        params.append("grant_type", "authorization_code");
        params.append("code", credentials.code);
        params.append("redirect_uri", `${FRONTEND_URL}${credentials.path}`);
        const config = {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
        const resp = await axios.post<IToken>(
          `${SSO_URL}/auth/realms/shoppinglist/protocol/openid-connect/token`,
          params,
          config
        );
        if (resp.data.access_token) {
          this.token = new Token(resp.data);
        }
        // Account for clock skew when validating JWT on the backend
        await new Promise((r) => setTimeout(r, 1000));
        return [true, null];
      } catch (error) {
        this.logError("loginViaCode", error);
        return [false, error?.response?.data];
      }
    }
    return [true, null];
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<[boolean, SSOError | null]> {
    try {
      const params = new URLSearchParams();
      params.append("client_id", this.clientId);
      params.append("client_secret", this.clientSecret);
      params.append("grant_type", "password");
      params.append("scope", "openid");
      params.append("username", credentials.email);
      params.append("password", credentials.password);
      const config = {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
      const resp = await axios.post<IToken>(
        `${SSO_URL}/auth/realms/shoppinglist/protocol/openid-connect/token`,
        params,
        config
      );
      if (resp.data.access_token) {
        this.token = new Token(resp.data);
      }

      // Account for clock skew when validating JWT on the backend
      await new Promise((r) => setTimeout(r, 1000));
      return [true, null];
    } catch (error) {
      this.logError("login", error);
      return [false, error.response.data];
    }
  }

  async logout(): Promise<void> {
    this.token = null;
    window.location.href = `${SSO_URL}/auth/realms/shoppinglist/protocol/openid-connect/logout?redirect_uri=${encodeURI(
      `${FRONTEND_URL}/home`
    )}`;
    // try {
    //   if (!this.token) {
    //     return;
    //   }
    //   const params = new URLSearchParams();
    //   params.append("client_id", this.clientId);
    //   params.append("client_secret", this.clientSecret);
    //   params.append("refresh_token", this.token.refreshToken);

    //   const config = {
    //     headers: {
    //       ...this.authHeader,
    //       "Content-Type": "application/x-www-form-urlencoded",
    //     },
    //   };
    //   await axios.post<void>(
    //     `${SSO_URL}/auth/realms/shoppinglist/protocol/openid-connect/logout?redirect_uri=${encodeURI(
    //       `${FRONTEND_URL}/home`
    //     )}`,
    //     params,
    //     config
    //   );
    // } catch (err) {
    //   this.logError(err, "logout");
    // } finally {
    //   this.token = null;
    // }
  }

  async getUserInfo(): Promise<[IdentityUser | null, SSOError | null]> {
    try {
      await this.ensureFreshToken();
      const headers = this.authHeader;
      if (!headers) {
        return [
          null,
          { error: "invalid_token", error_description: "invalid_token" },
        ];
      }
      const resp = await axios.get<IdentityUser>(
        `${SSO_URL}/auth/realms/shoppinglist/protocol/openid-connect/userinfo`,
        { headers }
      );
      return [resp.data, null];
    } catch (error) {
      this.logError("getUserInfo", error);
      return [null, error.response?.data];
    }
  }
}

export default new AuthService();
