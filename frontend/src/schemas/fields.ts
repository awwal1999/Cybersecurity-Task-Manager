import { z } from 'zod';

// =====================================================
// Individual Field Validation Schemas
// =====================================================

// Title Schema
export const TitleSchema = z
  .string()
  .min(1, 'Title is required')
  .max(255, 'Title must not exceed 255 characters')
  .trim();

// Description Schema
export const DescriptionSchema = z
  .string()
  .optional()
  .nullable()
  .transform((val) => val || null);

// Due Date Schema
export const DueDateSchema = z
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
  .transform((val) => val || null);

// Email Schema
export const EmailSchema = z
  .email('Please enter a valid email address')
  .toLowerCase()
  .trim();

// Password Schema
export const PasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one lowercase letter, one uppercase letter, and one number'
  );

// Name Schema
export const NameSchema = z
  .string()
  .min(1, 'Name is required')
  .min(2, 'Name must be at least 2 characters')
  .max(255, 'Name must not exceed 255 characters')
  .trim();

// ID Schema
export const IdSchema = z.number().int().positive();

// Status Schema
export const StatusSchema = z.enum(['open', 'closed']);

// Date Schema
export const DateSchema = z.string().date();

// DateTime Schema
export const DateTimeSchema = z.string().datetime();

// Boolean Schema
export const BooleanSchema = z.boolean();

// String Schema
export const StringSchema = z.string();

// Number Schema
export const NumberSchema = z.number();

// Optional String Schema
export const OptionalStringSchema = z.string().optional();

// Required String Schema
export const RequiredStringSchema = z.string().min(1);
