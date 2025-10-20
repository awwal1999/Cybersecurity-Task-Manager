import { useState, useEffect } from 'react';
import { useAuth, useTasks } from '../hooks';
import { Button, LoadingSpinner } from '../components';
import { TaskList } from '../components';
import { TaskForm } from '../components';
import { TaskFilters } from '../components';
import type { TaskFilters as TaskFiltersType } from '../types';
import * as React from "react";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { tasks, isLoading, error, fetchTasks } = useTasks();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const [filters, setFilters] = useState<TaskFiltersType>({});

  useEffect(() => {
    fetchTasks(filters);
  }, [filters, fetchTasks]);

  const handleCreateTask = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  const handleEditTask = (taskId: number) => {
    setEditingTask(taskId);
    setShowTaskForm(true);
  };

  const handleCloseTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleFiltersChange = (newFilters: TaskFiltersType) => {
    setFilters(newFilters);
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      {/* Create Task Button */}
      <div className="mb-4 sm:mb-6">
        <Button onClick={handleCreateTask} variant="primary" className="w-full sm:w-auto">
          Create New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4 sm:mb-6">
        <TaskFilters onFiltersChange={handleFiltersChange} />
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 sm:mb-6 rounded-md bg-red-50 p-3 sm:p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      {/* Task List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <TaskList
          tasks={tasks}
          onEditTask={handleEditTask}
          isLoading={isLoading}
        />
      </div>

      {/* Task Form Modal */}
      {showTaskForm && (
        <TaskForm
          taskId={editingTask}
          onClose={handleCloseTaskForm}
          onSuccess={handleCloseTaskForm}
        />
      )}
    </div>
  );
};
