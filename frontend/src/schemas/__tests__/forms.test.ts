import { CreateTaskSchema, UpdateTaskSchema, LoginSchema, RegisterSchema } from '../forms';

describe('Form Schemas', () => {
  describe('CreateTaskSchema', () => {
    it('validates valid task data', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const validData = {
        title: 'Test Task',
        description: 'Test Description',
        due_date: tomorrow.toISOString().split('T')[0],
      };

      const result = CreateTaskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates task with minimal required data', () => {
      const validData = {
        title: 'Test Task',
      };

      const result = CreateTaskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects empty title', () => {
      const invalidData = {
        title: '',
        description: 'Test Description',
      };

      const result = CreateTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Title is required');
      }
    });

    it('rejects title that is too long', () => {
      const invalidData = {
        title: 'a'.repeat(256),
        description: 'Test Description',
      };

      const result = CreateTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Title must not exceed 255 characters');
      }
    });

    it('rejects invalid status', () => {
      const invalidData = {
        title: 'Test Task',
        status: 'invalid',
      };

      const result = CreateTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('rejects past due date', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const invalidData = {
        title: 'Test Task',
        due_date: yesterday.toISOString().split('T')[0],
      };

      const result = CreateTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Due date must be today or in the future');
      }
    });

    it('transforms empty description to undefined', () => {
      const data = {
        title: 'Test Task',
        description: '',
      };

      const result = CreateTaskSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBe(undefined);
      }
    });
  });

  describe('UpdateTaskSchema', () => {
    it('validates valid update data', () => {
      const validData = {
        title: 'Updated Task',
        description: 'Updated Description',
        status: 'closed',
        due_date: '2024-12-31',
      };

      const result = UpdateTaskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('validates partial update data', () => {
      const validData = {
        title: 'Updated Task',
      };

      const result = UpdateTaskSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects empty title', () => {
      const invalidData = {
        title: '',
      };

      const result = UpdateTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Title is required');
      }
    });

    it('rejects invalid date format', () => {
      const invalidData = {
        title: 'Test Task',
        due_date: 'invalid-date',
      };

      const result = UpdateTaskSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid date');
      }
    });
  });

  describe('LoginSchema', () => {
    it('validates valid login data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const result = LoginSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects invalid email', () => {
      const invalidData = {
        email: 'invalid-email',
        password: 'password123',
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
      }
    });

    it('rejects empty password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '',
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password is required');
      }
    });

    it('rejects short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: '123',
      };

      const result = LoginSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must be at least 8 characters');
      }
    });

    it('transforms email to lowercase', () => {
      const data = {
        email: 'TEST@EXAMPLE.COM',
        password: 'password123',
      };

      const result = LoginSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });
  });

  describe('RegisterSchema', () => {
    it('validates valid registration data', () => {
      const validData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        password_confirmation: 'Password123',
      };

      const result = RegisterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects empty name', () => {
      const invalidData = {
        name: '',
        email: 'test@example.com',
        password: 'Password123',
        password_confirmation: 'Password123',
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name is required');
      }
    });

    it('rejects short name', () => {
      const invalidData = {
        name: 'A',
        email: 'test@example.com',
        password: 'Password123',
        password_confirmation: 'Password123',
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Name must be at least 2 characters');
      }
    });

    it('rejects invalid email', () => {
      const invalidData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'Password123',
        password_confirmation: 'Password123',
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Please enter a valid email address');
      }
    });

    it('rejects weak password', () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
        password_confirmation: 'password',
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Password must contain at least one lowercase letter, one uppercase letter, and one number');
      }
    });

    it('rejects mismatched passwords', () => {
      const invalidData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
        password_confirmation: 'DifferentPassword123',
      };

      const result = RegisterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Passwords do not match');
      }
    });

    it('transforms email to lowercase', () => {
      const data = {
        name: 'Test User',
        email: 'TEST@EXAMPLE.COM',
        password: 'Password123',
        password_confirmation: 'Password123',
      };

      const result = RegisterSchema.safeParse(data);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
      }
    });
  });
});
