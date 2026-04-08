// Core type definitions following @siriux/core patterns

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  company?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: string;
  company?: string;
  avatar?: string;
  bio?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  marketing: boolean;
  security: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface DataItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  metadata: Record<string, any>;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDataItemRequest {
  title: string;
  description: string;
  category: string;
  tags?: string[];
  metadata?: Record<string, any>;
}

export interface UpdateDataItemRequest extends Partial<CreateDataItemRequest> {
  id: string;
}

export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: string;
  iat: number; // issued at
  exp: number; // expiration
  type: 'access' | 'refresh';
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface AuthMiddlewareOptions {
  secret: string;
  algorithms?: string[];
  expiresIn?: string;
  issuer?: string;
  audience?: string;
}

export interface DatabaseConfig {
  type: 'sqlite' | 'postgresql' | 'mysql';
  url?: string;
  filename?: string; // for SQLite
  host?: string;
  port?: number;
  database?: string;
  username?: string;
  password?: string;
  ssl?: boolean;
}

export interface ServerConfig {
  port: number;
  nodeEnv: 'development' | 'production' | 'test';
  database: DatabaseConfig;
  jwt: {
    secret: string;
    expiresIn: string;
    refreshExpiresIn: string;
  };
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  logging: {
    level: 'error' | 'warn' | 'info' | 'debug';
    format: 'json' | 'simple';
  };
}

export interface ServiceResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    statusCode: number;
  };
}
