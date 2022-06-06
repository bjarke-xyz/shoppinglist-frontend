import { useKeycloak } from "@react-keycloak/web";
import { createContext, useContext, useEffect, useState } from "react";
import { Children } from "../types/children";
import { setToken } from "../utils/http";

export interface KeycloakUserInfo {
  sub: string;
  email_verified: string;
  preferred_username: string;
  email: string;
}

export interface UserDetails {
  userInfo: KeycloakUserInfo | null;
  logout: () => any;
}
const defaultUserDetails: UserDetails = {
  userInfo: null,
  logout: () => {},
};

export const userDetailsContext =
  createContext<UserDetails>(defaultUserDetails);

export const useUserDetails = () => {
  return useContext(userDetailsContext);
};

export const UserDetailsProvider: React.FC<Children> = (props) => {
  const { initialized, keycloak } = useKeycloak();
  const [userDetails, setUserDetails] =
    useState<UserDetails>(defaultUserDetails);
  useEffect(() => {
    async function fetchData() {
      if (initialized && keycloak.authenticated) {
        const userInfo = await keycloak.loadUserInfo();
        setUserDetails({ userInfo: userInfo as any, logout: keycloak.logout });
      }
    }
    fetchData();
  }, [keycloak, initialized]);

  useEffect(() => {
    if (initialized && keycloak?.token) {
      setToken(keycloak.token);
    }
    keycloak.onAuthRefreshSuccess = () => {
      if (keycloak?.token) {
        setToken(keycloak.token);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <userDetailsContext.Provider value={userDetails}>
      {props.children}
    </userDetailsContext.Provider>
  );
};
