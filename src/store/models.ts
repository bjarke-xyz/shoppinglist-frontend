import { Action, Computed, Thunk } from "easy-peasy";
import { ApiError } from "../types/API";
import { AddItem, Item } from "../types/items";
import {
  AddList,
  DefaultList,
  List,
  ListItem,
  UpdateList,
} from "../types/lists";
import { IdentityUser, SSOError } from "../types/SSO";

type SseEventHandler = (eventData: any) => void;
type SseEvent =
  | "LIST_UPDATED"
  | "LIST_ITEMS_ADDED"
  | "LIST_ITEMS_UPDATED"
  | "LIST_ITEMS_REMOVED";

interface CoreStore {
  loaded: boolean;
  setLoaded: Action<CoreStore, boolean>;

  sse: EventSource | null;
  sseEventHandlers: Record<SseEvent, SseEventHandler[]>;
  addSseEventHandler: Action<
    CoreStore,
    { event: SseEvent; handler: SseEventHandler }
  >;
  removeSseEventHandler: Action<
    CoreStore,
    { event: SseEvent; handler: SseEventHandler }
  >;
  sseIsConnecting: boolean;
  setSseIsConnecting: Action<CoreStore, boolean>;
  sseConnect: Thunk<CoreStore, undefined, any, {}, Promise<void>>;
}

interface AuthStore {
  user: IdentityUser | null;
  setUser: Action<AuthStore, IdentityUser | null>;
  fetch: Thunk<AuthStore, undefined, any, {}, Promise<SSOError | null>>;
}

interface ItemsStore {
  items: Item[];

  set: Action<ItemsStore, Item[]>;
  append: Action<ItemsStore, Item>;
  removeById: Action<ItemsStore, string>;

  fetch: Thunk<ItemsStore, undefined, any, {}, Promise<ApiError | null>>;
  addItem: Thunk<
    ItemsStore,
    AddItem,
    any,
    {},
    Promise<[Item | null, ApiError | null]>
  >;
  removeItem: Thunk<ItemsStore, Item, any, {}, Promise<ApiError | null>>;
}

interface ListsStore {
  lists: List[];
  defaultListStore: DefaultList | null;
  defaultList: Computed<ListsStore, List | null>;
  defaultListFetched: boolean;

  setAll: Action<ListsStore, List[]>;
  set: Action<ListsStore, List>;
  setItem: Action<ListsStore, { list: List; listItem: ListItem }>;
  removeItem: Action<ListsStore, { list: List; listItem: ListItem }>;
  setDefaultList: Action<ListsStore, DefaultList>;
  append: Action<ListsStore, List>;
  removeById: Action<ListsStore, string>;
  setDefaultListFetched: Action<ListsStore, boolean>;

  fetch: Thunk<ListsStore, undefined, any, {}, Promise<ApiError | null>>;
  addList: Thunk<ListsStore, AddList, any, {}, Promise<ApiError | null>>;
  updateList: Thunk<ListsStore, UpdateList, any, {}, Promise<ApiError | null>>;
  updateDefaultList: Thunk<ListsStore, List, any, {}, Promise<ApiError | null>>;
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
  fetcher: Thunk<
    StoreModel,
    undefined,
    any,
    {},
    Promise<[boolean, (ApiError | null)[] | (SSOError | null) | null]>
  >;
  core: CoreStore;
  auth: AuthStore;
  items: ItemsStore;
  lists: ListsStore;
}
