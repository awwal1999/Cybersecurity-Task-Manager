import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Input } from '../components';
import { useAuth } from '../hooks';
import { LoginSchema, type LoginFormData } from '../schemas';
import * as React from "react";

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      setError('root', {
        message: error instanceof Error ? error.message : 'Login failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8">
        <div>
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-6 sm:mt-8 space-y-4 sm:space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
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
              autoComplete="current-password"
              error={errors.password?.message}
              placeholder="Enter your password"
            />
          </div>

          {errors.root && (
            <div className="rounded-md bg-red-50 p-3 sm:p-4">
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
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
