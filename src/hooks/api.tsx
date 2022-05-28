import { useMutation, useQuery } from "react-query";
import { useStore } from "../store/store";
import { ApiResponse, DefaultList, Item, List } from "../types/api-response";
import { getAuthHeaders } from "../utils";
import { API_URL } from "../utils/contants";
import shallow from "zustand/shallow";
import { useEffect } from "react";

async function get(resource: string): Promise<any> {
  const resp = await fetch(`${API_URL}/api/v1/${resource}`, {
    headers: getAuthHeaders(),
  });
  return resp.json();
}

export async function post<T>(
  resource: string,
  body: any = null
): Promise<Response> {
  const resp = await fetch(`${API_URL}/api/v1/${resource}`, {
    method: "POST",
    headers: {
      "Content-Type": "application-json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });
  return resp;
}

export async function _delete(resource: string): Promise<Response> {
  const resp = await fetch(`${API_URL}/api/v1/${resource}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
  return resp;
}

export const useGetData = () => {
  const [setItems, setLists, lists, setDefaultList] = useStore(
    (state) => [
      state.setItems,
      state.setLists,
      state.lists,
      state.setDefaultList,
    ],
    shallow
  );
  const { isLoading: itemsLoading } = useQuery<ApiResponse<Item[]>>(
    "items.get",
    () => get("items"),
    {
      onSuccess: (data) => {
        setItems({ isLoading: false, data: data.data });
      },
    }
  );

  const { isLoading: listsLoading } = useQuery<ApiResponse<List[]>>(
    "lists.get",
    () => get("lists"),
    {
      onSuccess: (data) => {
        setLists({ isLoading: false, data: data.data });
      },
    }
  );

  const { data: defaultList, isLoading: defaultListLoading } = useQuery<
    ApiResponse<DefaultList>
  >("lists.default.get", () => get("lists/default"));

  useEffect(() => {
    if (defaultList && lists.data) {
      const l = lists.data.find((x) => x.id === defaultList.data.listId);
      if (l) {
        setDefaultList({ isLoading: false, data: l });
      }
    }
  }, [defaultList, lists, setDefaultList]);

  return { isLoading: itemsLoading && listsLoading && defaultListLoading };
};
