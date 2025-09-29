export interface SignupInput {
  name: string;
  email: string;
  password: string;
  address: string;
  role?: "ADMIN" | "USER" | "STORE_OWNER";
}

export interface JwtPayload {
  id: number;
  role: "ADMIN" | "USER" | "STORE_OWNER";
  iat?: number;
  exp?: number;
}
