import { useMutation, useQuery, useQueryClient } from "react-query";
import { useStore } from "../store/store";
import {
  ApiResponse,
  DefaultList,
  Item,
  List,
  ListItem,
} from "../types/api-response";
import { API_URL } from "../utils/contants";
import shallow from "zustand/shallow";
import { useEffect } from "react";
import { http } from "../utils/http";

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
    () => http.get("items"),
    {
      onSuccess: (data) => {
        setItems({ isLoading: false, data: data.data });
      },
    }
  );

  const { isLoading: listsLoading } = useQuery<ApiResponse<List[]>>(
    "lists.get",
    () => http.get("lists"),
    {
      onSuccess: (data) => {
        setLists({ isLoading: false, data: data.data });
      },
    }
  );

  const { data: defaultList, isLoading: defaultListLoading } = useQuery<
    ApiResponse<DefaultList>
  >("lists.default.get", () => http.get("lists/default"));

  useEffect(() => {
    if (defaultListLoading) {
      return;
    }

    if (defaultList?.data && lists.data) {
      const l = lists.data.find((x) => x.id === defaultList.data.listId);
      if (l) {
        setDefaultList({ isLoading: false, data: l });
      } else {
        setDefaultList({ isLoading: false, data: null });
      }
    } else {
      setDefaultList({ isLoading: false, data: null });
    }
  }, [defaultList, defaultListLoading, lists, setDefaultList]);

  return { isLoading: itemsLoading && listsLoading && defaultListLoading };
};
