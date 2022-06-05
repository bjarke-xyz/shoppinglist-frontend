import create from "zustand";
import { devtools } from "zustand/middleware";
import { ApiResponse, Item, List, ListItem } from "../types/api-response";
import { http } from "../utils/http";

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
  setDefaultList: (defaultList: LoadingData<List | null>) => any;
  // updateListItem: (
  //   action: UpdateListItemAction,
  //   listItem: ListItem
  // ) => Promise<any>;

  // addItemToList: (itemName: string) => Promise<any>;
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

    // addItemToList: async (itemName: string) => {
    //   const defaultList = get().defaultList?.data;
    //   if (!defaultList) {
    //     return;
    //   }
    //   const item = get().items?.data?.find(
    //     (x) => x.name.toLowerCase() === itemName.toLowerCase()
    //   );
    //   if (!item) {
    //     // TODO: create item if not found
    //     return;
    //   }
    //   const resp = await http.post(`lists/${defaultList.id}/items/${item.id}`);
    //   if (resp.ok) {
    //     const addedItem = (await resp.json()) as ApiResponse<ListItem>;
    //     if (addedItem?.data) {
    //       defaultList.items.push(addedItem.data);
    //       set({ defaultList: { isLoading: false, data: defaultList } });
    //     }
    //   }
    // },

    // updateListItem: async (
    //   action: UpdateListItemAction,
    //   listItem: ListItem
    // ) => {
    //   switch (action) {
    //     case "cross":
    //     case "uncross":
    //       {
    //         const resp = await put(
    //           `lists/${listItem.listId}/items/${listItem.id}`,
    //           {
    //             crossed: action == "cross",
    //           }
    //         );
    //         if (!resp.ok) {
    //           console.log(resp);
    //           toast.error("Something went wrong");
    //           return;
    //         }
    //         const defaultList = get().defaultList;
    //         if (defaultList.data) {
    //           const responseObj: ApiResponse<ListItem> = await resp.json();
    //           const index = defaultList.data.items.findIndex(
    //             (x) => x.id == listItem.id
    //           );
    //           if (index !== -1 && responseObj.data) {
    //             defaultList.data.items[index] = responseObj.data;
    //             set({
    //               defaultList: {
    //                 data: defaultList.data,
    //                 isLoading: defaultList.isLoading,
    //               },
    //             });
    //           }
    //         }
    //       }
    //       break;
    //     case "delete":
    //       {
    //         const resp = await _delete(
    //           `lists/${listItem.listId}/items/${listItem.id}`
    //         );
    //         if (!resp.ok) {
    //           console.log(resp);
    //           toast.error("Something went wrong");
    //           return;
    //         }
    //         const defaultList = get().defaultList;
    //         if (defaultList.data) {
    //           defaultList.data.items = defaultList.data.items.filter(
    //             (x) => x.id !== listItem.id
    //           );
    //           set({
    //             defaultList: {
    //               data: defaultList.data,
    //               isLoading: defaultList.isLoading,
    //             },
    //           });
    //         }
    //       }
    //       break;
    //   }
    // },
  }))
);
