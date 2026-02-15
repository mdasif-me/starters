# API Client

Universal API client for Next.js that works seamlessly in both Server and Client Components.

## Features

- ✅ **Dual Environment Support**: Automatically detects and adapts to server/client context
- ✅ **Server-Side Cookie/Header Forwarding**: Automatically forwards authentication from incoming requests
- ✅ **Next.js Fetch Compatibility**: Full support for cache options and revalidation tags
- ✅ **Type Safety**: Full TypeScript support with generic response types
- ✅ **Runtime Validation**: Optional Zod schema validation for responses
- ✅ **Custom Error Handling**: Structured `ApiError` class with detailed error information
- ✅ **Timeout & Cancellation**: Built-in timeout support with AbortController
- ✅ **File Upload Support**: Automatic FormData handling with proper Content-Type
- ✅ **Authentication Ready**: Extension points for JWT/session token integration

## Configuration

Set these environment variables in `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
API_TIMEOUT=10000
```

## Usage Examples

### Basic GET Request (Server Component)

```tsx
import { apiGet } from '@/shared/api/api-client';

interface User {
  id: string;
  name: string;
  email: string;
}

export default async function UsersPage() {
  // Automatic server-side cookie/header forwarding
  const users = await apiGet<User[]>('/users', {
    // Next.js cache options
    cache: 'no-store', // or 'force-cache'
    next: {
      revalidate: 3600, // Revalidate every hour
      tags: ['users'], // For on-demand revalidation
    },
  });

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
}
```

### POST Request (Client Component)

```tsx
'use client';

import { useState } from 'react';
import { apiPost, ApiError, isApiError } from '@/shared/api/api-client';

interface CreateUserRequest {
  name: string;
  email: string;
}

interface CreateUserResponse {
  id: string;
  name: string;
  email: string;
}

export default function CreateUserForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const data: CreateUserRequest = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    };

    try {
      const user = await apiPost<CreateUserResponse>('/users', data);
      console.log('Created user:', user);
      // Handle success
    } catch (err) {
      if (isApiError(err)) {
        setError(`${err.message} (Code: ${err.code})`);
        console.error('API Error:', err.statusCode, err.details);
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name='name' required />
      <input name='email' type='email' required />
      <button type='submit' disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
      {error && <p className='error'>{error}</p>}
    </form>
  );
}
```

### File Upload with FormData

```tsx
'use client';

import { useState } from 'react';
import { apiPost } from '@/shared/api/api-client';

interface UploadResponse {
  url: string;
  filename: string;
}

export default function FileUpload() {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'documents');

    try {
      // Content-Type is automatically handled for FormData
      const result = await apiPost<UploadResponse>('/upload', formData, {
        timeout: 60000, // 60s timeout for large files
      });

      console.log('Uploaded:', result.url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input type='file' onChange={handleUpload} disabled={uploading} />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
```

### Zod Validation

```tsx
import { z } from 'zod';
import { apiGet } from '@/shared/api/api-client';

// Define response schema
const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  createdAt: z.string().datetime(),
});

const UsersArraySchema = z.array(UserSchema);

type User = z.infer<typeof UserSchema>;

export default async function ValidatedUsersPage() {
  // Runtime validation with Zod
  const users = await apiGet<User[]>('/users', {
    validateResponse: UsersArraySchema,
  });

  // TypeScript knows users is User[] and Zod validates at runtime
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
}
```

### Custom Error Handling

```tsx
'use client';

import { apiGet, ApiError, isApiError } from '@/shared/api/api-client';

async function fetchData() {
  try {
    const data = await apiGet('/data');
    return data;
  } catch (error) {
    if (isApiError(error)) {
      // Structured error with full details
      console.error('API Error:', {
        message: error.message,
        statusCode: error.statusCode,
        code: error.code,
        details: error.details,
        url: error.url,
        method: error.method,
      });

      // Handle specific error codes
      switch (error.code) {
        case 'UNAUTHORIZED':
          // Redirect to login
          break;
        case 'NOT_FOUND':
          // Show 404 page
          break;
        default:
          // Generic error handling
          break;
      }
    } else {
      // Network or unexpected error
      console.error('Unexpected error:', error);
    }
  }
}
```

