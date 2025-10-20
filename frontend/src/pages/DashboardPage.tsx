import { useState, useEffect } from 'react';
import { useAuth, useTasks } from '../hooks';
import { Button, LoadingSpinner } from '../components';
import { TaskList } from '../components';
import { TaskForm } from '../components';
import { TaskFilters } from '../components';
import type { TaskFilters as TaskFiltersType } from '../types';
import * as React from "react";

export const DashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
              <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button onClick={handleCreateTask} variant="primary">
                Create Task
              </Button>
              <Button onClick={logout} variant="secondary">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6">
          <TaskFilters onFiltersChange={handleFiltersChange} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {/* Task List */}
        <div className="bg-white shadow rounded-lg">
          <TaskList
            tasks={tasks}
            onEditTask={handleEditTask}
            isLoading={isLoading}
          />
        </div>
      </main>

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
