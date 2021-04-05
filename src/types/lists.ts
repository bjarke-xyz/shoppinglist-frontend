import { Item } from "./items";

export interface List {
  id: number;
  name: string;
  default: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  items: ListItem[];
}

export interface ListItem {
  id: number;
  listId: number;
  itemId: number;
  item: Item;
  createdAt?: string;
}

export interface AddList {
  name: string;
}

export interface UpdateList {
  id: number;
  name: string;
  default: boolean;
  items: ListItem[];
}
