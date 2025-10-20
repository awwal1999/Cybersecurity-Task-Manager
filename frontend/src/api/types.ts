import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import type {
  TaskActivity,
  TaskListResponse,
  TaskResponse,
  UserResponse,
  LoginResponse,
  RegisterResponse,
  AuthTokenResponse,
  CreateTaskFormData,
  UpdateTaskFormData,
  LoginFormData,
  RegisterFormData,
  TaskFilters,
  ApiError,
} from '../types';

// =====================================================
// API Client Configuration
// =====================================================

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers?: Record<string, string>;
}

// =====================================================
// API Request/Response Types
// =====================================================

// Generic API Response
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

// API Error Response
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

// =====================================================
// Authentication API Types
// =====================================================

// Login Request
export interface LoginRequest {
  email: string;
  password: string;
}

// Register Request
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Token Refresh Request
export interface TokenRefreshRequest {
  refresh_token: string;
}

// =====================================================
// Task API Types
// =====================================================

// Create Task Request
export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: 'open' | 'closed';
  due_date?: string;
}

// Update Task Request
export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: 'open' | 'closed';
  due_date?: string;
}

// Task List Query Parameters
export interface TaskListQuery {
  status?: 'open' | 'closed';
  due_date?: 'today' | 'this_week' | 'overdue';
  search?: string;
  page?: number;
  per_page?: number;
}

// =====================================================
// API Client Interface
// =====================================================

export interface ApiClient {
  // Authentication methods
  login(data: LoginFormData): Promise<LoginResponse>;
  register(data: RegisterFormData): Promise<RegisterResponse>;
  logout(): Promise<void>;
  refreshToken(): Promise<AuthTokenResponse>;
  getCurrentUser(): Promise<UserResponse>;

  // Task methods
  getTasks(filters?: TaskFilters): Promise<TaskListResponse>;
  getTask(id: number): Promise<TaskResponse>;
  createTask(data: CreateTaskFormData): Promise<TaskResponse>;
  updateTask(id: number, data: UpdateTaskFormData): Promise<TaskResponse>;
  deleteTask(id: number): Promise<void>;
  markTaskComplete(id: number): Promise<TaskResponse>;
  reopenTask(id: number): Promise<TaskResponse>;

  // Task Activity methods
  getTaskActivities(taskId: number): Promise<TaskActivity[]>;
}

// =====================================================
// HTTP Method Types
// =====================================================

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestConfig extends AxiosRequestConfig {
  method: HttpMethod;
  url: string;
  data?: unknown;
  params?: Record<string, unknown>;
}

// =====================================================
// Interceptor Types
// =====================================================

export interface RequestInterceptor {
  onFulfilled?: (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig>;
  onRejected?: (error: unknown) => unknown;
}

export interface ResponseInterceptor {
  onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>;
  onRejected?: (error: unknown) => unknown;
}

// =====================================================
// Error Handling Types
// =====================================================

export interface ApiErrorHandler {
  handle(error: ApiError): void;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiErrorDetails {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
  validation_errors?: ValidationError[];
}

// =====================================================
// Loading and State Types
// =====================================================

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface ApiState<T = unknown> extends LoadingState {
  data: T | null;
  lastUpdated: number | null;
}

// =====================================================
// Cache Types
// =====================================================

export interface CacheConfig {
  ttl: number; // Time to live in milliseconds
  maxSize: number; // Maximum number of items to cache
}

export interface CacheItem<T = unknown> {
  data: T;
  timestamp: number;
  ttl: number;
}

export interface ApiCache {
  get<T>(key: string): T | null;
  set<T>(key: string, data: T, ttl?: number): void;
  delete(key: string): void;
  clear(): void;
  has(key: string): boolean;
}

// =====================================================
// Retry and Timeout Types
// =====================================================

export interface RetryConfig {
  retries: number;
  retryDelay: number;
  retryCondition?: (error: unknown) => boolean;
}

export interface TimeoutConfig {
  request: number;
  response: number;
}

// =====================================================
// Request/Response Transformers
// =====================================================

export interface RequestTransformer {
  transform(data: unknown, headers?: Record<string, string>): unknown;
}

export interface ResponseTransformer {
  transform(data: unknown): unknown;
}

// =====================================================
// API Client Factory Types
// =====================================================

export interface ApiClientFactory {
  createClient(config: ApiConfig): ApiClient;
}

export interface ApiClientBuilder {
  setBaseURL(url: string): ApiClientBuilder;
  setTimeout(timeout: number): ApiClientBuilder;
  setHeaders(headers: Record<string, string>): ApiClientBuilder;
  addRequestInterceptor(interceptor: RequestInterceptor): ApiClientBuilder;
  addResponseInterceptor(interceptor: ResponseInterceptor): ApiClientBuilder;
  setRetryConfig(config: RetryConfig): ApiClientBuilder;
  setCacheConfig(config: CacheConfig): ApiClientBuilder;
  build(): ApiClient;
}
