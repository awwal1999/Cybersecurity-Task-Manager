// =====================================================
// Main Schemas Export
// =====================================================

// Export all model schemas
export * from './models';

// Export all form schemas
export * from './forms';

// Export all filter schemas
export * from './filters';

// Export all field schemas
export * from './fields';

// Export all validation helpers
export * from './validation';

// Export all API schemas
export * from './api';

// =====================================================
// Type Inference from Schemas
// =====================================================

import type { z } from 'zod';
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  LoginSchema,
  RegisterSchema,
} from './forms';
import { TaskFiltersSchema } from './filters';


// Infer types from schemas
export type CreateTaskFormData = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof UpdateTaskSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
export type TaskFilters = z.infer<typeof TaskFiltersSchema>;
