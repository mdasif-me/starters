<div align="center">
  <h1>Cotap</h1>
  <p><strong>Modern Attendance Management System</strong></p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.2.3-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

  <p>
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#project-structure">Project Structure</a> •
    <a href="#development">Development</a> •
    <a href="#deployment">Deployment</a>
  </p>
</div>

---

## 📋 About

Cotap is a modern, scalable attendance management system built with Next.js 16 and React 19. It provides a comprehensive solution for tracking employee attendance, managing schedules, and generating reports with a clean, intuitive interface.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based authentication with session management
- 📊 **Real-time Dashboard** - Live attendance tracking and analytics
- 🛒 **Shopping Cart** - Product management with cart functionality
- 💳 **Checkout System** - Multi-step checkout with payment integration
- 📦 **Product Catalog** - Dynamic product listing with filtering and pagination
- 🎨 **Modern UI** - Built with shadcn/ui and Tailwind CSS v4
- 📱 **Responsive Design** - Mobile-first approach with fluid layouts
- ♿ **Accessibility** - WCAG 2.2 Level AA compliant
- 🚀 **Performance Optimized** - Server-side rendering and static generation
- 📝 **Type Safety** - Full TypeScript coverage with strict mode

## 🛠 Tech Stack

### Core Technologies

- **[Next.js 16.1.6](https://nextjs.org/)** - React framework with App Router
- **[React 19.2.3](https://reactjs.org/)** - UI library with Server Components
- **[TypeScript 5](https://www.typescriptlang.org/)** - Static type checking
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework

### UI & Components

- **[shadcn/ui](https://ui.shadcn.com/)** - Re-usable component library
- **[Radix UI](https://www.radix-ui.com/)** - Unstyled, accessible components
- **[class-variance-authority](https://cva.style/)** - Component variants
- **[Lucide React](https://lucide.dev/)** - Icon library

### Development Tools

- **[ESLint](https://eslint.org/)** - Code linting
- **[pnpm](https://pnpm.io/)** - Fast, disk space efficient package manager
- **[Turbopack](https://turbo.build/)** - Incremental bundler (Next.js 16)

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0 (recommended) or npm/yarn
- **Git** for version control

## 🚀 Getting Started

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/ZMC-Technologies-Limited/cotap.git
   cd cotap
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory:

   ```env
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
   API_TIMEOUT=10000

   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here

   # Database (if applicable)
   DATABASE_URL=your-database-url
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
pnpm build
pnpm start
```

## 📐 Project Structure

Cotap follows a **Vertical Slice Architecture** with feature-based organization. Each feature is self-contained with its own components, hooks, API calls, and types.

```
cotap/
├── app/                           # Next.js App Router
│   ├── (pages)/                   # Route grouping
│   │   ├── page.tsx              # Home page
│   │   ├── products/
│   │   │   └── page.tsx          # Products listing
│   │   ├── cart/
│   │   │   └── page.tsx          # Shopping cart
│   │   └── checkout/
│   │       └── page.tsx          # Checkout flow
│   ├── layout.tsx                # Root layout with Header/Footer
│   └── globals.css               # Global styles
│
├── src/
│   ├── features/                 # Feature modules (vertical slices)
│   │   ├── auth/                 # Authentication feature
│   │   │   ├── schema/           # Validation schemas
│   │   │   │   ├── validation.ts # Zod schemas + validation functions
│   │   │   │   └── index.ts      # Public schema exports
│   │   │   ├── components/       # Login/Register forms
│   │   │   ├── hooks/            # useAuth hook
│   │   │   ├── api/              # Auth API calls
│   │   │   ├── types/            # Auth types
│   │   │   └── index.ts          # Public exports
│   │   │
│   │   ├── cart/                 # Shopping cart feature
│   │   │   ├── components/       # CartView, CartItem
│   │   │   ├── hooks/            # useCart hook
│   │   │   ├── api/              # Cart CRUD operations
│   │   │   ├── types/            # Cart types
│   │   │   ├── utils/            # Cart helpers
│   │   │   └── index.ts
│   │   │
│   │   ├── checkout/             # Checkout feature
│   │   │   ├── schema/           # Validation schemas
│   │   │   │   ├── validation.ts # Address, Payment, Checkout schemas
│   │   │   │   └── index.ts      # Public schema exports
│   │   │   ├── components/       # Multi-step forms
│   │   │   ├── hooks/            # useCheckout hook
│   │   │   ├── api/              # Checkout API
│   │   │   ├── types/            # Order types
│   │   │   └── index.ts
│   │   │
│   │   └── products/             # Product catalog
│   │       ├── schema/           # Validation schemas
│   │       │   ├── validation.ts # Product filter schemas
│   │       │   └── index.ts      # Public schema exports
│   │       ├── components/       # ProductCard, ProductsView
│   │       ├── hooks/            # useProducts hook
│   │       ├── api/              # Product API with filters
│   │       ├── types/            # Product types
│   │       └── index.ts
│   │
│   └── shared/                   # Shared resources
│       ├── api/                  # Universal API client
│       │   ├── api-client.ts     # Fetch wrapper with SSR support
│       │   └── README.md         # API client documentation
│       │
│       ├── assets/               # Static assets
│       │   ├── icon/             # Icon exports
│       │   │   └── index.ts
│       │   ├── img/              # Image exports
│       │   │   ├── hero/         # Hero section images
│       │   │   └── index.ts
│       │
│       ├── layout/               # Layout components
│       │   ├── header/           # Site header with navigation
│       │   ├── footer/           # Site footer
│       │   ├── navigation/       # NavMenu, MobileMenu
│       │   └── index.ts
│       │
│       ├── ui/                   # Reusable UI components
│       │   ├── button/           # Button with variants
│       │   │   └── button.tsx
│       │   ├── card/             # Card components
│       │   │   └── card.tsx
│       │   ├── input/            # Input with addons
│       │   │   └── input.tsx
│       │   ├── checkbox/         # Checkbox component
│       │   │   └── checkbox.tsx
│       │   ├── container/        # Container wrapper
│       │   │   └── container.tsx
│       │   └── index.ts
│       │
│       ├── lib/                  # Utilities and helpers
│       │   ├── schemas.ts        # Shared Zod primitives (Email, Password, Name)
│       │   ├── formatters/       # Currency, date formatters
│       │   │   ├── currency.ts
│       │   │   ├── date.ts
│       │   │   └── index.ts
│       │   ├── constants/        # App constants
│       │   │   └── appConstants.ts
│       │   ├── utils.ts          # cn() utility
│       │   └── index.ts
│       │
│       └── hooks/                # Shared React hooks
│           ├── useDebounce.ts    # Debounce hook
│           ├── useLocalStorage.ts # localStorage hook
│           └── index.ts
│
├── public/                       # Static files
│   ├── images/                   # Public images
│   ├── favicon.ico
│   └── robots.txt
│
├── .env.local                    # Environment variables
├── components.json               # shadcn/ui configuration
├── next.config.ts                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── pnpm-workspace.yaml           # Workspace configuration
├── package.json                  # Project dependencies
└── pnpm-lock.yaml                # Lock file
```

## 🏗 Architecture Principles

### Vertical Slice Architecture

Each feature is self-contained and includes all necessary layers:

- **`schema/`** - Zod validation schemas and validation functions
- **`components/`** - UI components specific to the feature
- **`hooks/`** - Custom React hooks for state management
- **`api/`** - API integration and data fetching
- **`types/`** - TypeScript type definitions
- **`utils/`** (optional) - Feature-specific utilities and helpers
- **`index.ts`** - Barrel export for clean imports

### Validation Architecture

Validation schemas are organized by feature for better maintainability:

- **Shared Primitives** (`src/shared/lib/schemas.ts`)
  - `EmailSchema` - Email validation
  - `PasswordSchema` - Password validation with length constraints
  - `NameSchema` - Name validation
  - Utility functions: `formatZodErrors()`, `formatNestedZodErrors()`

- **Feature-Specific Schemas** (`src/features/{feature}/schema/validation.ts`)
  - Auth: `LoginSchema`, `RegisterSchema` + validation functions
  - Checkout: `ShippingAddressSchema`, `PaymentMethodSchema`, `CheckoutFormSchema` + validation functions
  - Products: `ProductFilterSchema`

All schemas use [Zod](https://zod.dev/) for type-safe runtime validation with full TypeScript inference.

#### 🎨 Components Layer

- Pure, presentational components
- Minimal business logic
- Receive data via props
- Emit events to parent components

#### 🪝 Hooks Layer

- State management and side effects
- Data fetching orchestration
- Business logic encapsulation
- Reusable stateful logic

#### 📡 API Layer

- HTTP communication
- Request/response handling
- Error handling
- API endpoint definitions

#### 📝 Types Layer

- TypeScript interfaces and types
- API contract definitions
- Domain models

#### 🛠 Utils Layer

- Pure utility functions
- Data transformations
- Feature-specific helpers (non-validation)

### Shared Resources

Shared code is organized under `src/shared/`:

- **`api/`** - Universal API client with SSR support
- **`ui/`** - Reusable UI components (Button, Input, Card, etc.)
- **`layout/`** - Layout components (Header, Footer, Navigation)
- **`hooks/`** - Shared React hooks (useDebounce, useLocalStorage)
- **`lib/`** - Utilities, formatters, constants, and shared Zod schemas
- **`assets/`** - Images, icons, and static files

## 💻 Development

### Available Scripts

```bash
# Development
pnpm dev          # Start development server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint
pnpm type-check   # Run TypeScript compiler check
```

### Adding a New Feature

1. **Create feature directory with schema**

   ```bash
   mkdir -p src/features/my-feature/{schema,components,hooks,api,types}
   ```

2. **Define Zod schemas** (`schema/validation.ts`)

   ```typescript
   import { z } from 'zod';
   import { EmailSchema } from '@/shared/lib/schemas';

   export const MyFormSchema = z.object({
     email: EmailSchema,
     name: z.string().min(1, 'Name is required'),
     title: z.string().optional(),
   });

   export type MyFormInput = z.infer<typeof MyFormSchema>;

   export function validateMyForm(data: unknown): Record<string, string> {
     const result = MyFormSchema.safeParse(data);
     if (!result.success) {
       return formatZodErrors(result.error);
     }
     return {};
   }
   ```

3. **Export from schema** (`schema/index.ts`)

   ```typescript
   export { MyFormSchema, validateMyForm } from './validation';

   export type { MyFormInput } from './validation';
   ```

4. **Define types** (`types/types.ts`)

   ```typescript
   export interface MyData {
     id: string;
     name: string;
   }
   ```

5. **Create API functions** (`api/api.ts`)

   ```typescript
   import { apiGet, apiPost } from '@/shared/api/api-client';
   import type { MyData } from '../types/types';
   import type { MyFormInput } from '../schema';

   export async function fetchMyData(): Promise<MyData[]> {
     return apiGet<MyData[]>('/api/my-data');
   }

   export async function submitMyForm(data: MyFormInput): Promise<MyData> {
     return apiPost<MyData>('/api/my-data', data);
   }
   ```

6. **Build custom hook** (`hooks/useMyData.ts`)

   ```typescript
   'use client';

   import { useEffect, useState } from 'react';
   import { fetchMyData, submitMyForm } from '../api/api';
   import { validateMyForm } from '../schema';
   import type { MyData } from '../types/types';
   import type { MyFormInput } from '../schema';

   export function useMyData() {
     const [data, setData] = useState<MyData[]>([]);
     const [loading, setLoading] = useState(true);

     useEffect(() => {
       fetchMyData()
         .then(setData)
         .finally(() => setLoading(false));
     }, []);

     const handleSubmit = async (formData: unknown) => {
       const errors = validateMyForm(formData);
       if (Object.keys(errors).length > 0) {
         return errors;
       }

       await submitMyForm(formData as MyFormInput);
       // Refresh data
       const updated = await fetchMyData();
       setData(updated);
       return {};
     };

     return { data, loading, handleSubmit };
   }
   ```

7. **Create components** (`components/view.tsx`)

   ```typescript
   'use client';

   import { useMyData } from '../hooks/useMyData';

   export function MyDataView() {
     const { data, loading } = useMyData();

     if (loading) return <div>Loading...</div>;

     return (
       <div>
         {data.map(item => (
           <div key={item.id}>{item.name}</div>
         ))}
       </div>
     );
   }
   ```

8. **Export from feature** (`index.ts`)

   ```typescript
   export { MyDataView } from './components/view';
   export { useMyData } from './hooks/useMyData';
   export type { MyData } from './types/types';
   export * from './schema';
   ```

9. **Use in pages** (`app/(pages)/my-feature/page.tsx`)

   ```typescript
   import { MyDataView } from '@/features/my-feature';

   export default function MyFeaturePage() {
     return <MyDataView />;
   }
   ```

### Code Style Guidelines

✅ **DO**

- Use TypeScript for all new code
- Follow the established folder structure
- Use barrel exports (`index.ts`) for clean imports
- Use Zod schemas for all form validation
- Put validation functions alongside schemas
- Mark client components with `'use client'` directive
- Use Server Components by default
- Keep components small and focused
- Write meaningful commit messages
- Add JSDoc comments for public APIs
- Use shared schema primitives (EmailSchema, PasswordSchema, NameSchema)

❌ **DON'T**

- Put business logic in components
- Import from nested paths (use barrel exports)
- Create circular dependencies
- Duplicate code (extract to shared utilities)
- Mix API calls with component rendering
- Commit `console.log()` statements
- Use `any` type in TypeScript
- Use manual regex validation instead of Zod schemas
- Duplicate validation logic across features

### Schema & Validation Usage

All forms and API requests use Zod schemas for type-safe validation:

**Using shared primitives:**

```typescript
import { EmailSchema, PasswordSchema, formatZodErrors } from '@/shared/lib';
import { z } from 'zod';

export const MyFormSchema = z
  .object({
    email: EmailSchema,
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type MyFormInput = z.infer<typeof MyFormSchema>;

export function validateMyForm(data: unknown): Record<string, string> {
  const result = MyFormSchema.safeParse(data);
  if (!result.success) {
    return formatZodErrors(result.error);
  }
  return {};
}
```

**Error handling:**

```typescript
import { formatZodErrors, formatNestedZodErrors } from '@/shared/lib';

// Flat errors (single-level forms like Login)
const loginErrors = formatZodErrors(error);
// Returns: { email: "Invalid email format", password: "..." }

// Nested errors (complex forms like Checkout)
const checkoutErrors = formatNestedZodErrors(error);
// Returns: {
//   shippingAddress: { fullName: "...", zipCode: "..." },
//   paymentMethod: "Invalid payment method"
// }
```

### API Client Usage

The shared API client (`src/shared/api/api-client.ts`) provides a universal interface for both Server and Client Components:

```typescript
import { apiGet, apiPost, apiPut, apiDelete } from '@/shared/api/api-client';

// GET request
const users = await apiGet<User[]>('/api/users');

// POST request
const newUser = await apiPost<User>('/api/users', { name: 'John' });

// With Next.js cache options
const products = await apiGet<Product[]>('/api/products', {
  next: { revalidate: 3600 },
});
```

See [src/shared/api/README.md](src/shared/api/README.md) for complete documentation.

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## 🌍 Environment Variables

### Required Variables

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
API_TIMEOUT=10000
```

### Optional Variables

```env
# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/cotap

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Feature Flags
NEXT_PUBLIC_ENABLE_CHECKOUT=true
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Configure environment variables
4. Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/ZMC-Technologies-Limited/cotap)

### Docker

```bash
# Build image
docker build -t cotap .

# Run container
docker run -p 3000:3000 cotap
```

### Manual Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 📚 Additional Documentation

- [API Client Documentation](src/shared/api/README.md)
- [Component Library](src/shared/ui/README.md)
- [Feature Development Guide](docs/FEATURES.md)
- [Contributing Guidelines](CONTRIBUTING.md)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Muhammad Asif** - _Initial work_ - [@muhammadasif](https://github.com/muhammadasif)
  - Email: cn.mdasif@gmail.com
  - Website: [muhammadasif.me](https://muhammadasif.me/)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Vercel](https://vercel.com/) - Deployment platform
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework

## 📞 Support

For support, email cn.mdasif@gmail.com or open an issue in the [GitHub repository](https://github.com/ZMC-Technologies-Limited/cotap/issues).

---

<div align="center">
  <p>Made with ❤️ by Muhammad Asif</p>
  <p>
    <a href="https://github.com/ZMC-Technologies-Limited/cotap">GitHub</a> •
    <a href="https://muhammadasif.me">Website</a>
  </p>
</div>
