import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../components';
import { useAuth } from '../hooks';
import { RegisterSchema, type RegisterFormData } from '../schemas';
import * as React from "react";

export const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
  });


  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await registerUser(data);
      navigate('/dashboard');
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'Registration failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              {...register('name')}
              label="Full name"
              type="text"
              autoComplete="name"
              error={errors.name?.message}
              placeholder="Enter your full name"
            />
            
            <Input
              {...register('email')}
              label="Email address"
              type="email"
              autoComplete="email"
              error={errors.email?.message}
              placeholder="Enter your email"
            />
            
            <Input
              {...register('password')}
              label="Password"
              type="password"
              autoComplete="new-password"
              error={errors.password?.message}
              placeholder="Create a password"
              helperText="Must be at least 8 characters long"
            />
            
            <Input
              {...register('password_confirmation')}
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              error={errors.password_confirmation?.message}
              placeholder="Confirm your password"
            />
          </div>

          {errors.root && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">
                {errors.root.message}
              </div>
            </div>
          )}

          <div>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full"
            >
              Create account
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
