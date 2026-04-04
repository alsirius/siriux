export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
  iss?: string;
  aud?: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  success: boolean;
  user?: AuthenticatedUser;
  tokens?: AuthTokens;
  error?: string;
}

export interface DatabaseConfig {
  type: 'sqlite' | 'postgresql' | 'mysql';
  connection: string;
  options?: Record<string, any>;
}

export interface SiriuxConfig {
  jwtSecret: string;
  jwtRefreshSecret: string;
  database: DatabaseConfig;
  email?: {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
  };
  features?: {
    mfa?: boolean;
    sso?: boolean;
    rbac?: boolean;
    emailVerification?: boolean;
  };
}
