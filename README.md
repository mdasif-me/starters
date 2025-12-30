# Next.js Enterprise Starter Kit

> Production-ready Next.js 16 application with JWT authentication, RBAC, and modern development practices.

[![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🌟 Features

- 🚀 **Next.js 16** with App Router and Turbopack
- 🔐 **JWT Authentication** with automatic token refresh
- 🛡️ **RBAC System** with role & permission-based access
- 🎨 **Tailwind CSS v4** with PostCSS plugin
- 📦 **Feature-Based Architecture** for scalability
- 🔄 **React Hook Form** with Zod validation
- 🎯 **Type-Safe API** client with Axios
- 🔧 **Proxy Middleware** for server-side protection
- 📱 **Responsive Design** components
- ⚡ **Production Ready** with error handling

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Authentication System](#-authentication-system)
- [Protecting Routes](#-protecting-routes)
- [Permission Management](#-permission-management)
- [API Integration](#-api-integration)
- [Development Guide](#-development-guide)
- [Deployment](#-deployment)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended)

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env.local

# Configure your API URL in .env.local
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:5000/v1
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY=604800

# Start development
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Available Routes

| Route        | Access    | Description       |
| ------------ | --------- | ----------------- |
| `/`          | Public    | Home page         |
| `/login`     | Public    | User login        |
| `/register`  | Public    | User registration |
| `/dashboard` | Protected | User dashboard    |

---

## 📁 Project Structure

```
src/
├── app/                           # Next.js App Router
│   ├── (public)/                  # Public routes group
│   │   ├── login/
│   │   └── register/
│   ├── (protected)/               # Protected routes group
│   │   ├── dashboard/
│   │   └── layout.tsx             # Auth check layout
│   ├── components/                # Shared components
│   ├── providers/                 # React providers
│   └── styles/                    # Global styles
│
├── lib/
│   ├── features/                  # Feature modules
│   │   └── auth/                  # Auth feature
│   │       ├── components/        # LoginForm
│   │       └── schemas/           # Validation
│   │
│   ├── auth/                      # Auth system
│   │   ├── constants/             # Routes, roles, permissions
│   │   ├── core/                  # Token management
│   │   ├── hooks/                 # useAuth, usePermissions
│   │   └── middleware/            # Route protection
│   │
│   ├── api/                       # API layer
│   │   ├── client/                # Axios setup
│   │   ├── endpoints/             # API endpoints
│   │   └── utils/                 # Utilities
│   │
│   └── utils/                     # Utilities
│       └── storage/               # Storage helpers
│
└── proxy.ts                       # Next.js 16 middleware
```

### Important Directories

| Directory          | Purpose                                           |
| ------------------ | ------------------------------------------------- |
| `lib/features/`    | Feature-based modules with components and schemas |
| `lib/auth/`        | Complete authentication & authorization system    |
| `lib/api/`         | API client and endpoint definitions               |
| `app/(protected)/` | Routes requiring authentication                   |
| `app/(public)/`    | Publicly accessible routes                        |

**📖 For detailed file documentation, see [DOCS.md](./DOCS.md)**

## 🔐 Authentication System

### How It Works

```
User Login → API Returns JWT → Store in Cookies →
Proxy Validates → Protected Route Access
```

### Required API Response Format

Your backend must return this structure:

```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUz...",
    "refresh_token": "eyJhbGciOiJIUz...",
    "expires_in": 3600,
    "user": {
      "id": "user-123",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  },
  "message": "Login successful",
  "success": true
}
```

### JWT Token Structure

Your JWT payload should include:

```json
{
  "id": "user-123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "permissions": ["product:view", "product:create"],
  "iat": 1704024000,
  "exp": 1704027600
}
```

### Customizing for Your API

If your API format differs, update `src/lib/api/endpoints/auth.ts`:

```typescript
export const authApi = {
  login: async (data: LoginRequest): Promise<ILoginResponse> => {
    const response = await apiClient.post('/auth/login', data);

    // Transform YOUR API response to match expected format
    return {
      access_token: response.data.token, // or your field name
      refresh_token: response.data.refresh, // or your field name
      expires_in: response.data.expiresIn,
      user: response.data.user,
    };
  },
};
```

## 🛡️ Protecting Routes

### Step 1: Register Route

Edit `src/lib/auth/constants/routes.ts`:

```typescript
export const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/products', // Add your route
  '/api/protected',
];
```

### Step 2: Create Page

```typescript
// src/app/(protected)/products/page.tsx
export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>
      <p>This page is automatically protected</p>
    </div>
  );
}
```

The proxy middleware handles authentication automatically.

### Admin-Only Routes

For admin-only sections:

1. **Register as admin route:**

```typescript
// src/lib/auth/constants/routes.ts
export const ADMIN_ROUTES = ['/admin', '/admin/users', '/admin/settings'];
```

2. **Create admin layout:**

```typescript
// src/app/(protected)/admin/layout.tsx
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }) {
  const headersList = await headers();
  const userRole = headersList.get('x-user-role');

  if (userRole !== 'admin' && userRole !== 'super_admin') {
    redirect('/unauthorized');
  }

  return <>{children}</>;
}
```

## 🔐 Permission Management

### Define Permissions

Edit `src/lib/auth/constants/permissions.ts`:

```typescript
export const PERMISSIONS = {
  USER: {
    VIEW: 'user:view',
    CREATE: 'user:create',
    EDIT: 'user:edit',
    DELETE: 'user:delete',
  },
  PRODUCT: {
    VIEW: 'product:view',
    CREATE: 'product:create',
    EDIT: 'product:edit',
    DELETE: 'product:delete',
  },
};
```

### Using Permissions in Components

#### Method 1: usePermissions Hook

```typescript
'use client';

import { usePermissions } from '@/lib/auth/hooks/use-permissions';
import { PERMISSIONS } from '@/lib/auth/constants/permissions';

export default function ProductsPage() {
  const { hasPermission } = usePermissions();

  return (
    <div>
      <h1>Products</h1>

      {hasPermission(PERMISSIONS.PRODUCT.CREATE) && (
        <button onClick={handleCreate}>Create Product</button>
      )}

      {hasPermission(PERMISSIONS.PRODUCT.EDIT) && (
        <button onClick={handleEdit}>Edit Product</button>
      )}

      {hasPermission(PERMISSIONS.PRODUCT.DELETE) && (
        <button onClick={handleDelete}>Delete Product</button>
      )}
    </div>
  );
}
```

#### Method 2: PermissionGuard Component

```typescript
'use client';

import { PermissionGuard } from '@/app/components/auth/auth-guard';
import { PERMISSIONS } from '@/lib/auth/constants/permissions';

export default function ProductsPage() {
  return (
    <div>
      <h1>Products</h1>

      <PermissionGuard
        permission={PERMISSIONS.PRODUCT.CREATE}
        fallback={<p>No create permission</p>}
      >
        <button onClick={handleCreate}>Create Product</button>
      </PermissionGuard>
    </div>
  );
}
```

#### Method 3: Multiple Permissions

```typescript
'use client';

import { useAuth } from '@/lib/auth/hooks/use-auth';

export default function ProductsPage() {
  const { hasAnyPermission, hasAllPermissions } = useAuth();

  return (
    <div>
      {/* Show if user has ANY of these */}
      {hasAnyPermission(['product:edit', 'product:delete']) && (
        <div>Management Section</div>
      )}

      {/* Show if user has ALL of these */}
      {hasAllPermissions(['product:view', 'product:export']) && (
        <button>Export Products</button>
      )}
    </div>
  );
}
```

### Role-Based Access

```typescript
'use client';

import { useAuth } from '@/lib/auth/hooks/use-auth';

export default function DashboardPage() {
  const { user, hasRole } = useAuth();

  return (
    <div>
      {hasRole('admin') && <div>Admin Dashboard</div>}

      {hasRole('manager') && <div>Manager Dashboard</div>}

      {user?.role === 'customer' && <div>Customer Dashboard</div>}
    </div>
  );
}
```

## 🌐 API Integration

### API Client Configuration

The API client is pre-configured in `src/lib/api/client/axios-client.ts`:

- Base URL from environment variable
- Automatic token attachment
- Token refresh on 401 errors
- Type-safe request methods
- Error handling

### Creating New Endpoints

```typescript
// src/lib/api/endpoints/products.ts
import { apiClient } from '../client/axios-client';

export interface Product {
  id: string;
  name: string;
  price: number;
}

export const productsApi = {
  getProducts: async () => {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  },

  createProduct: async (data: Partial<Product>) => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  updateProduct: async (id: string, data: Partial<Product>) => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id: string) => {
    await apiClient.delete(`/products/${id}`);
  },
};
```

### Using Endpoints in Components

```typescript
'use client';

import { productsApi } from '@/lib/api/endpoints/products';
import { useEffect, useState } from 'react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await productsApi.getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map((product) => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## 💻 Development Guide

### Adding a New Feature

1. **Create feature module:**

```
src/lib/features/products/
├── components/
│   └── product-form.tsx
├── schemas/
│   └── product.schema.ts
└── index.ts
```

2. **Define validation schema:**

```typescript
// src/lib/features/products/schemas/product.schema.ts
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  price: z.number().positive('Price must be positive'),
  description: z.string().optional(),
});

export type ProductForm = z.infer<typeof productSchema>;
```

3. **Create component:**

```typescript
// src/lib/features/products/components/product-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, type ProductForm } from '../schemas/product.schema';

export function ProductForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
  });

  const onSubmit = async (data: ProductForm) => {
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}

      <input type='number' {...register('price', { valueAsNumber: true })} />
      {errors.price && <span>{errors.price.message}</span>}

      <button type='submit'>Submit</button>
    </form>
  );
}
```

4. **Export from feature:**

```typescript
// src/lib/features/products/index.ts
export * from './components';
export * from './schemas';
```

5. **Use in page:**

```typescript
// src/app/(protected)/products/page.tsx
import { ProductForm } from '@/lib/features/products';

export default function ProductsPage() {
  return (
    <div>
      <h1>Add Product</h1>
      <ProductForm />
    </div>
  );
}
```

### Environment Variables

```env
# .env.local
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:5000/v1
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY=604800
```

### Available Commands

```bash
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

## 🚀 Deployment

### Production Build

```bash
# Build application
pnpm build

# Test production build locally
pnpm start
```

### Environment Setup

Create `.env.production`:

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://api.yourapp.com/v1
NEXT_PUBLIC_API_TIMEOUT=30000
NEXT_PUBLIC_REFRESH_TOKEN_EXPIRY=604800
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Deployment Checklist

- [ ] Update `NEXT_PUBLIC_API_URL` to production API
- [ ] Test all authentication flows
- [ ] Verify protected routes work
- [ ] Check permission-based UI
- [ ] Test token refresh mechanism
- [ ] Ensure cookies are set correctly
- [ ] Verify logout clears all data

## 🐛 Common Issues

### Issue: Login fails

**Solution:** Check API response format matches expected structure in `auth.ts`

### Issue: Routes not protected

**Solution:** Ensure route is registered in `src/lib/auth/constants/routes.ts`

### Issue: Permissions not working

**Solution:** Verify JWT includes `permissions` array in payload

### Issue: Token not refreshing

**Solution:** Check refresh token endpoint in `src/lib/api/client/interceptors.ts`

### Issue: Build fails

**Solution:** Run `pnpm build` to see TypeScript errors and fix type mismatches

---

## 📚 Additional Resources

- **[DOCS.md](./DOCS.md)** - Detailed documentation of every file
- **[Next.js Documentation](https://nextjs.org/docs)** - Framework docs
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Styling docs
- **[React Hook Form](https://react-hook-form.com/)** - Form handling
- **[Zod](https://zod.dev/)** - Schema validation

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 💬 Support

**Developer:** Muhammad Asif  
**Portfolio:** [muhammadasif.vercel.app](https://muhammadasif.vercel.app)

For issues or questions:

- Check [DOCS.md](./DOCS.md) for detailed file documentation
- Review common issues section above
- Contact via portfolio website

---

**Built with ❤️ using Next.js 16, TypeScript, and Tailwind CSS**
