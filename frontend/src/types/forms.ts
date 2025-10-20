import type { TaskStatus } from './models';

// =====================================================
// Form Data Types
// =====================================================

// Create Task Form Data
export interface CreateTaskFormData {
  title: string;
  description?: string;
  status?: TaskStatus;
  due_date?: string;
}

// Update Task Form Data
export interface UpdateTaskFormData {
  title?: string;
  description?: string;
  status?: TaskStatus;
  due_date?: string;
}

// Login Form Data
export interface LoginFormData {
  email: string;
  password: string;
}

// Register Form Data
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

