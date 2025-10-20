// =====================================================
// Main Types Export
// =====================================================

// Export all model types
export * from './models';

// Export all API types
export * from './api';

// Export all authentication types
export * from './auth';

// Export all form types
export * from './forms';

// Export all filter types
export * from './filters';

// Export all component props types
export * from './components';

// Export all state types
export * from './state';

// Export all utility types
export * from './utils';

// =====================================================
// Convenience Type Aliases
// =====================================================

import type { Task } from './models';
import type { ApiResponse, PaginatedResponse } from './api';
import type { User } from './models';

// Task Response Types
export type TaskListResponse = PaginatedResponse<Task>;
export type TaskResponse = ApiResponse<Task>;
export type UserResponse = ApiResponse<User>;