### Timeout and Cancellation

```tsx
'use client';

import { useEffect, useState } from 'react';
import { apiGet } from '@/shared/api/api-client';

export default function CancellableRequest() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchData() {
      try {
        const result = await apiGet('/slow-endpoint', {
          signal: controller.signal,
          timeout: 5000, // 5 second timeout
        });
        setData(result);
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          console.log('Request cancelled or timed out');
        }
      }
    }

    fetchData();

    // Cleanup: cancel request on unmount
    return () => {
      controller.abort();
    };
  }, []);

  return <div>{data ? JSON.stringify(data) : 'Loading...'}</div>;
}
```

### PUT and PATCH Requests

```tsx
import { apiPut, apiPatch } from '@/shared/api/api-client';

// Full update with PUT
async function updateUser(userId: string, data: User) {
  return apiPut<User>(`/users/${userId}`, data);
}

// Partial update with PATCH
async function updateUserEmail(userId: string, email: string) {
  return apiPatch<User>(`/users/${userId}`, { email });
}
```

### DELETE Request

```tsx
import { apiDelete } from '@/shared/api/api-client';

async function deleteUser(userId: string) {
  await apiDelete(`/users/${userId}`);
}
```

## Future Authentication Integration

The API client includes extension points for adding authentication. To integrate JWT or session-based auth:

### Server-Side (in `buildServerRequest`)

```typescript
// Add token from server-side storage
const token = await getServerSideToken(); // Your auth function
if (token && options.auth !== false) {
  headers.set('Authorization', `Bearer ${token}`);
}
```

### Client-Side (in `buildClientRequest`)

```typescript
// Add token from memory/state
import { authStore } from '@/shared/stores/auth';

const token = authStore.getToken();
if (token && options.auth !== false) {
  headers.set('Authorization', `Bearer ${token}`);
}
```

Create a separate `src/shared/api/auth.ts` module to manage token storage, refresh logic, and expiry handling.

## API Reference

### Functions

- **`apiRequest<TResponse>(endpoint, options)`** - Core request function
- **`apiGet<TResponse>(endpoint, options)`** - GET request
- **`apiPost<TResponse>(endpoint, body, options)`** - POST request
- **`apiPut<TResponse>(endpoint, body, options)`** - PUT request
- **`apiPatch<TResponse>(endpoint, body, options)`** - PATCH request
- **`apiDelete<TResponse>(endpoint, options)`** - DELETE request

### Types

- **`ApiFetchOptions`** - Extended fetch options with Next.js and custom fields
- **`ApiConfig`** - Configuration interface
- **`ApiError`** - Custom error class with structured error details

### Error Handling

- **`isApiError(error)`** - Type guard to check if error is an `ApiError`
- **`ApiError.fromResponse(response, url, method)`** - Factory method to create ApiError from Response

## Best Practices

1. **Use in Server Components when possible** - Direct data fetching without client-side overhead
2. **Set appropriate cache strategies** - Use `cache` and `next.revalidate` for optimal performance
3. **Validate critical responses with Zod** - Runtime type safety for untrusted data
4. **Handle errors gracefully** - Always wrap API calls in try-catch blocks
5. **Set reasonable timeouts** - Prevent hanging requests, especially for user-facing features
6. **Clean up requests in effects** - Use AbortController to cancel in-flight requests on unmount
7. **Use revalidation tags** - Enable on-demand revalidation with `revalidateTag()`

## Troubleshooting

### Cookies not forwarding on server

Ensure you're using the API in a Server Component or Server Action where Next.js request context is available.

### CORS errors on client

Set `credentials: 'include'` is handled automatically. Ensure your API server allows the origin and credentials.

### Timeout errors

Increase timeout for slow endpoints:

```typescript
await apiGet('/slow-endpoint', { timeout: 30000 }); // 30s
```

### Type validation failing

Check that your Zod schema matches the actual API response structure. Use `.passthrough()` for lenient matching:

```typescript
const Schema = z.object({ id: z.string() }).passthrough();
```
