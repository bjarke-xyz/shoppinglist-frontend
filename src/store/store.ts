/* eslint-disable no-console */
import dayjs from "dayjs";
import { action, computed, createStore, thunk } from "easy-peasy";
import _ from "lodash";
import authService from "../services/auth.service";
import itemsService from "../services/items.service";
import listsService from "../services/lists.service";
import { StoreModel } from "./models";

export const store = createStore<StoreModel>({
  fetcher: thunk(async (actions, payload) => {
    const ssoError = await actions.auth.fetch();
    if (ssoError) {
      console.log({ ssoError });
      return false;
    }

    const errors = await Promise.all([
      actions.items.fetch(),
      actions.lists.fetch(),
    ]);

    if (errors.some((x) => x !== null)) {
      console.log({ errors });
      return false;
    }
    return true;
  }),
  core: {
    loaded: false,
    setLoaded: action((state, payload) => {
      state.loaded = payload;
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
        return error;
      }
      if (item) {
        actions.append(item);
      }
      return null;
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
    defaultList: computed((state) => {
      const defaultList = state.lists.find((x) => x.default);
      return defaultList || null;
    }),
    setAll: action((state, payload) => {
      state.lists = payload;
    }),
    set: action((state, payload) => {
      const index = state.lists.findIndex((x) => x.id === payload.id);
      if (payload.default) {
        state.lists.forEach((list) => {
          list.default = false;
        });
      }
      if (index !== -1) {
        state.lists[index] = payload;
      } else {
        state.lists.push(payload);
      }
    }),
    append: action((state, payload) => {
      if (payload.default) {
        state.lists.forEach((list) => {
          list.default = false;
        });
      }
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
        clonedList.items.push(listItem);
        actions.set(clonedList);
      }
      return null;
    }),

    removeFromList: thunk(async (actions, payload) => {
      const error = await listsService.removeFromList({
        listId: payload.list.id,
        listItemId: payload.listItem.id,
      });
      if (error) {
        return error;
      }

      const clonedList = _.cloneDeep(payload.list);
      const itemIndex = clonedList.items.findIndex(
        (x) => x.id === payload.listItem.id
      );
      if (itemIndex !== -1) {
        clonedList.items.splice(itemIndex, 1);
      }
      actions.set(clonedList);

      return null;
    }),
  },
});
