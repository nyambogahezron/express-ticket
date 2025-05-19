import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Define form schemas
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'], 
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

interface AuthFormProps {
  type: 'login' | 'signup';
}

const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const { login, register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues | SignupFormValues>({
    resolver: zodResolver(type === 'login' ? loginSchema : signupSchema),
  });

  const onSubmit = async (data: LoginFormValues | SignupFormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (type === 'login') {
        const { email, password } = data as LoginFormValues;
        await login(email, password);
        navigate('/dashboard');
      } else {
        const { name, email, password } = data as SignupFormValues;
        await registerUser(name, email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {type === 'login' ? 'Log in to your account' : 'Create your account'}
      </h2>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {type === 'signup' && (
          <div>
            <label htmlFor="name" className="label">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                className={`input pl-10 ${errors.name ? 'border-red-500' : ''}`}
                placeholder="John Doe"
                {...register('name')}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="email" className="label">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
              placeholder="you@example.com"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="label">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              className={`input pl-10 ${errors.password ? 'border-red-500' : ''}`}
              placeholder="••••••••"
              {...register('password')}
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {type === 'signup' && (
          <div>
            <label htmlFor="confirmPassword" className="label">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                className={`input pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="••••••••"
                {...register('confirmPassword')}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>
        )}

        {type === 'login' && (
          <div className="flex justify-end">
            <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
              Forgot your password?
            </Link>
          </div>
        )}

        <button
          type="submit"
          className="btn-primary w-full py-2.5 flex items-center justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            'Processing...'
          ) : (
            <>
              {type === 'login' ? 'Log in' : 'Sign up'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-600">
        {type === 'login' ? (
          <>
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Log in
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;