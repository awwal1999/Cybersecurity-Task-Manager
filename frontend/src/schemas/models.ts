import { z } from 'zod';

// =====================================================
// Model Validation Schemas
// =====================================================

// Task Status Schema
export const TaskStatusSchema = z.enum(['open', 'closed']);

// User Schema
export const UserSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1).max(255),
  email: z.email().toLowerCase().trim(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Task Schema
export const TaskSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1).max(255),
  description: z.string().nullable(),
  status: TaskStatusSchema,
  due_date: z.string().date().nullable(),
  completed_at: z.string().datetime().nullable(),
  is_completed: z.boolean(),
  is_overdue: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
  activities_count: z.number().int().min(0).optional(),
});

// Task Activity Schema
export const TaskActivitySchema = z.object({
  id: z.number().int().positive(),
  task_id: z.number().int().positive(),
  description: z.string().min(1),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

// Task with User Schema
export const TaskWithUserSchema = TaskSchema.extend({
  user: UserSchema,
});

// Task with Activities Schema
export const TaskWithActivitiesSchema = TaskSchema.extend({
  activities: z.array(TaskActivitySchema),
});
