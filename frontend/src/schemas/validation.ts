import { z } from 'zod';
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  LoginSchema,
  RegisterSchema,
} from './forms';
import { TaskFiltersSchema } from './filters';

// =====================================================
// Validation Helper Functions
// =====================================================

// Validate task creation data
export const validateCreateTask = (data: unknown) => {
  return CreateTaskSchema.safeParse(data);
};

// Validate task update data
export const validateUpdateTask = (data: unknown) => {
  return UpdateTaskSchema.safeParse(data);
};

// Validate login data
export const validateLogin = (data: unknown) => {
  return LoginSchema.safeParse(data);
};

// Validate registration data
export const validateRegister = (data: unknown) => {
  return RegisterSchema.safeParse(data);
};

// Validate task filters
export const validateTaskFilters = (data: unknown) => {
  return TaskFiltersSchema.safeParse(data);
};

// =====================================================
// Validation Error Helpers
// =====================================================

// Extract validation errors from Zod result
export const extractValidationErrors = (result: z.ZodSafeParseSuccess<unknown> | z.ZodSafeParseError<unknown>) => {
  if (result.success) return null;
  
  const errors: Record<string, string[]> = {};
  
  result.error.issues.forEach((issue) => {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(issue.message);
  });
  
  return errors;
};

// Get first validation error message
export const getFirstValidationError = (result: z.ZodSafeParseSuccess<unknown> | z.ZodSafeParseError<unknown>) => {
  if (result.success) return null;
  return result.error.issues[0]?.message || 'Validation failed';
};

// Check if validation result is successful
export const isValid = (result: z.ZodSafeParseSuccess<unknown> | z.ZodSafeParseError<unknown>) => {
  return result.success;
};

// =====================================================
// Custom Validation Rules
// =====================================================

// Future date validation
export const futureDate = (message = 'Date must be in the future') =>
  z.string().refine(
    (val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date >= today;
    },
    { message }
  );

// Past date validation
export const pastDate = (message = 'Date must be in the past') =>
  z.string().refine(
    (val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return date < today;
    },
    { message }
  );

// Strong password validation
export const strongPassword = (message = 'Password must contain at least one lowercase letter, one uppercase letter, and one number') =>
  z.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    message
  );

// Phone number validation
export const phoneNumber = (message = 'Please enter a valid phone number') =>
  z.string().regex(
    /^[+]?[1-9]\d{0,15}$/,
    message
  );

// URL validation
export const url = (message = 'Please enter a valid URL') =>
  z.string().url(message);

// Slug validation
export const slug = (message = 'Please enter a valid slug (lowercase letters, numbers, and hyphens only)') =>
  z.string().regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    message
  );
