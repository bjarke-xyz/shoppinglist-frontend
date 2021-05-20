import { Item } from "./items";

export interface List {
  id: string;
  name: string;
  isDefault: boolean;
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
  isDefault: boolean;
  items: ListItem[];
}
