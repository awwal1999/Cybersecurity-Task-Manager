import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, Input } from './';
import { useTasks } from '../hooks';
import { CreateTaskSchema, UpdateTaskSchema } from '../schemas';
import * as React from "react";

interface TaskFormProps {
  taskId?: number | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  taskId,
  onClose,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { tasks, createTask, updateTask } = useTasks();
  
  const isEditing = !!taskId;
  const task = isEditing ? tasks.find(t => t.id === taskId) : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm({
    resolver: zodResolver(isEditing ? UpdateTaskSchema : CreateTaskSchema),
    defaultValues: isEditing && task ? {
      title: task.title,
      description: task.description || '',
      due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
    } : {
      title: '',
      description: '',
      due_date: '',
    },
  });

  useEffect(() => {
    if (isEditing && task) {
      reset({
        title: task.title,
        description: task.description || '',
        due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
      });
    }
  }, [isEditing, task, reset]);

  const onSubmit = async (data: unknown) => {
    setIsLoading(true);
    try {
      if (isEditing && taskId) {
        await updateTask(taskId, data);
      } else {
        await createTask(data);
      }
      onSuccess();
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'Failed to save task',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={isEditing ? 'Edit Task' : 'Create New Task'}
      size="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register('title')}
          label="Title"
          type="text"
          error={errors.title?.message}
          placeholder="Enter task title"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter task description (optional)"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
          )}
        </div>


        <Input
          {...register('due_date')}
          label="Due Date"
          type="date"
          error={errors.due_date?.message}
        />

        {errors.root && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">
              {errors.root.message}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
          >
            {isEditing ? 'Update Task' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
