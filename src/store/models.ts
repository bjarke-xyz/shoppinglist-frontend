import { Action, Computed, Thunk } from "easy-peasy";
import { ApiError } from "../types/API";
import { AddItem, Item } from "../types/items";
import { AddList, List, ListItem, UpdateList } from "../types/lists";
import { IdentityUser, SSOError } from "../types/SSO";

interface CoreStore {
  loaded: boolean;
  setLoaded: Action<CoreStore, boolean>;
}

interface AuthStore {
  user: IdentityUser | null;
  setUser: Action<AuthStore, IdentityUser | null>;
  login: Thunk<
    AuthStore,
    { email: string; password: string },
    any,
    {},
    Promise<SSOError | null>
  >;
  loginViaCode: Thunk<
    AuthStore,
    { code: string; path: string },
    any,
    {},
    Promise<SSOError | null>
  >;
  logout: Thunk<AuthStore>;
  fetch: Thunk<AuthStore, undefined, any, {}, Promise<SSOError | null>>;
}

interface ItemsStore {
  items: Item[];

  set: Action<ItemsStore, Item[]>;
  append: Action<ItemsStore, Item>;
  removeById: Action<ItemsStore, number>;

  fetch: Thunk<ItemsStore, undefined, any, {}, Promise<ApiError | null>>;
  addItem: Thunk<ItemsStore, AddItem, any, {}, Promise<ApiError | null>>;
  removeItem: Thunk<ItemsStore, Item, any, {}, Promise<ApiError | null>>;
}

interface ListsStore {
  lists: List[];
  defaultList: Computed<ListsStore, List | null>;

  setAll: Action<ListsStore, List[]>;
  set: Action<ListsStore, List>;
  append: Action<ListsStore, List>;
  removeById: Action<ListsStore, number>;

  fetch: Thunk<ListsStore, undefined, any, {}, Promise<ApiError | null>>;
  addList: Thunk<ListsStore, AddList, any, {}, Promise<ApiError | null>>;
  updateList: Thunk<ListsStore, UpdateList, any, {}, Promise<ApiError | null>>;
  removeList: Thunk<ListsStore, List, any, {}, Promise<ApiError | null>>;

  addToList: Thunk<
    ListsStore,
    { list: List; item: Item },
    any,
    {},
    Promise<ApiError | null>
  >;
  removeFromList: Thunk<
    ListsStore,
    { list: List; listItem: ListItem },
    any,
    {},
    Promise<ApiError | null>
  >;
}

export interface StoreModel {
  fetcher: Thunk<StoreModel, undefined, any, {}, Promise<boolean>>;
  core: CoreStore;
  auth: AuthStore;
  items: ItemsStore;
  lists: ListsStore;
}
