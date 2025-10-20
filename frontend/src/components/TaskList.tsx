import { Button, LoadingSpinner } from './';
import { useTasks } from '../hooks';
import { useToast } from '../hooks';
import type { Task } from '../types';
import * as React from "react";

interface TaskListProps {
  tasks: Task[];
  onEditTask: (taskId: number) => void;
  isLoading: boolean;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEditTask,
  isLoading,
}) => {
  const { markComplete, reopen, deleteTask } = useTasks();
  const { showSuccess, showError } = useToast();

  const handleStatusChange = async (task: Task) => {
    try {
      if (task.status === 'open') {
        await markComplete(task.id);
        showSuccess('Task Completed', 'Task has been marked as completed.');
      } else {
        await reopen(task.id);
        showSuccess('Task Reopened', 'Task has been reopened.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task status';
      showError('Error', errorMessage);
    }
  };

  const handleDelete = async (taskId: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        showSuccess('Task Deleted', 'Task has been deleted successfully.');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
        showError('Error', errorMessage);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-2 text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Tasks ({tasks.length})</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {tasks.map((task) => (
          <div key={task.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {task.title}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>
                
                {task.description && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {task.description}
                  </p>
                )}
                
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  <span>Created: {new Date(task.created_at).toLocaleDateString()}</span>
                  {task.due_date && (
                    <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  size="sm"
                  variant={task.status === 'open' ? 'primary' : 'secondary'}
                  onClick={() => handleStatusChange(task)}
                >
                  {task.status === 'open' ? 'Complete' : 'Reopen'}
                </Button>
                
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => onEditTask(task.id)}
                >
                  Edit
                </Button>
                
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(task.id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
