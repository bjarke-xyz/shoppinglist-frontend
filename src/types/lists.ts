import { Item } from "./items";

export interface List {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  items: ListItem[];
}

export interface ListItem {
  id: string;
  listId: string;
  itemId: string;
  item: Item;
  createdAt?: string;

  // Frontend properties
  crossed: boolean;
}

export interface UpdatelistItem {
  id: string;
  listId: string;
  crossed: boolean;
}

export interface AddList {
  name: string;
}

export interface UpdateList {
  id: string;
  name: string;
  items: ListItem[];
}

export interface DefaultList {
  id: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  listId: string;
}
