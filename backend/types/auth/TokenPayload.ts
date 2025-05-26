export interface TokenPayload {
  uid: string;
  email: string;
  roles: Role[];
}

export type Role = "admin" | "producer" | "client";
