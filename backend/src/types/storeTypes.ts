export interface StoreCreateInput {
  name: string;
  email: string;
  address: string;
  ownerId: number;
}

export interface StoreUpdateInput {
  name?: string;
  email?: string;
  address?: string;
  ownerId?: number;
}

export interface StoreOutput {
  id: number;
  name: string;
  email: string;
  address: string;
  ownerId?: number;
  createdAt: Date;
  updatedAt: Date;
}
