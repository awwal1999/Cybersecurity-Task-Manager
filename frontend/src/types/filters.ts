import type { TaskStatus } from './models';

// =====================================================
// Filter and Search Types
// =====================================================

// Task Filter Options
export interface TaskFilters {
  status?: TaskStatus;
  due_date?: 'today' | 'this_week' | 'overdue';
  search?: string;
  page?: number;
}

// Task Sort Options
export interface TaskSortOptions {
  field: 'created_at' | 'updated_at' | 'due_date' | 'title';
  direction: 'asc' | 'desc';
}

