# Complete Project Documentation

> Comprehensive guide explaining every file, its purpose, and how it fits into the application architecture.

## Table of Contents

- [Core Files](#core-files)
- [Authentication System](#authentication-system)
- [API Layer](#api-layer)
- [Feature Modules](#feature-modules)
- [Application Structure](#application-structure)
- [Utility Files](#utility-files)

---

## Core Files

### `src/proxy.ts`

**Purpose:** Next.js 16 middleware replacement for server-side request processing

**Why needed:**

- Intercepts every HTTP request before reaching pages
- Validates JWT tokens server-side
- Redirects unauthenticated users
- Adds user context to request headers
- Protects routes based on authentication status

**How it works:**

```typescript
// Every request flows through this file
User Request → proxy.ts → AuthMiddleware → Page Component
```

**When to modify:**

- Adding global request logging
- Implementing rate limiting
- Adding custom security headers
- Changing middleware config patterns

---

## Authentication System

### `src/lib/auth/core/token-manager.ts`

**Purpose:** Centralized JWT token management system

**Why needed:**

- Single source of truth for token operations
- Handles token storage across cookies, secure storage, and memory
- Prevents token duplication issues
- Provides token expiry checking
- Decodes JWT payloads securely

**Key responsibilities:**

- `setTokens()` - Store access & refresh tokens
- `getAccessToken()` - Retrieve current valid token
- `getRefreshToken()` - Get refresh token for renewal
- `clearTokens()` - Logout cleanup
- `decodeToken()` - Extract user data from JWT
- `isTokenExpired()` - Check token validity

**When to modify:**

- Your JWT structure is different
- Custom token storage requirements
- Different expiry buffer time
- Additional token metadata needed

---

### `src/lib/auth/core/session-validator.ts`

**Purpose:** Validates active user sessions

**Why needed:**

- Ensures session hasn't been terminated server-side
- Checks token blacklist status
- Validates session integrity
- Prevents session hijacking

**When to modify:**

- Implementing session limits
- Adding device tracking
- Custom session rules

---

### `src/lib/auth/middleware/auth-middleware.ts`

**Purpose:** Route-level authentication and authorization logic

**Why needed:**

- Decides which routes need authentication
- Validates tokens on protected routes
- Redirects based on user role
- Adds user info to request headers for pages

**Key methods:**

- `handle()` - Main request processor
- `isPublicRoute()` - Check if route needs auth
- `isProtectedRoute()` - Check protected status
- `isAdminRoute()` - Check admin requirement
- `matchRoute()` - Pattern matching for dynamic routes

**When to modify:**

- Adding new route patterns
- Custom authorization logic
- Different role hierarchies

---

### `src/lib/auth/hooks/use-auth.ts`

**Purpose:** React hook for authentication operations

**Why needed:**

- Provides auth state to components
- Handles login/logout operations
- Manages user session lifecycle
- Offers permission checking utilities

**Returns:**

```typescript
{
  user, // Current user object
    isLoading, // Loading state
    isAuthenticated, // Boolean auth status
    login(), // Login function
    logout(), // Logout function
    refreshUser(), // Reload user data
    hasPermission(), // Check single permission
    hasRole(), // Check user role
    hasAnyPermission(), // Check any of permissions
    hasAllPermissions(); // Check all permissions
}
```

**When to modify:**

- Custom login flow
- Additional user actions
- Different default routes

---

### `src/lib/auth/hooks/use-permissions.ts`

**Purpose:** Simplified permission checking hook

**Why needed:**

- Cleaner permission checks in components
- Standardized action-based permissions
- Reduces boilerplate code
- Type-safe permission names

**Provides:**

```typescript
{
  hasPermission(), // Generic permission check
    canView(), // resource:view
    canCreate(), // resource:create
    canEdit(), // resource:edit
    canDelete(), // resource:delete
    canExport(), // resource:export
    canManage(); // resource:manage
}
```

**When to modify:**

- Adding new standard actions
- Custom permission formats

---

### `src/lib/auth/hooks/use-roles.ts`

**Purpose:** Role-specific checks and utilities

**Why needed:**

- Simplifies role-based UI logic
- Provides role comparison functions
- Handles role hierarchies

**When to modify:**

- Complex role hierarchies
- Role inheritance systems

---

### `src/lib/auth/constants/routes.ts`

**Purpose:** Centralized route definitions

**Why needed:**

- Single source for all route patterns
- Easy route management
- Used by middleware for access control
- Prevents route duplication

**Exports:**

```typescript
PUBLIC_ROUTES; // No auth needed
PROTECTED_ROUTES; // Auth required
ADMIN_ROUTES; // Admin only
DYNAMIC_ROUTES; // Pattern-based routes
```

**When to modify:**

- **Every time** you add a new protected route
- Changing route access levels

---

### `src/lib/auth/constants/permissions.ts`

**Purpose:** Permission constant definitions

**Why needed:**

- Prevents typos in permission strings
- Autocomplete in IDEs
- Easy permission refactoring
- Documentation of available permissions

**Structure:**

```typescript
PERMISSIONS = {
  USER: {
    VIEW: 'user:view',
    CREATE: 'user:create',
    // ...
  },
  PRODUCT: {
    // ...
  },
};
```

**When to modify:**

- Adding new features with permissions
- Restructuring permission naming

---

### `src/lib/auth/constants/roles.ts`

**Purpose:** Role definitions and hierarchies

**Why needed:**

- Standardized role names
- Role-to-permission mappings
- Role hierarchy definitions

**When to modify:**

- Adding new user roles
- Changing role permissions

---

## API Layer

### `src/lib/api/client/axios-client.ts`

**Purpose:** Configured Axios instance with interceptors

**Why needed:**

- Single HTTP client for all API calls
- Automatic token attachment
- Request/response transformation
- Error handling standardization
- Request caching capability

**Features:**

- Base URL configuration
- Timeout settings
- Credential handling
- Interceptor setup
- Type-safe methods (get, post, put, delete, patch)

**When to modify:**

- Changing API base URL
- Custom request headers
- Different timeout values
- Adding request/response transformers

---

### `src/lib/api/client/interceptors.ts`

**Purpose:** Request and response interceptor logic

**Why needed:**

- Automatically adds auth tokens to requests
- Handles token refresh on 401 errors
- Transforms error responses
- Adds client metadata
- Prevents multiple simultaneous refresh attempts

**Key classes:**

- `RequestInterceptor` - Modifies outgoing requests
- `ResponseInterceptor` - Handles incoming responses

**When to modify:**

- Custom error handling
- Different token refresh logic
- Additional request metadata
- Response data transformation

---

### `src/lib/api/client/types.ts`

**Purpose:** TypeScript interfaces for API responses

**Why needed:**

- Type safety for API calls
- IntelliSense support
- Catch type errors at compile time
- Documentation of API contracts

**Key types:**

```typescript
IApiResponse<T>; // Standard API response wrapper
IPaginatedResponse<T>; // Paginated data
IApiError; // Error structure
IRequestConfig; // Request options
ICacheConfig; // Caching configuration
```

**When to modify:**

- Your API has different response structure
- Additional response metadata
- Custom error formats

---

### `src/lib/api/endpoints/auth.ts`

**Purpose:** Authentication API endpoint definitions

**Why needed:**

- Centralized auth API calls
- Type-safe request/response
- Validation before sending
- Consistent error handling

**Endpoints:**

- `login()` - User authentication
- `register()` - User registration
- `logout()` - Session termination
- `refreshToken()` - Token renewal
- `forgotPassword()` - Password reset request
- `resetPassword()` - Password reset completion
- `verifyEmail()` - Email verification

**When to modify:**

- **Critical:** Adapt to your backend API format
- Different endpoint URLs
- Additional auth methods

---

### `src/lib/api/endpoints/users.ts`

**Purpose:** User management API endpoints

**Why needed:**

- CRUD operations for users
- Profile management
- Type-safe user data

**Endpoints:**

- `getUsers()` - List users with pagination
- `getUserById()` - Fetch single user
- `updateUser()` - Update user data
- `deleteUser()` - Remove user
- `getProfile()` - Current user profile
- `updateProfile()` - Update own profile

**When to modify:**

- Adding user-related endpoints
- Custom user fields

---

### `src/lib/api/utils/cache-manager.ts`

**Purpose:** Request caching system

**Why needed:**

- Reduces unnecessary API calls
- Improves performance
- Implements cache invalidation
- TTL (time-to-live) support

**When to modify:**

- Custom caching strategies
- Different TTL values
- Cache size limits

---

### `src/lib/api/utils/error-handler.ts`

**Purpose:** Centralized error handling

**Why needed:**

- Consistent error formatting
- User-friendly error messages
- Error logging
- Error recovery strategies

**When to modify:**

- Custom error types
- Different error display
- Error tracking integration (Sentry, etc.)

---

## Feature Modules

### `src/lib/features/auth/components/login-form.tsx`

**Purpose:** Reusable login form component

**Why needed:**

- Separates form logic from page layout
- Reusable across multiple pages
- Handles form validation
- Manages form state with React Hook Form
- Can be used in modal, page, or embedded

**Features:**

- Zod schema validation
- Loading states
- Error handling
- Remember me functionality

**When to modify:**

- Adding social login buttons
- Custom form fields
- Different validation rules

---

### `src/lib/features/auth/schemas/login.schema.ts`

**Purpose:** Login form validation schema

**Why needed:**

- Type-safe form validation
- Consistent validation rules
- Automatic error messages
- Shared between frontend/backend

**When to modify:**

- Additional login fields
- Different validation rules

---

### `src/lib/features/auth/schemas/register.schema.ts`

**Purpose:** Registration form validation

**Why needed:**

- Enforces registration requirements
- Password strength rules
- Email format validation

**When to modify:**

- Additional registration fields
- Custom validation logic

---

### `src/lib/features/auth/schemas/password.schema.ts`

**Purpose:** Password-related validation schemas

**Why needed:**

- Password change validation
- Password reset validation
- Consistent password rules

**When to modify:**

- Password complexity requirements
- Custom password rules

---

### `src/lib/features/auth/schemas/profile.schema.ts`

**Purpose:** User profile validation

**Why needed:**

- Profile update validation
- Field-level rules

**When to modify:**

- Adding profile fields
- Custom profile requirements

---

## Application Structure

### `src/app/(public)/login/page.tsx`

**Purpose:** Login page component

**Why needed:**

- Entry point for user authentication
- Handles page layout and metadata
- Server component for SEO
- Uses LoginForm feature component

**Responsibilities:**

- Page layout and structure
- SEO metadata
- Navigation links
- Form component integration

**When to modify:**

- Changing page layout
- Adding marketing content
- Custom branding

---

### `src/app/(protected)/dashboard/page.tsx`

**Purpose:** Protected dashboard page

**Why needed:**

- Main landing after login
- Demonstrates auth protection
- Uses PermissionGuard for UI
- Server-side rendering with auth

**When to modify:**

- Dashboard content
- Permission-based sections
- Data fetching

---

### `src/app/(protected)/layout.tsx`

**Purpose:** Layout for protected routes

**Why needed:**

- Ensures authentication before rendering
- Provides user context to child routes
- Common UI elements (navigation, footer)
- Error boundary wrapping

**Features:**

- Server-side auth check
- Automatic redirect if not authenticated
- User data injection
- Shared layout components

**When to modify:**

- Navigation structure
- Common UI elements
- User menu

---

### `src/app/components/auth/auth-guard.tsx`

**Purpose:** Client-side authentication guard

**Why needed:**

- Prevents unauthorized access to components
- Shows loading states
- Provides fallback UI
- Works with useAuth hook

**When to modify:**

- Custom loading UI
- Different redirect logic

---

### `src/app/components/auth/permission-boundary.tsx`

**Purpose:** Permission-based component visibility

**Why needed:**

- Hides UI for unauthorized users
- Resource-action permission model
- Fallback content support

**When to modify:**

- Custom permission logic
- Different permission formats

---

### `src/app/providers/auth-provider.tsx`

**Purpose:** Authentication context provider

**Why needed:**

- Makes auth state available to all components
- Prevents prop drilling
- Centralized auth state management

**When to modify:**

- Additional auth context
- Custom provider logic

---

## Utility Files

### `src/lib/utils/storage/cookie-storage.ts`

**Purpose:** Cookie management utility

**Why needed:**

- Read/write cookies from client-side
- Type-safe cookie operations
- Handles cookie options (expiry, domain, etc.)

**When to modify:**

- Custom cookie settings
- Different cookie domains

---

### `src/lib/utils/storage/local-storage.ts`

**Purpose:** LocalStorage wrapper with error handling

**Why needed:**

- Safe localStorage access
- Handles quota exceeded errors
- JSON serialization
- SSR-safe (checks window)

**When to modify:**

- Storage quota management
- Custom serialization

---

### `src/lib/utils/storage/secure-storage.ts`

**Purpose:** Encrypted storage for sensitive data

**Why needed:**

- Stores tokens securely
- Encryption/decryption layer
- Fallback for cookie storage

**When to modify:**

- Different encryption methods
- Custom storage backend

---

## Configuration Files

### `next.config.ts`

**Purpose:** Next.js configuration

**Why needed:**

- Framework settings
- Build optimization
- Environment variables
- Experimental features

**When to modify:**

- Adding custom webpack config
- Image domains
- Redirects/rewrites

---

### `tailwind.config.ts`

**Purpose:** Tailwind CSS configuration

**Why needed:**

- Custom design tokens
- Theme configuration
- Plugin setup

**When to modify:**

- Brand colors
- Custom utilities
- Responsive breakpoints

---

### `tsconfig.json`

**Purpose:** TypeScript compiler configuration

**Why needed:**

- Type checking rules
- Path aliases (@/lib, @/app)
- Compiler options

**When to modify:**

- Adding path aliases
- Strict mode settings

---

### `.env.local`

**Purpose:** Environment variables

**Why needed:**

- API URL configuration
- Feature flags
- Sensitive credentials

**Variables:**

```env
NEXT_PUBLIC_API_URL           # Backend API base URL
NEXT_PUBLIC_API_TIMEOUT       # Request timeout
NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY  # Token expiry
```

**When to modify:**

- Different environments (dev/staging/prod)
- Additional API endpoints

---

## Adding New Features

### Example: Adding a Products Feature

1. **Create feature structure:**

```
src/lib/features/products/
├── components/
│   └── product-form.tsx
├── schemas/
│   └── product.schema.ts
└── index.ts
```

2. **Add API endpoints:**

```typescript
// src/lib/api/endpoints/products.ts
export const productsApi = {
  getProducts: async () => { ... },
  createProduct: async (data) => { ... }
}
```

3. **Define permissions:**

```typescript
// src/lib/auth/constants/permissions.ts
PRODUCT: {
  VIEW: 'product:view',
  CREATE: 'product:create'
}
```

4. **Register routes:**

```typescript
// src/lib/auth/constants/routes.ts
PROTECTED_ROUTES = [...existing, '/products'];
```

5. **Create page:**

```typescript
// src/app/(protected)/products/page.tsx
export default function ProductsPage() {
  // Use permissions and components
}
```

---

## File Dependency Map

```
User Request
    ↓
proxy.ts (validates request)
    ↓
auth-middleware.ts (checks auth)
    ↓
token-manager.ts (validates JWT)
    ↓
page.tsx (renders with user context)
    ↓
useAuth() hook (provides auth state)
    ↓
API endpoints (fetch data)
    ↓
axios-client.ts (makes request)
    ↓
interceptors.ts (adds token)
```

---

## Best Practices

1. **Always use constants** - Never hardcode permission strings
2. **Update routes.ts** - When adding protected routes
3. **Type everything** - Use TypeScript interfaces
4. **Validate forms** - Use Zod schemas
5. **Check permissions** - Both client and server side
6. **Handle errors** - Provide user-friendly messages
7. **Test roles** - Create test users with different permissions

---

## Troubleshooting Guide

| Issue                  | Likely Cause            | Fix Location                     |
| ---------------------- | ----------------------- | -------------------------------- |
| Login fails            | API format mismatch     | `lib/api/endpoints/auth.ts`      |
| Token not saved        | Cookie settings         | `lib/auth/core/token-manager.ts` |
| Route not protected    | Missing from routes     | `lib/auth/constants/routes.ts`   |
| Permission check fails | JWT missing permissions | `lib/auth/core/token-manager.ts` |
| Build errors           | Type mismatch           | Check interfaces in `types.ts`   |

---

**This documentation covers every major file in the project. Refer to this guide when:**

- Understanding file purposes
- Making modifications
- Adding new features
- Debugging issues
- Onboarding new developers
