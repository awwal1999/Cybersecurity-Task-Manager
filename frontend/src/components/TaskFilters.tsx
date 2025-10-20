import { useState } from 'react';
import { Button, Input } from './';
import type { TaskFilters as TaskFiltersType } from '../types';
import * as React from "react";

interface TaskFiltersProps {
  onFiltersChange: (filters: TaskFiltersType) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<TaskFiltersType>({
    status: undefined,
    due_date: undefined,
    search: '',
  });

  const handleFilterChange = (key: keyof TaskFiltersType, value: string) => {
    const newFilters = { 
      ...filters, 
      [key]: value === '' ? undefined : value as TaskFiltersType[keyof TaskFiltersType] 
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { status: undefined, due_date: undefined, search: '' };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== undefined);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Search */}
        <div>
          <Input
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search tasks..."
            label="Search"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Due Date Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <select
            value={filters.due_date || ''}
            onChange={(e) => handleFilterChange('due_date', e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          {hasActiveFilters && (
            <Button
              variant="secondary"
              onClick={clearFilters}
              className="w-full"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
