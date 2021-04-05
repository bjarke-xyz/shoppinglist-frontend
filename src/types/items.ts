export interface Item {
  id: number;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AddItem {
  name: string;
}
