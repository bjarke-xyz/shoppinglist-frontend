import keycloak from "../Keycloak";
import { ApiError } from "../types/API";
import { SSOError } from "../types/SSO";

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

  protected get authHeader(): { Authorization: string } | null {
    const { token } = keycloak;

    return { Authorization: `Bearer ${token}` };
  }

  protected logError(err: any, source: string): void {
    // eslint-disable-next-line no-console
    console.log({ source, err, data: err?.response?.data });
  }
}
