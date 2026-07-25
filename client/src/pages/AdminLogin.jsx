// client/src/pages/AdminLogin.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../api';
import './AdminLogin.css';

const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export default function AdminLogin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Already logged in → go straight to dashboard
  if (localStorage.getItem('token')) {
    navigate('/admin', { replace: true });
    return null;
  }

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(LoginSchema) });

  const onSubmit = async (data) => {
    try {
      const { token } = await login(data);
      localStorage.setItem('token', token);
      navigate('/admin', { replace: true });
    } catch (err) {
      toast.error(err?.message || 'Login failed — please try again');
    }
  };

  const handleFillDemo = () => {
    setValue('username', 'admin', { shouldValidate: true });
    setValue('password', 'Admin@1234', { shouldValidate: true });
    toast.success('Demo credentials filled!');
  };

  return (
    <div className="light-login-page">
      {/* Ambient background glow blobs */}
      <div className="bg-blob blob-top-left" />
      <div className="bg-blob blob-bottom-right" />

      {/* Decorative Dot Grids */}
      <div className="dot-grid grid-top-right">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="dot" />
        ))}
      </div>
      <div className="dot-grid grid-bottom-left">
        {[...Array(20)].map((_, i) => (
          <span key={i} className="dot" />
        ))}
      </div>

      {/* Main Card */}
      <div className="light-login-card">
        {/* Brand Header */}
        <div className="brand-header">
          <div className="brand-logo-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="11" width="4" height="10" rx="1.5" fill="white" />
              <rect x="10" y="7" width="4" height="14" rx="1.5" fill="white" />
              <rect x="17" y="3" width="4" height="18" rx="1.5" fill="white" />
            </svg>
          </div>
          <div className="brand-title">
            <span className="brand-lead">Lead</span>
            <span className="brand-desk">Desk</span>
          </div>
        </div>
        <p className="brand-subtitle">Lead Management Simplified</p>

        <div className="header-divider" />

        {/* Welcome Text */}
        <div className="welcome-section">
          <h1 className="welcome-title">Welcome Back! 👋</h1>
          <p className="welcome-subtitle">Sign in to access your admin dashboard</p>
        </div>

        {/* Login Form */}
        <form id="login-form" className="light-login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Username Field */}
          <div className="light-field">
            <label htmlFor="username">Username</label>
            <div className={`input-icon-wrapper ${errors.username ? 'error' : ''}`}>
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="username"
                type="text"
                placeholder="admin"
                autoComplete="username"
                {...register('username')}
              />
            </div>
            {errors.username && <span className="field-error">{errors.username.message}</span>}
          </div>

          {/* Password Field */}
          <div className="light-field">
            <label htmlFor="password">Password</label>
            <div className={`input-icon-wrapper ${errors.password ? 'error' : ''}`}>
              <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                autoComplete="current-password"
                {...register('password')}
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password.message}</span>}
          </div>

          <button id="login-submit" type="submit" className="light-btn-primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="light-spinner" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              'Sign In →'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="or-divider">
          <span>or</span>
        </div>

        {/* Demo Credentials Box */}
        <div className="demo-credentials-box" onClick={handleFillDemo} role="button" tabIndex={0} title="Click to fill credentials">
          <div className="demo-header">
            <svg className="demo-info-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
            <div>
              <span className="demo-title">Demo Credentials</span>
              <p className="demo-subtitle">Use the following credentials to access the dashboard.</p>
            </div>
          </div>
          <div className="demo-body">
            <div className="demo-row">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span className="demo-label">Username:</span>
              <span className="demo-badge">admin</span>
            </div>
            <div className="demo-row">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span className="demo-label">Password:</span>
              <span className="demo-badge">Admin@1234</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
