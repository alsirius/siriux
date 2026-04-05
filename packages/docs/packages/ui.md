# @siriux/ui

Modern React components built for SaaS applications with authentication context.

## 🚀 Installation

```bash
npm install @siriux/ui
```

## 📋 Peer Dependencies

```bash
npm install react react-dom
```

## 🎨 Components

### Authentication Components

#### LoginForm
Complete login form with validation and error handling.

```typescript
import { LoginForm } from '@siriux/ui';

function LoginPage() {
  return (
    <LoginForm 
      onSuccess={(user, tokens) => {
        console.log('Logged in:', user);
      }}
      onError={(error) => {
        console.error('Login error:', error);
      }}
    />
  );
}
```

#### RegisterForm
User registration form (placeholder - to be implemented).

```typescript
import { RegisterForm } from '@siriux/ui';

function RegisterPage() {
  return (
    <RegisterForm 
      onSuccess={(user) => {
        console.log('Registered:', user);
      }}
    />
  );
}
```

#### ForgotPasswordForm
Password reset form (placeholder - to be implemented).

```typescript
import { ForgotPasswordForm } from '@siriux/ui';

function ForgotPasswordPage() {
  return (
    <ForgotPasswordForm 
      onSuccess={() => {
        console.log('Reset email sent');
      }}
    />
  );
}
```

## 🔐 Authentication Context

### AuthProvider
Wraps your app with authentication state management.

```typescript
import { AuthProvider } from '@siriux/ui';

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}
```

### useAuth Hook
Access authentication state and methods.

```typescript
import { useAuth } from '@siriux/ui';

function ProfilePage() {
  const { user, isAuthenticated, login, logout, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🔧 Authentication Methods

### login(email, password)
Authenticate user with email and password.

```typescript
const { login } = useAuth();

const handleLogin = async () => {
  try {
    await login('user@example.com', 'password123');
    // User is now authenticated
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### logout()
Clear authentication state and tokens.

```typescript
const { logout } = useAuth();

const handleLogout = () => {
  logout();
  // User is now logged out
};
```

### register(userData)
Register new user account.

```typescript
const { register } = useAuth();

const handleRegister = async () => {
  try {
    await register({
      email: 'newuser@example.com',
      password: 'password123',
      firstName: 'John',
      lastName: 'Doe'
    });
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

## 🎯 Complete Example

```typescript
import React from 'react';
import { AuthProvider, useAuth, LoginForm } from '@siriux/ui';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/protected" element={<ProtectedPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function LoginPage() {
  const { login } = useAuth();

  return (
    <div>
      <h1>Login</h1>
      <LoginForm 
        onSuccess={(user, tokens) => {
          // Navigate to protected page
          window.location.href = '/protected';
        }}
      />
    </div>
  );
}

function ProtectedPage() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please <a href="/login">login</a></div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <p>You are authenticated!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🎨 Styling

Components use Tailwind CSS classes and are fully customizable. The components include:

- 📱 Responsive design
- 🌙 Dark mode support
- ♿ Accessibility features
- 🎨 Consistent design system

## 🔧 API Reference

### Components

#### LoginForm Props
```typescript
interface LoginFormProps {
  onSuccess?: (user: AuthenticatedUser, tokens: AuthTokens) => void;
  onError?: (error: string) => void;
  className?: string;
}
```

#### AuthProvider Props
```typescript
interface AuthProviderProps {
  children: React.ReactNode;
  apiBaseUrl?: string;
  tokenStorage?: 'localStorage' | 'sessionStorage';
}
```

### Hooks

#### useAuth Returns
```typescript
interface AuthState {
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  refreshToken: () => Promise<void>;
}
```

### Types

#### AuthenticatedUser
```typescript
interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
```

#### AuthTokens
```typescript
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
```

## 🔗 Integration with Backend

The UI components expect standard REST API endpoints:

```typescript
// POST /api/auth/login
{
  email: string;
  password: string;
}

// Response
{
  success: boolean;
  user: AuthenticatedUser;
  tokens: AuthTokens;
}

// POST /api/auth/register
{
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

// POST /api/auth/refresh
{
  refreshToken: string;
}
```

## 🚨 Security Notes

- Tokens are stored in localStorage by default
- Always use HTTPS in production
- Implement CSRF protection
- Validate input on both client and server
- Use appropriate token expiry times
