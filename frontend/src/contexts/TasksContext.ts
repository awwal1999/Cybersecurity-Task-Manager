import { createContext } from 'react';
import type { Task, CreateTaskFormData, UpdateTaskFormData, TaskFilters } from '../types';

export interface TasksContextType {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  fetchTasks: (filters?: TaskFilters, page?: number) => Promise<void>;
  createTask: (data: CreateTaskFormData) => Promise<void>;
  updateTask: (id: number, data: UpdateTaskFormData) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  markComplete: (id: number) => Promise<void>;
  reopen: (id: number) => Promise<void>;
  clearError: () => void;
}

export const TasksContext = createContext<TasksContextType | undefined>(undefined);
