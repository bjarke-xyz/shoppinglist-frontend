/* eslint-disable no-console */
import { action, computed, createStore, thunk } from "easy-peasy";
import _ from "lodash";
import authService from "../services/auth.service";
import itemsService from "../services/items.service";
import listsService from "../services/lists.service";
import { ApiError } from "../types/API";
import { Item } from "../types/items";
import { SSOError } from "../types/SSO";
import { API_URL } from "../utils/constants";
import { StoreModel } from "./models";

export const store = createStore<StoreModel>({
  fetcher: thunk(async (actions, payload) => {
    const ssoError = await actions.auth.fetch();
    if (ssoError) {
      console.log({ ssoError });
      return [false, ssoError] as [boolean, SSOError];
    }

    const errors: (ApiError | null)[] = await Promise.all([
      actions.items.fetch(),
      actions.lists.fetch(),
    ]);

    if (errors.some((x) => x !== null)) {
      return [false, errors] as [boolean, (ApiError | null)[]];
    }
    return [true, null] as [boolean, null];
  }),
  core: {
    loaded: false,
    setLoaded: action((state, payload) => {
      state.loaded = payload;
    }),

    sse: null,
    sseConnect: action((state) => {
      if (state.sse == null || state.sse.readyState === EventSource.CLOSED) {
        const bearerTokenBase64 = btoa(authService.getAuthToken() ?? "");
        state.sse = new EventSource(
          `${API_URL}/api/v1/sse?Authorization=${bearerTokenBase64}`
        );
        state.sse.onmessage = (event) => {
          console.log(JSON.parse(event.data));
        };
        state.sse.onerror = (error) => {
          console.error(error);
        };
      }
    }),
  },
  auth: {
    user: null,
    setUser: action((state, payload) => {
      state.user = payload;
    }),
    login: thunk(async (actions, payload) => {
      const [, tokenErr] = await authService.login(payload);
      if (tokenErr) {
        return tokenErr;
      }
      await actions.fetch();
      return null;
    }),
    loginViaCode: thunk(async (actions, payload) => {
      const [, tokenErr] = await authService.loginViaCode(payload);
      if (tokenErr) {
        return tokenErr;
      }
      return null;
    }),
    logout: thunk(async (actions) => {
      actions.setUser(null);
      await authService.logout();
    }),
    fetch: thunk(async (actions) => {
      const [user, userErr] = await authService.getUserInfo();
      if (user) {
        actions.setUser(user);
        return null;
      }
      if (userErr) {
        actions.setUser(null);
        return userErr;
      }
      return null;
    }),
  },
  items: {
    items: [],
    set: action((state, payload) => {
      state.items = payload;
    }),
    append: action((state, payload) => {
      state.items.push(payload);
    }),
    removeById: action((state, payload) => {
      const index = state.items.findIndex((x) => x.id === payload);
      if (index !== -1) {
        state.items.splice(index, 1);
      }
    }),
    fetch: thunk(async (actions) => {
      const [items, error] = await itemsService.getItems();
      if (error) {
        return error;
      }
      if (items) {
        actions.set(items);
      }
      return null;
    }),
    addItem: thunk(async (actions, payload) => {
      const [item, error] = await itemsService.addItem(payload);
      if (error) {
        return [null, error] as [null, ApiError];
      }
      if (item) {
        actions.append(item);
      }
      return [item, null] as [Item, null];
    }),
    removeItem: thunk(async (actions, payload) => {
      const error = await itemsService.deleteItem(payload.id);
      if (error) {
        return error;
      }
      actions.removeById(payload.id);
      return null;
    }),
  },
  lists: {
    lists: [],
    defaultListStore: null,
    defaultList: computed((state) => {
      const defaultList = state.lists.find(
        (x) => x.id === state.defaultListStore?.listId
      );
      return defaultList || null;
    }),
    setAll: action((state, payload) => {
      state.lists = payload;
    }),
    set: action((state, payload) => {
      const index = state.lists.findIndex((x) => x.id === payload.id);
      if (index !== -1) {
        state.lists[index] = payload;
      } else {
        state.lists.push(payload);
      }
    }),
    setItem: action((state, payload) => {
      const listIndex = state.lists.findIndex((x) => x.id === payload.list.id);
      if (listIndex !== -1) {
        const list = state.lists[listIndex];
        const itemIndex = list.items.findIndex(
          (x) => x.id === payload.listItem.id
        );
        if (itemIndex !== -1) {
          list.items[itemIndex] = payload.listItem;
        }
      }
    }),
    removeItem: action((state, payload) => {
      const listIndex = state.lists.findIndex((x) => x.id === payload.list.id);
      if (listIndex !== -1) {
        const list = state.lists[listIndex];
        const itemIndex = list.items.findIndex(
          (x) => x.id === payload.listItem.id
        );
        if (itemIndex !== -1) {
          list.items.splice(itemIndex, 1);
        }
      }
    }),
    setDefaultList: action((state, payload) => {
      state.defaultListStore = payload;
    }),
    append: action((state, payload) => {
      state.lists.push(payload);
    }),
    removeById: action((state, payload) => {
      const index = state.lists.findIndex((x) => x.id === payload);
      if (index !== -1) {
        state.lists.splice(index, 1);
      }
    }),
    fetch: thunk(async (actions) => {
      const [lists, error] = await listsService.getLists();
      if (error) {
        return error;
      }
      if (lists) {
        actions.setAll(lists);
      }
      const [
        defaultList,
        defaultListError,
      ] = await listsService.getDefaultList();
      if (defaultListError) {
        return defaultListError;
      }
      if (defaultList) {
        actions.setDefaultList(defaultList);
      }
      return null;
    }),
    addList: thunk(async (actions, payload) => {
      const [list, error] = await listsService.addList(payload);
      if (error) {
        return error;
      }
      if (list) {
        actions.append(list);
      }
      return null;
    }),
    updateList: thunk(async (actions, payload) => {
      const [list, error] = await listsService.updateList(payload);
      if (error) {
        return error;
      }
      if (list) {
        actions.set(list);
      }
      return null;
    }),
    updateDefaultList: thunk(async (actions, payload) => {
      const [defaultList, error] = await listsService.setDefaultList(payload);
      if (error) {
        return error;
      }
      if (defaultList) {
        actions.setDefaultList(defaultList);
      }
      return null;
    }),
    removeList: thunk(async (actions, payload) => {
      const error = await listsService.deleteList(payload.id);
      if (error) {
        return error;
      }
      actions.removeById(payload.id);
      return null;
    }),

    addToList: thunk(async (actions, payload) => {
      const [listItem, error] = await listsService.addToList({
        listId: payload.list.id,
        itemId: payload.item.id,
      });
      if (error) {
        return error;
      }

      if (listItem) {
        listItem.item = payload.item;
        const clonedList = _.cloneDeep(payload.list);
        if (_.isNil(clonedList.items)) {
          clonedList.items = [];
        }
        clonedList.items.push(listItem);
        actions.set(clonedList);
      }
      return null;
    }),

    removeFromList: thunk(async (actions, payload) => {
      if (!payload.listItem.crossed) {
        const listItemClone = _.cloneDeep(payload.listItem);
        listItemClone.crossed = true;
        const [updatedListItem, error] = await listsService.updateListItem(
          listItemClone
        );
        if (error) {
          return error;
        }

        if (updatedListItem) {
          actions.setItem({ list: payload.list, listItem: updatedListItem });
        }
      } else {
        const error = await listsService.removeFromList({
          listId: payload.list.id,
          listItemId: payload.listItem.id,
        });
        if (error) {
          return error;
        }
        actions.removeItem({ list: payload.list, listItem: payload.listItem });
      }
      return null;
    }),
  },
});
