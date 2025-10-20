import type { Task } from './models';
import type { CreateTaskFormData, UpdateTaskFormData } from './forms';
import type { TaskFilters } from './filters';

// =====================================================
// Component Props Types
// =====================================================

// Task Card Props
export interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
  onToggleStatus?: (task: Task) => void;
}

// Task Form Props
export interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskFormData | UpdateTaskFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

// Task List Props
export interface TaskListProps {
  tasks: Task[];
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  onTaskEdit: (task: Task) => void;
  onTaskDelete: (task: Task) => void;
  onTaskToggleStatus: (task: Task) => void;
  isLoading?: boolean;
}

