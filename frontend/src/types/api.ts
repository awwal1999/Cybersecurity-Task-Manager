// =====================================================
// API Response Types
// =====================================================

// Base API Response
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

// Paginated Response
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string | null;
    last: string | null;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number | null;
    last_page: number;
    path: string;
    per_page: number;
    to: number | null;
    total: number;
  };
}

// API Error Response
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}

// Validation Error
export interface ValidationError {
  field: string;
  message: string;
}

