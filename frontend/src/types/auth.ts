import type { User } from './models';

// =====================================================
// Authentication Types
// =====================================================

// JWT Token Response
export interface AuthTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Login Response
export interface LoginResponse {
  user: User;
  token: AuthTokenResponse;
}

// Register Response
export interface RegisterResponse {
  user: User;
  token: AuthTokenResponse;
}

// Auth State
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

