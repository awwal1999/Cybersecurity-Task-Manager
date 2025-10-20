import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider, TasksProvider, ToastProvider } from './contexts';

interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialRoute?: string;
  isAuthenticated?: boolean;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <TasksProvider>
            {children}
          </TasksProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
};

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { initialRoute = '/', ...renderOptions } = options;

  // Set initial route if provided
  if (initialRoute !== '/') {
    window.history.pushState({}, 'Test page', initialRoute);
  }

  return render(ui, {
    wrapper: AllTheProviders,
    ...renderOptions,
  });
};

// Mock API responses
export const mockApiResponses = {
  login: {
    success: {
      data: {
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
        },
        token: 'mock-jwt-token',
      },
    },
    error: {
      response: {
        data: {
          message: 'Invalid credentials',
        },
        status: 401,
      },
    },
  },
  tasks: {
    success: {
      data: {
        data: [
          {
            id: 1,
            title: 'Test Task',
            description: 'Test Description',
            status: 'open',
            due_date: '2024-12-31',
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
          },
        ],
      },
    },
    empty: {
      data: {
        data: [],
      },
    },
  },
};

// Mock localStorage
export const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock axios
export const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn(),
    },
    response: {
      use: jest.fn(),
    },
  },
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
