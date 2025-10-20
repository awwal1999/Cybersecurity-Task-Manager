import { z } from 'zod';
import { TaskSchema, UserSchema, TaskActivitySchema } from './models';

// =====================================================
// API Response Validation Schemas
// =====================================================

// Base API Response Schema
export const ApiResponseSchema = z.object({
  data: z.unknown(),
  message: z.string().optional(),
  status: z.enum(['success', 'error']),
});

// Paginated Response Schema
export const PaginatedResponseSchema = z.object({
  data: z.array(z.unknown()),
  links: z.object({
    first: z.string().nullable(),
    last: z.string().nullable(),
    prev: z.string().nullable(),
    next: z.string().nullable(),
  }),
  meta: z.object({
    current_page: z.number().int().min(1),
    from: z.number().int().min(0).nullable(),
    last_page: z.number().int().min(1),
    path: z.string(),
    per_page: z.number().int().min(1),
    to: z.number().int().min(0).nullable(),
    total: z.number().int().min(0),
  }),
});

// Task List Response Schema
export const TaskListResponseSchema = PaginatedResponseSchema.extend({
  data: z.array(TaskSchema),
});

// Single Task Response Schema
export const TaskResponseSchema = ApiResponseSchema.extend({
  data: TaskSchema,
});

// User Response Schema
export const UserResponseSchema = ApiResponseSchema.extend({
  data: UserSchema,
});

// Task Activity Response Schema
export const TaskActivityResponseSchema = ApiResponseSchema.extend({
  data: z.array(TaskActivitySchema),
});

// =====================================================
// API Error Schemas
// =====================================================

// API Error Response Schema
export const ApiErrorSchema = z.object({
  message: z.string(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
  status: z.number().int().min(100).max(599),
});

// Validation Error Schema
export const ValidationErrorSchema = z.object({
  field: z.string(),
  message: z.string(),
});

// =====================================================
// Authentication Response Schemas
// =====================================================

// JWT Token Response Schema
export const AuthTokenResponseSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.literal('bearer'),
  expires_in: z.number().int().positive(),
});

// Login Response Schema
export const LoginResponseSchema = z.object({
  user: UserSchema,
  token: AuthTokenResponseSchema,
});

// Register Response Schema
export const RegisterResponseSchema = z.object({
  user: UserSchema,
  token: AuthTokenResponseSchema,
});
