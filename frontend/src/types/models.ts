// =====================================================
// Domain Models
// =====================================================

// Task Status Enum
export const TaskStatus = {
  OPEN: 'open',
  CLOSED: 'closed',
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

// User Interface
export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

// Task Interface
export interface Task {
  id: number;
  title: string;
  description: string | null;
  status: TaskStatus;
  due_date: string | null;
  completed_at: string | null;
  is_completed: boolean;
  is_overdue: boolean;
  created_at: string;
  updated_at: string;
  activities_count?: number;
}

// Task Activity Interface
export interface TaskActivity {
  id: number;
  task_id: number;
  description: string;
  created_at: string;
  updated_at: string;
}

// Task with User (for detailed views)
export interface TaskWithUser extends Task {
  user: User;
}

// Task with Activities
export interface TaskWithActivities extends Task {
  activities: TaskActivity[];
}

// Partial Task for updates
export type PartialTask = Partial<Task>;

