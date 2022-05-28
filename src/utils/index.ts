export const isServer = () => typeof window === "undefined";

export const setToken = (token: string) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");

export const getAuthHeaders = () => {
  return {
    Authorization: `Bearer ${getToken()}`,
  };
};
