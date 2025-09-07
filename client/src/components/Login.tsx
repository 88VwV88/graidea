import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { LoginCredentials } from '../types/auth';
import Notification from './Notification';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { generateAriaId } from '../lib/aria-utils';

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('error');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';
  
  // Generate IDs for ARIA relationships
  const formId = generateAriaId('login-form');
  const errorId = generateAriaId('login-error');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginCredentials>();

  const showError = (message: string) => {
    setError(message);
    setNotificationMessage(message);
    setNotificationType('error');
    setShowNotification(true);
  };

  const showSuccess = (message: string) => {
    setNotificationMessage(message);
    setNotificationType('success');
    setShowNotification(true);
  };

  const onSubmit = async (data: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError('');
      await login(data);
      showSuccess('Login successful! Redirecting...');
      reset();
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (err: unknown) {
      console.error('Login error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Notification
        message={notificationMessage}
        type={notificationType}
        isVisible={showNotification}
        onClose={() => setShowNotification(false)}
        priority="assertive"
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h1 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Sign in to your account
            </h1>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link
                to="/signup"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                create a new account
              </Link>
            </p>
          </div>
          
          <form 
            className="mt-8 space-y-6" 
            onSubmit={handleSubmit(onSubmit)}
            id={formId}
            role="form"
            aria-label="Login form"
            noValidate
          >
            {error && (
              <div 
                id={errorId}
                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md"
                role="alert"
                aria-live="polite"
              >
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <Input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                label="Email address"
                placeholder="Enter your email"
                required
                error={errors.email?.message}
                invalid={!!errors.email}
                aria-describedby={error ? errorId : undefined}
              />
              
              <Input
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                label="Password"
                placeholder="Enter your password"
                required
                error={errors.password?.message}
                invalid={!!errors.password}
                aria-describedby={error ? errorId : undefined}
              />
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                loading={isLoading}
                loadingText="Signing in..."
                className="w-full"
                aria-describedby={error ? errorId : undefined}
              >
                Sign in
              </Button>
            </div>
            
            <div className="text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;