import { useState, useCallback, type ReactNode } from 'react';
import { tasksApi } from '../api';
import { TasksContext, type TasksContextType } from './TasksContext';
import type { Task, CreateTaskFormData, UpdateTaskFormData, TaskFilters } from '../types';

interface TasksProviderProps {
  children: ReactNode;
}

export const TasksProvider: React.FC<TasksProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const fetchTasks = useCallback(async (filters?: TaskFilters, page: number = 1): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await tasksApi.getTasks(filters, page);
      setTasks(response.data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createTask = useCallback(async (data: CreateTaskFormData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await tasksApi.createTask(data);
      setTasks(prev => [response.data, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTask = useCallback(async (id: number, data: UpdateTaskFormData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await tasksApi.updateTask(id, data);
      setTasks(prev => prev.map(task => task.id === id ? response.data : task));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteTask = useCallback(async (id: number): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await tasksApi.deleteTask(id);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markComplete = useCallback(async (id: number): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await tasksApi.markComplete(id);
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, status: 'closed' } : task
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark task as complete');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reopen = useCallback(async (id: number): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await tasksApi.reopen(id);
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, status: 'open' } : task
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reopen task');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: TasksContextType = {
    tasks,
    isLoading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    markComplete,
    reopen,
    clearError,
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
};
