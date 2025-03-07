export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: Role;
  bio?: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  userRole: Role | null;
  token: string | null;
}