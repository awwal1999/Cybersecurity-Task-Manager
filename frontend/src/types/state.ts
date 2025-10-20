import type { Task } from './models';
import type { TaskFilters } from './filters';
import type { AuthState } from './auth';

// =====================================================
// State Management Types
// =====================================================

// Task State
export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  filters: TaskFilters;
  isLoading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// App State
export interface AppState {
  auth: AuthState;
  tasks: TaskState;
}

