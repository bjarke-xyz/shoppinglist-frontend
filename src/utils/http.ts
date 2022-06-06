import { API_URL } from "./contants";

export const setToken = (token: string) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");

export const getAuthHeaders = () => {
  return {
    Authorization: `Bearer ${getToken()}`,
  };
};

async function httpRequest(options: {
  resource: string;
  method: string;
  body?: unknown | undefined;
}): Promise<Response> {
  return await fetch(`${API_URL}/api/v1/${options.resource}`, {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(options.body),
  });
}

export const http = {
  get: async (resource: string) =>
    await (await httpRequest({ resource, method: "GET" })).json(),
  post: async (resource: string, body?: any) =>
    await httpRequest({ resource, method: "POST", body }),
  put: async (resource: string, body?: any) =>
    await httpRequest({ resource, method: "PUT", body }),
  delete: async (resource: string) =>
    await httpRequest({ resource, method: "DELETE" }),
};
