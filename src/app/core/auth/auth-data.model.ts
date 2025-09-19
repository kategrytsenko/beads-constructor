export interface AuthData {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
}
