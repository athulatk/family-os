export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}