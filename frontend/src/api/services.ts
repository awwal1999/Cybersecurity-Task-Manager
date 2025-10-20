import { apiClient } from './client';
import type { LoginFormData, RegisterFormData, CreateTaskFormData, UpdateTaskFormData, TaskFilters } from '../types';

export const authApi = {
  login: (data: LoginFormData) => apiClient.post('/auth/login', data),
  register: (data: RegisterFormData) => apiClient.post('/auth/register', data),
  logout: () => apiClient.post('/auth/logout'),
  me: () => apiClient.get('/auth/me'),
};

export const tasksApi = {
  getTasks: (filters?: TaskFilters, page = 1) => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.due_date) params.append('due_date', filters.due_date);
    if (filters?.search) params.append('search', filters.search);
    params.append('page', page.toString());
    return apiClient.get(`/tasks?${params.toString()}`);
  },
  
  getTask: (id: number) => apiClient.get(`/tasks/${id}`),
  createTask: (data: CreateTaskFormData) => apiClient.post('/tasks', data),
  updateTask: (id: number, data: UpdateTaskFormData) => apiClient.put(`/tasks/${id}`, data),
  deleteTask: (id: number) => apiClient.delete(`/tasks/${id}`),
  markComplete: (id: number) => apiClient.patch(`/tasks/${id}/complete`),
  reopen: (id: number) => apiClient.patch(`/tasks/${id}/reopen`),
};
