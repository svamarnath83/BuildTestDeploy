export interface LoginRequest {
  username: string;
  password: string;
  accountCode: string;
}

export interface UserInfo {
  Id?: number;
  Name: string;
  Email?: string;
  Image?: string | null;
}

export interface LoginResponse {
  user: UserInfo;
  longToken: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
  } | null;
}

