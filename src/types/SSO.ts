import dayjs, { Dayjs } from "dayjs";

/* eslint-disable camelcase */
export interface IToken {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  "not-before-policy": number;
}
function isIToken(token: IToken | Token): token is IToken {
  if ((token as IToken).access_token) {
    return true;
  }
  return false;
}
export class Token {
  public accessToken: string;

  public accessExpiresAt: Dayjs;

  public refreshToken: string;

  public refreshExpiresAt: Dayjs;

  public notBeforePolicy: Dayjs;

  constructor(token: IToken | Token) {
    if (isIToken(token)) {
      this.accessToken = token.access_token;
      this.accessExpiresAt = dayjs().add(token.expires_in, "seconds");

      this.refreshToken = token.refresh_token;
      this.refreshExpiresAt = dayjs().add(token.refresh_expires_in, "seconds");

      this.notBeforePolicy = dayjs.unix(token["not-before-policy"]);
    } else {
      this.accessToken = token.accessToken;
      this.accessExpiresAt = dayjs(token.accessExpiresAt);

      this.refreshToken = token.refreshToken;
      this.refreshExpiresAt = dayjs(token.refreshExpiresAt);

      this.notBeforePolicy = dayjs(token.notBeforePolicy);
    }
  }

  public isAccessExpired(): boolean {
    const now = dayjs();
    return now.isAfter(this.accessExpiresAt);
  }

  public isRefreshExpired(): boolean {
    return dayjs().isAfter(this.refreshExpiresAt);
  }
}
export interface SSOError {
  error: string;
  error_description: string;
}
export interface IdentityUser {
  sub: string;
  email_verified: boolean;
  preferred_username: string;
  name: string;
  given_name: string;
  family_name: string;
  email: string;
}
