import axios from "axios";
import { basename } from "path";
import { ApiError, ApiResponse } from "../types/API";
import { IdentityUser, IToken, SSOError, Token } from "../types/SSO";
import { API_URL, FRONTEND_URL, SSO_URL } from "../utils/constants";
import { ApiService, isApiError, isSsoError } from "./api.service";

class AuthService extends ApiService {
  public getAuthToken() {
    return this.authHeader?.Authorization;
  }

  public async getSseTicket(): Promise<[string | null, ApiError | null]> {
    try {
      await this.ensureFreshToken();
      const headers = this.authHeader;
      const resp = await axios.post<ApiResponse<string>>(
        `${API_URL}/api/v1/sse/ticket/`,
        null,
        { headers }
      );
      return [resp.data.data, null];
    } catch (err) {
      if (isApiError(err)) {
        return [null, err?.response?.data];
      }
      return [null, null];
    }
  }

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
        this.logError(error, "loginViaCode");
        if (isSsoError(error)) {
          return [false, error.response?.data];
        }
        return [false, null];
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
      this.logError(error, "login");
      if (isSsoError(error)) {
        return [false, error.response?.data];
      }
      return [false, null];
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
      this.logError(error, "getUserInfo");
      if (isSsoError(error)) {
        return [null, error.response?.data];
      }
      return [null, null];
    }
  }
}

export default new AuthService();
