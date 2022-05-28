export interface ApiResponse<T> {
  data: T;
}

export interface Item {
  id: string;
  createdAt: string;
  name: string;
  ownerId: string;
  updatedAt: string;
}

export interface ListItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  crossed: boolean;
  item: Item;
  itemId: string;
  listId: string;
}

export interface List {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  ownerId: string;
  items: ListItem[];
}

export interface DefaultList {
  id: string;
  createdAt: string;
  updatedAt: string;
  listId: string;
  userId: string;
}
