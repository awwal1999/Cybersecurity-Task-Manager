// =====================================================
// Utility Types
// =====================================================

// Make all properties optional
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make all properties required
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

// Pick specific properties from a type
export type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit specific properties from a type
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

// =====================================================
// API Response Utility Types
// =====================================================

// Extract data from API response
export type ExtractApiData<T> = T extends { data: infer U } ? U : never;

// Extract pagination meta from paginated response
export type ExtractPaginationMeta<T> = T extends { meta: infer U } ? U : never;

// Extract links from paginated response
export type ExtractPaginationLinks<T> = T extends { links: infer U } ? U : never;

// =====================================================
// Form Utility Types
// =====================================================

// Form field state
export interface FormFieldState {
  value: unknown;
  error: string | null;
  touched: boolean;
  dirty: boolean;
}

// Form state
export interface FormState<T = unknown> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  dirty: Partial<Record<keyof T, boolean>>;
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}

// Form field props
export interface FormFieldProps<T = unknown> {
  name: keyof T;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur: () => void;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
  required?: boolean;
}

// =====================================================
// Component Utility Types
// =====================================================

// Component with children
export interface ComponentWithChildren {
  children: React.ReactNode;
}

// Component with className
export interface ComponentWithClassName {
  className?: string;
}

// Component with loading state
export interface ComponentWithLoading {
  isLoading?: boolean;
}

// Component with error state
export interface ComponentWithError {
  error?: string | null;
}

// Component with disabled state
export interface ComponentWithDisabled {
  disabled?: boolean;
}

// Component with size variants
export interface ComponentWithSize {
  size?: 'sm' | 'md' | 'lg';
}

// Component with color variants
export interface ComponentWithColor {
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
}

// Component with variant
export interface ComponentWithVariant {
  variant?: 'solid' | 'outline' | 'ghost' | 'link';
}

// =====================================================
// Event Handler Types
// =====================================================

// Generic event handler
export type EventHandler<T = unknown> = (event: T) => void;

// Click event handler
export type ClickHandler = EventHandler<React.MouseEvent<HTMLElement>>;

// Change event handler
export type ChangeHandler = EventHandler<React.ChangeEvent<HTMLInputElement>>;

// Submit event handler
export type SubmitHandler = EventHandler<React.FormEvent<HTMLFormElement>>;

// Focus event handler
export type FocusHandler = EventHandler<React.FocusEvent<HTMLElement>>;

// Blur event handler
export type BlurHandler = EventHandler<React.FocusEvent<HTMLElement>>;

// =====================================================
// Async Utility Types
// =====================================================

// Async function type
export type AsyncFunction<T = unknown, R = unknown> = (args: T) => Promise<R>;

// Async state
export interface AsyncState<T = unknown> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Async action
export interface AsyncAction<T = unknown> {
  type: string;
  payload?: T;
  error?: string;
}

// =====================================================
// Validation Utility Types
// =====================================================

// Validation rule
export interface ValidationRule<T = unknown> {
  validate: (value: T) => boolean | string;
  message: string;
}

// Validation result
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Field validation
export interface FieldValidation<T = unknown> {
  rules: ValidationRule<T>[];
  validate: (value: T) => ValidationResult;
}

// =====================================================
// Date Utility Types
// =====================================================

// Date range
export interface DateRange {
  start: Date;
  end: Date;
}

// Date format options
export interface DateFormatOptions {
  format: 'short' | 'medium' | 'long' | 'full';
  timezone?: string;
  locale?: string;
}

// =====================================================
// Search and Filter Utility Types
// =====================================================

// Search options
export interface SearchOptions {
  query: string;
  fields: string[];
  caseSensitive?: boolean;
  exactMatch?: boolean;
}

// Filter options
export interface FilterOptions<T = unknown> {
  field: keyof T;
  operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'nin' | 'like' | 'ilike';
  value: unknown;
}

// Sort options
export interface SortOptions<T = unknown> {
  field: keyof T;
  direction: 'asc' | 'desc';
}

// =====================================================
// Pagination Utility Types
// =====================================================

// Pagination options
export interface PaginationOptions {
  page: number;
  perPage: number;
  total?: number;
}

// Pagination state
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// =====================================================
// Storage Utility Types
// =====================================================

// Storage interface
export interface Storage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  length: number;
  key(index: number): string | null;
}

// Storage options
export interface StorageOptions {
  prefix?: string;
  serializer?: {
    serialize: (value: unknown) => string;
    deserialize: (value: string) => unknown;
  };
}

// =====================================================
// Theme Utility Types
// =====================================================

// Theme colors
export interface ThemeColors {
  primary: string;
  secondary: string;
  success: string;
  warning: string;
  danger: string;
  info: string;
  light: string;
  dark: string;
}

// Theme spacing
export interface ThemeSpacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

// Theme breakpoints
export interface ThemeBreakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

// Theme configuration
export interface ThemeConfig {
  colors: ThemeColors;
  spacing: ThemeSpacing;
  breakpoints: ThemeBreakpoints;
  fonts: {
    sans: string[];
    serif: string[];
    mono: string[];
  };
  fontSizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
}
