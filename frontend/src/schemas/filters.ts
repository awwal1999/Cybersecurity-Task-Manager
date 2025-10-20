import { z } from 'zod';

// =====================================================
// Filter and Search Validation Schemas
// =====================================================

// Task Filters Schema
export const TaskFiltersSchema = z.object({
  status: z.enum(['open', 'closed']).optional(),
  due_date: z.enum(['today', 'this_week', 'overdue']).optional(),
  search: z.string().optional(),
  page: z.number().min(1).optional().default(1),
});

// Task Sort Schema
export const TaskSortSchema = z.object({
  field: z.enum(['created_at', 'updated_at', 'due_date', 'title']),
  direction: z.enum(['asc', 'desc']),
});

// Search Options Schema
export const SearchOptionsSchema = z.object({
  query: z.string().min(1),
  fields: z.array(z.string()),
  caseSensitive: z.boolean().optional().default(false),
  exactMatch: z.boolean().optional().default(false),
});

// Pagination Schema
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  perPage: z.number().min(1).max(100).default(15),
  total: z.number().min(0).optional(),
});
