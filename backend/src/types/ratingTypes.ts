export interface RatingCreateInput {
  storeId: number;
  value: number; // 1-5
}

export interface RatingUpdateInput {
  value: number; // 1-5
}

export interface RatingOutput {
  id: number;
  value: number;
  userId: number;
  storeId: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    name: string;
    email: string;
  };
}
