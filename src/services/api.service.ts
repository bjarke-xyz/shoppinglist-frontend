import axios from "axios";
import { ApiError } from "../types/API";
import { IToken, SSOError, Token } from "../types/SSO";
import { SSO_URL } from "../utils/constants";

export function isApiError(
  err: unknown
): err is { response: { data: ApiError } } {
  return !!((err as any)?.response?.data as ApiError)?.error;
}

export function isSsoError(
  err: unknown
): err is { response: { data: SSOError } } {
  return !!((err as any)?.response?.data as SSOError)?.error_description;
}

export class ApiService {
  protected readonly clientId = "App";

  protected readonly clientSecret = "6b778996-5fe9-44e7-b03c-23ead8abfb31";

  protected set token(token: Token | null) {
    if (!token) {
      localStorage.removeItem("token");
    } else {
      localStorage.setItem("token", JSON.stringify(token));
    }
  }

  protected get token(): Token | null {
    const tokenJson = localStorage.getItem("token");
    if (!tokenJson) {
      return null;
    }
    const tokenParsed: Token = JSON.parse(tokenJson);
    const token = new Token(tokenParsed);
    return token;
  }

  protected get authHeader(): { Authorization: string } | null {
    if (!this.token || !this.token.accessToken) {
      return null;
    }

    return { Authorization: `Bearer ${this.token.accessToken}` };
  }

  protected logError(err: any, source: string): void {
    // eslint-disable-next-line no-console
    console.log({ source, err, data: err?.response?.data });
  }

  /**
   *
   * @returns if false, use should be redirected to login page
   */
  protected async ensureFreshToken(): Promise<boolean> {
    try {
      if (!this.token) {
        return false;
      }

      if (this.token.isRefreshExpired()) {
        return false;
      }

      if (this.token.isAccessExpired()) {
        const params = new URLSearchParams();
        params.append("client_id", this.clientId);
        params.append("client_secret", this.clientSecret);
        params.append("grant_type", "refresh_token");
        params.append("refresh_token", this.token.refreshToken);
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
        return true;
      }
      return true;
    } catch (err) {
      this.logError(err, "ensureFreshToken");
      if (isSsoError(err))
        if (err?.response?.data?.error_description === "Token is not active") {
          // Redirect to login page
        }
      return false;
    }
  }
}
