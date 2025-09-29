export interface UserUpdateInput {
  name?: string;
  email?: string;
  password?: string;
  address?: string;
  role?: "ADMIN" | "USER" | "STORE_OWNER";
}
