import toast from "react-hot-toast";
import create from "zustand";
import { devtools } from "zustand/middleware";
import { post, _delete } from "../hooks/api";
import { ApiResponse, Item, List, ListItem } from "../types/api-response";

interface LoadingData<T> {
  isLoading: boolean;
  data: T;
}

interface Store {
  items: LoadingData<Item[]>;
  setItems: (items: LoadingData<Item[]>) => any;

  lists: LoadingData<List[]>;
  setLists: (items: LoadingData<List[]>) => any;

  defaultList: LoadingData<List | null>;
  setDefaultList: (defaultList: LoadingData<List>) => any;
  updateListItem: (
    action: UpdateListItemAction,
    listItem: ListItem
  ) => Promise<any>;

  addItemToList: (itemName: string) => Promise<any>;
}

type UpdateListItemAction = "cross" | "uncross" | "delete";

export const useStore = create<Store>()(
  devtools((set, get) => ({
    items: { isLoading: true, data: [] },
    setItems: (input) => set({ items: input }),

    lists: { isLoading: true, data: [] },
    setLists: (input) => set({ lists: input }),

    defaultList: { isLoading: true, data: null },
    setDefaultList: (input) => set({ defaultList: input }),

    addItemToList: async (itemName: string) => {
      const defaultList = get().defaultList?.data;
      if (!defaultList) {
        return;
      }
      const item = get().items?.data?.find(
        (x) => x.name.toLowerCase() === itemName.toLowerCase()
      );
      if (!item) {
        // TODO: create item if not found
        return;
      }
      const resp = await post(`lists/${defaultList.id}/items/${item.id}`);
      if (resp.ok) {
        const addedItem = (await resp.json()) as ApiResponse<ListItem>;
        if (addedItem?.data) {
          defaultList.items.push(addedItem.data);
          set({ defaultList: { isLoading: false, data: defaultList } });
        }
      }
    },

    updateListItem: async (
      action: UpdateListItemAction,
      listItem: ListItem
    ) => {
      switch (action) {
        case "delete": {
          const resp = await _delete(
            `lists/${listItem.listId}/items/${listItem.id}`
          );
          console.log(resp);
          if (resp.ok) {
            const defaultList = get().defaultList;
            if (defaultList.data) {
              defaultList.data.items = defaultList.data.items.filter(
                (x) => x.id !== listItem.id
              );
              set({
                defaultList: {
                  data: defaultList.data,
                  isLoading: defaultList.isLoading,
                },
              });
            }
          }
        }
      }
    },
  }))
);
