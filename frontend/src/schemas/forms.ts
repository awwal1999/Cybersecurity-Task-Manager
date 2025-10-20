import { z } from 'zod';

// =====================================================
// Form Validation Schemas
// =====================================================

// Create Task Schema
export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters')
    .trim(),
  description: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || null),
  status: z.enum(['open', 'closed']).optional().default('open'),
  due_date: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date >= today;
      },
      {
        message: 'Due date must be today or in the future',
      }
    )
    .transform((val) => val || null),
});

// Update Task Schema
export const UpdateTaskSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must not exceed 255 characters')
    .trim()
    .optional(),
  description: z
    .string()
    .optional()
    .nullable()
    .transform((val) => val || null),
  status: z.enum(['open', 'closed']).optional(),
  due_date: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val) return true;
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: 'Please enter a valid date',
      }
    )
    .transform((val) => val || null),
});

// Login Schema
export const LoginSchema = z.object({
  email: z
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

// Register Schema
export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .min(2, 'Name must be at least 2 characters')
      .max(255, 'Name must not exceed 255 characters')
      .trim(),
    email: z
      .email('Please enter a valid email address')
      .toLowerCase()
      .trim(),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one lowercase letter, one uppercase letter, and one number'
      ),
    password_confirmation: z
      .string()
      .min(1, 'Password confirmation is required'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match',
    path: ['password_confirmation'],
  });
