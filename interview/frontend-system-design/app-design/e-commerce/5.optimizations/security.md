# E-commerce Application Security

This document outlines the security measures implemented in our e-commerce application to protect user data, prevent attacks, and ensure a secure shopping experience.

## Table of Contents

1. [Introduction](#introduction)
2. [Authentication and Authorization](#authentication-and-authorization)
   - [Authentication Strategies](#authentication-strategies)
   - [Multi-Factor Authentication](#multi-factor-authentication)
   - [Authorization Framework](#authorization-framework)
   - [Session Management](#session-management)
3. [Data Protection](#data-protection)
   - [Sensitive Data Handling](#sensitive-data-handling)
   - [Data Encryption](#data-encryption)
   - [Payment Information Security](#payment-information-security)
   - [Personal Data Protection](#personal-data-protection)
4. [Frontend Security](#frontend-security)
   - [Cross-Site Scripting (XSS) Prevention](#cross-site-scripting-xss-prevention)
   - [Cross-Site Request Forgery (CSRF) Protection](#cross-site-request-forgery-csrf-protection)
   - [Content Security Policy (CSP)](#content-security-policy-csp)
   - [Subresource Integrity (SRI)](#subresource-integrity-sri)
5. [API Security](#api-security)
   - [Input Validation](#input-validation)
   - [Rate Limiting](#rate-limiting)
   - [API Authentication](#api-authentication)
   - [Error Handling](#error-handling)
6. [Network Security](#network-security)
   - [HTTPS Implementation](#https-implementation)
   - [HTTP Security Headers](#http-security-headers)
   - [WebSocket Security](#websocket-security)
7. [Dependency Management](#dependency-management)
   - [Dependency Scanning](#dependency-scanning)
   - [Keeping Dependencies Updated](#keeping-dependencies-updated)
8. [Security Testing](#security-testing)
   - [Automated Security Testing](#automated-security-testing)
   - [Penetration Testing](#penetration-testing)
9. [Compliance](#compliance)
   - [PCI DSS Compliance](#pci-dss-compliance)
   - [GDPR Compliance](#gdpr-compliance)
10. [Incident Response](#incident-response)
11. [Conclusion](#conclusion)

## Introduction

Security is a critical aspect of our e-commerce application, as it handles sensitive user data, payment information, and personal details. Our security strategy follows a defense-in-depth approach, implementing multiple layers of security controls to protect against various threats and vulnerabilities.

## Authentication and Authorization

### Authentication Strategies

We implement a robust authentication system that supports multiple authentication methods while maintaining security best practices.

#### Password-Based Authentication

For password-based authentication, we follow these security practices:

```tsx
// src/services/authService.ts
import { api } from './api';
import { encryptData, decryptData } from '../utils/encryption';

export const authService = {
  async login(email: string, password: string) {
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      const { token, refreshToken, user } = response.data;
      
      // Store tokens securely
      localStorage.setItem('refreshToken', encryptData(refreshToken));
      sessionStorage.setItem('token', encryptData(token));
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  async logout() {
    try {
      await api.post('/auth/logout');
      
      // Clear tokens
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('token');
    } catch (error) {
      console.error('Logout error:', error);
      
      // Clear tokens even if API call fails
      localStorage.removeItem('refreshToken');
      sessionStorage.removeItem('token');
      
      throw error;
    }
  },
  
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await api.post('/auth/refresh', {
        refreshToken: decryptData(refreshToken),
      });
      
      const { token } = response.data;
      
      // Store new token
      sessionStorage.setItem('token', encryptData(token));
      
      return token;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error;
    }
  },
  
  isAuthenticated() {
    const token = sessionStorage.getItem('token');
    return !!token;
  },
};
```

#### OAuth and Social Login

We support OAuth 2.0 and social login options for a seamless authentication experience:

```tsx
// src/components/molecules/SocialLogin/SocialLogin.tsx
import React from 'react';
import { Button } from '../../atoms/Button';
import { api } from '../../../services/api';
import './SocialLogin.scss';

interface SocialLoginProps {
  onSuccess: (user: any) => void;
  onError: (error: Error) => void;
}

export const SocialLogin: React.FC<SocialLoginProps> = ({ onSuccess, onError }) => {
  const handleGoogleLogin = async () => {
    try {
      // Open OAuth popup
      const popup = window.open(
        `${process.env.REACT_APP_API_URL}/auth/google`,
        'Google Login',
        'width=500,height=600'
      );
      
      // Listen for messages from the popup
      window.addEventListener('message', async (event) => {
        if (event.origin !== process.env.REACT_APP_API_URL) {
          return;
        }
        
        if (event.data.type === 'AUTH_SUCCESS') {
          const { token, refreshToken, user } = event.data;
          
          // Store tokens securely
          localStorage.setItem('refreshToken', encryptData(refreshToken));
          sessionStorage.setItem('token', encryptData(token));
          
          onSuccess(user);
        } else if (event.data.type === 'AUTH_ERROR') {
          onError(new Error(event.data.message));
        }
      });
    } catch (error) {
      onError(error as Error);
    }
  };
  
  const handleFacebookLogin = async () => {
    // Similar implementation for Facebook login
  };
  
  const handleAppleLogin = async () => {
    // Similar implementation for Apple login
  };
  
  return (
    <div className="social-login">
      <Button
        onClick={handleGoogleLogin}
        variant="outline"
        className="social-login__button social-login__button--google"
      >
        <span className="social-login__icon">G</span>
        <span className="social-login__text">Continue with Google</span>
      </Button>
      
      <Button
        onClick={handleFacebookLogin}
        variant="outline"
        className="social-login__button social-login__button--facebook"
      >
        <span className="social-login__icon">f</span>
        <span className="social-login__text">Continue with Facebook</span>
      </Button>
      
      <Button
        onClick={handleAppleLogin}
        variant="outline"
        className="social-login__button social-login__button--apple"
      >
        <span className="social-login__icon">
          <svg viewBox="0 0 24 24" width="16" height="16">
            {/* Apple logo SVG */}
          </svg>
        </span>
        <span className="social-login__text">Continue with Apple</span>
      </Button>
    </div>
  );
};
```

### Multi-Factor Authentication

We implement multi-factor authentication (MFA) to add an extra layer of security:

```tsx
// src/components/organisms/MFASetup/MFASetup.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { api } from '../../../services/api';
import './MFASetup.scss';

interface MFASetupProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const MFASetup: React.FC<MFASetupProps> = ({ onComplete, onCancel }) => {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchMFASetupData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get('/auth/mfa/setup');
        setQrCode(response.data.qrCode);
        setSecret(response.data.secret);
      } catch (error) {
        setError('Failed to load MFA setup data');
        console.error('MFA setup error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMFASetupData();
  }, []);
  
  const handleVerify = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      await api.post('/auth/mfa/verify', {
        code: verificationCode,
        secret,
      });
      
      onComplete();
    } catch (error) {
      setError('Invalid verification code. Please try again.');
      console.error('MFA verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mfa-setup">
      <h2 className="mfa-setup__title">Set Up Two-Factor Authentication</h2>
      
      <div className="mfa-setup__steps">
        <div className="mfa-setup__step">
          <h3 className="mfa-setup__step-title">1. Scan QR Code</h3>
          <p className="mfa-setup__step-description">
            Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.).
          </p>
          
          {isLoading ? (
            <div className="mfa-setup__loading">Loading...</div>
          ) : qrCode ? (
            <div className="mfa-setup__qr-code">
              <img src={qrCode} alt="QR Code for MFA setup" />
            </div>
          ) : null}
          
          {secret && (
            <div className="mfa-setup__secret">
              <p>If you can't scan the QR code, enter this code manually:</p>
              <code>{secret}</code>
            </div>
          )}
        </div>
        
        <div className="mfa-setup__step">
          <h3 className="mfa-setup__step-title">2. Verify Code</h3>
          <p className="mfa-setup__step-description">
            Enter the 6-digit code from your authenticator app to verify setup.
          </p>
          
          <Input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="mfa-setup__input"
          />
          
          {error && <div className="mfa-setup__error">{error}</div>}
        </div>
      </div>
      
      <div className="mfa-setup__actions">
        <Button onClick={onCancel} variant="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleVerify}
          variant="primary"
          disabled={isLoading || verificationCode.length !== 6}
        >
          {isLoading ? 'Verifying...' : 'Verify & Enable'}
        </Button>
      </div>
    </div>
  );
};
```

### Authorization Framework

We implement a role-based access control (RBAC) system to manage user permissions:

```tsx
// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  email: string;
  name: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  hasPermission: () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Fetch user data
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear any invalid tokens
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const userData = await authService.login(email, password);
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };
  
  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const hasPermission = (permission: string) => {
    if (!user) return false;
    
    // Admin role has all permissions
    if (user.roles.includes('admin')) return true;
    
    // Check specific permissions based on roles
    const rolePermissions: Record<string, string[]> = {
      customer: ['view_orders', 'create_order', 'view_profile', 'edit_profile'],
      support: ['view_orders', 'update_order', 'view_customers'],
      manager: ['view_orders', 'update_order', 'view_customers', 'view_reports'],
    };
    
    return user.roles.some(role => 
      rolePermissions[role]?.includes(permission)
    );
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
```

#### Protected Routes

We implement protected routes to restrict access to certain pages based on authentication and authorization:

```tsx
// src/components/molecules/ProtectedRoute/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { LoadingSpinner } from '../../atoms/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
}) => {
  const { isAuthenticated, isLoading, hasPermission } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    // Redirect to login page with return URL
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(location.pathname)}`} replace />;
  }
  
  if (requiredPermission && !hasPermission(requiredPermission)) {
    // Redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }
  
  return <>{children}</>;
};
```

### Session Management

We implement secure session management to protect user sessions:

```tsx
// src/services/api.ts
import axios from 'axios';
import { authService } from './authService';
import { decryptData } from '../utils/encryption';

export const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${decryptData(token)}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh the token
        const newToken = await authService.refreshToken();
        
        // Update the request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        
        // Retry the request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        authService.logout();
        window.location.href = `/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
```

## Data Protection

### Sensitive Data Handling

We implement secure handling of sensitive data to protect user information:

```tsx
// src/utils/encryption.ts
import CryptoJS from 'crypto-js';

// Secret key for client-side encryption (not for highly sensitive data)
const SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'default-key';

export const encryptData = (data: string): string => {
  return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
};

export const decryptData = (encryptedData: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// Mask sensitive data for display
export const maskCreditCard = (cardNumber: string): string => {
  const lastFour = cardNumber.slice(-4);
  return `•••• •••• •••• ${lastFour}`;
};

export const maskEmail = (email: string): string => {
  const [username, domain] = email.split('@');
  const maskedUsername = username.charAt(0) + '•'.repeat(username.length - 2) + username.charAt(username.length - 1);
  return `${maskedUsername}@${domain}`;
};

export const maskPhone = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const lastFour = cleaned.slice(-4);
  return `•••• •••• ${lastFour}`;
};
```

### Data Encryption

We implement data encryption for sensitive information:

```tsx
// src/components/organisms/CheckoutForm/CheckoutForm.tsx
import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { api } from '../../../services/api';
import './CheckoutForm.scss';

interface CheckoutFormProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error: Error) => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  amount,
  onSuccess,
  onError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    const cardElement = elements.getElement(CardElement);
    
    if (!cardElement) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create payment intent on the server
      const { data: clientSecret } = await api.post('/payments/create-intent', {
        amount,
        currency: 'usd',
      });
      
      // Confirm payment with Stripe
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: (event.target as HTMLFormElement).name.value,
            email: (event.target as HTMLFormElement).email.value,
          },
        },
      });
      
      if (result.error) {
        setError(result.error.message || 'Payment failed');
        onError(new Error(result.error.message));
      } else if (result.paymentIntent?.status === 'succeeded') {
        onSuccess(result.paymentIntent.id);
      }
    } catch (error) {
      setError('An error occurred while processing your payment');
      onError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="checkout-form">
      <div className="checkout-form__field">
        <label htmlFor="name" className="checkout-form__label">
          Name on Card
        </label>
        <Input
          id="name"
          name="name"
          type="text"
          required
          className="checkout-form__input"
        />
      </div>
      
      <div className="checkout-form__field">
        <label htmlFor="email" className="checkout-form__label">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          className="checkout-form__input"
        />
      </div>
      
      <div className="checkout-form__field">
        <label htmlFor="card" className="checkout-form__label">
          Card Details
        </label>
        <div className="checkout-form__card-element">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>
      
      {error && <div className="checkout-form__error">{error}</div>}
      
      <Button
        type="submit"
        disabled={!stripe || isLoading}
        className="checkout-form__submit"
      >
        {isLoading ? 'Processing...' : `Pay $${(amount / 100).toFixed(2)}`}
      </Button>
    </form>
  );
};
```

### Payment Information Security

We implement secure payment processing using third-party payment processors:

```tsx
// src/components/organisms/PaymentProcessor/PaymentProcessor.tsx
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { CheckoutForm } from '../CheckoutForm/CheckoutForm';
import './PaymentProcessor.scss';

// Load Stripe outside of the component to avoid recreating it on each render
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY as string);

interface PaymentProcessorProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onError: (error: Error) => void;
}

export const PaymentProcessor: React.FC<PaymentProcessorProps> = ({
  amount,
  onSuccess,
  onError,
}) => {
  return (
    <div className="payment-processor">
      <Elements stripe={stripePromise}>
        <CheckoutForm
          amount={amount}
          onSuccess={onSuccess}
          onError={onError}
        />
      </Elements>
    </div>
  );
};
```

### Personal Data Protection

We implement measures to protect personal data in compliance with privacy regulations:

```tsx
// src/components/organisms/PrivacySettings/PrivacySettings.tsx
import React, { useState, useEffect } from 'react';
import { Switch } from '../../atoms/Switch';
import { Button } from '../../atoms/Button';
import { api } from '../../../services/api';
import './PrivacySettings.scss';

interface PrivacySettings {
  marketingEmails: boolean;
  shareDataWithPartners: boolean;
  storePaymentInfo: boolean;
  trackBehavior: boolean;
}

export const PrivacySettings: React.FC = () => {
  const [settings, setSettings] = useState<PrivacySettings>({
    marketingEmails: false,
    shareDataWithPartners: false,
    storePaymentInfo: false,
    trackBehavior: true,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPrivacySettings = async () => {
      try {
        const response = await api.get('/user/privacy-settings');
        setSettings(response.data);
      } catch (error) {
        setError('Failed to load privacy settings');
        console.error('Privacy settings error:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPrivacySettings();
  }, []);
  
  const handleChange = (setting: keyof PrivacySettings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    });
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      await api.put('/user/privacy-settings', settings);
      setSuccessMessage('Privacy settings updated successfully');
    } catch (error) {
      setError('Failed to update privacy settings');
      console.error('Privacy settings update error:', error);
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return <div className="privacy-settings__loading">Loading privacy settings...</div>;
  }
  
  return (
    <div className="privacy-settings">
      <h2 className="privacy-settings__title">Privacy Settings</h2>
      
      <div className="privacy-settings__section">
        <h3 className="privacy-settings__section-title">Communication Preferences</h3>
        
        <div className="privacy-settings__option">
          <div className="privacy-settings__option-info">
            <h4 className="privacy-settings__option-title">Marketing Emails</h4>
            <p className="privacy-settings__option-description">
              Receive emails about new products, promotions, and discounts.
            </p>
          </div>
          <Switch
            checked={settings.marketingEmails}
            onChange={() => handleChange('marketingEmails')}
            className="privacy-settings__switch"
          />
        </div>
      </div>
      
      <div className="privacy-settings__section">
        <h3 className="privacy-settings__section-title">Data Sharing</h3>
        
        <div className="privacy-settings__option">
          <div className="privacy-settings__option-info">
            <h4 className="privacy-settings__option-title">Share Data with Partners</h4>
            <p className="privacy-settings__option-description">
              Allow us to share your data with trusted partners for personalized offers.
            </p>
          </div>
          <Switch
            checked={settings.shareDataWithPartners}
            onChange={() => handleChange('shareDataWithPartners')}
            className="privacy-settings__switch"
          />
        </div>
      </div>
      
      <div className="privacy-settings__section">
        <h3 className="privacy-settings__section-title">Payment Information</h3>
        
        <div className="privacy-settings__option">
          <div className="privacy-settings__option-info">
            <h4 className="privacy-settings__option-title">Store Payment Information</h4>
            <p className="privacy-settings__option-description">
              Securely store your payment information for faster checkout.
            </p>
          </div>
          <Switch
            checked={settings.storePaymentInfo}
            onChange={() => handleChange('storePaymentInfo')}
            className="privacy-settings__switch"
          />
        </div>
      </div>
      
      <div className="privacy-settings__section">
        <h3 className="privacy-settings__section-title">Analytics</h3>
        
        <div className="privacy-settings__option">
          <div className="privacy-settings__option-info">
            <h4 className="privacy-settings__option-title">Track Behavior</h4>
            <p className="privacy-settings__option-description">
              Allow us to collect data about your browsing behavior to improve our services.
            </p>
          </div>
          <Switch
            checked={settings.trackBehavior}
            onChange={() => handleChange('trackBehavior')}
            className="privacy-settings__switch"
          />
        </div>
      </div>
      
      {error && <div className="privacy-settings__error">{error}</div>}
      {successMessage && <div className="privacy-settings__success">{successMessage}</div>}
      
      <div className="privacy-settings__actions">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="privacy-settings__save-button"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </div>
  );
};
```

## Frontend Security

### Cross-Site Scripting (XSS) Prevention

We implement measures to prevent XSS attacks:

```tsx
// src/utils/sanitize.ts
