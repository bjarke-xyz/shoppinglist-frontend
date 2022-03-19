import axios from "axios";
import keycloak from "../Keycloak";
import { ApiError, ApiResponse } from "../types/API";
import { IdentityUser, SSOError } from "../types/SSO";
import { API_URL } from "../utils/constants";
import { ApiService, isApiError, isSsoError } from "./api.service";

class AuthService extends ApiService {
  public getAuthToken() {
    return this.authHeader?.Authorization;
  }

  public async getSseTicket(): Promise<[string | null, ApiError | null]> {
    try {
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

  async getUserInfo(): Promise<[IdentityUser | null, SSOError | null]> {
    try {
      const headers = this.authHeader;
      if (!headers) {
        return [
          null,
          { error: "invalid_token", error_description: "invalid_token" },
        ];
      }
      await keycloak.loadUserInfo();
      const user: IdentityUser = {
        ...(keycloak.userInfo as any),
      };
      return [user, null];
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
