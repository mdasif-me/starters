# PMS Admin - Property Management System Admin Panel

A modern, scalable admin panel built with React 18, TypeScript, and TanStack Router. This is a full-featured starter template for building property management system dashboards with authentication, data management, and real-time features.

**Version:** 1.0.0  
**Author:** Muhammad Asif  
**License:** MIT

## ✨ Features

- 🔐 **Authentication** - Clerk integration with role-based access control
- 🎨 **Modern UI** - shadcn/ui components with Tailwind CSS
- 📊 **Data Management** - TanStack Query for server state management
- 🗺️ **File-based Routing** - TanStack Router with automatic code generation
- 📁 **Feature-based Architecture** - Organized by feature modules
- 🧪 **Testing Ready** - Vitest integration
- 🔍 **Type Safe** - Full TypeScript support
- ✅ **Code Quality** - ESLint and Prettier configured
- 🌍 **Environment Variables** - T3Env for type-safe config

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

```bash
# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development

```bash
# Start development server (http://localhost:3000)
pnpm dev

# Watch mode with hot reload enabled
```

### Production Build

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📦 Project Structure

```
src/
├── assets/              # Static assets (icons, images)
├── components/          # Reusable UI components
│   └── ui/             # shadcn/ui component library
├── features/           # Feature modules (auth, projects, settings, etc.)
│   ├── auth/           # Authentication module
│   ├── index/          # Dashboard/Home module
│   ├── projects/       # Projects management module
│   ├── settings/       # Settings module
│   └── uploads/        # File uploads module
├── hooks/              # Custom React hooks
├── integrations/       # Third-party integrations
├── lib/                # Utility libraries and helpers
├── routes/             # File-based routing (TanStack Router)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── env.ts              # Environment variables config
├── main.tsx            # Application entry point
├── styles.css          # Global styles
└── routeTree.gen.ts    # Auto-generated route tree
```

## 🏗️ Feature Modules

Each feature is self-contained with its own structure:

### Auth Module (`src/features/auth/`)

- **Purpose:** User authentication and authorization
- **Files:**
  - `api.ts` - Clerk API integration
  - `hooks.ts` - Authentication hooks
  - `schemas.ts` - Zod validation schemas
  - `types.ts` - TypeScript types
  - `components/` - Auth-related components

### Index Module (`src/features/index/`)

- **Purpose:** Dashboard and home page
- **Files:**
  - `api.ts` - Dashboard data fetching
  - `hooks.ts` - Dashboard-specific hooks
  - `schema.ts` - Data schemas
  - `types.ts` - Type definitions

### Projects Module (`src/features/projects/`)

- **Purpose:** Project management functionality
- **Files:**
  - `api.ts` - Project CRUD operations
  - `hooks.ts` - Project-related hooks
  - `interface.ts` - Project interfaces

### Settings Module (`src/features/settings/`)

- **Purpose:** User and application settings

### Uploads Module (`src/features/uploads/`)

- **Purpose:** File upload handling and management

## 🛠️ Development Tools

### Code Quality

```bash
# Lint code with ESLint
pnpm lint

# Format code with Prettier
pnpm format

# Run both lint and format fixes
pnpm check
```

### Testing

```bash
# Run tests with Vitest
pnpm test
```

## 🔧 Configuration

### Environment Variables

Configure in `.env.local`:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_key_here

# Application
VITE_APP_TITLE=PMS Admin
VITE_API_BASE_URL=http://localhost:3001
```

Use in code:

```typescript
import { env } from '@/env'

console.log(env.VITE_CLERK_PUBLISHABLE_KEY)
```

### Tailwind CSS

Tailwind is configured for rapid UI development. Customize in `tailwind.config.ts` if needed.

### Component Library

Add new shadcn/ui components:

```bash
pnpm dlx shadcn@latest add component-name
# Example:
pnpm dlx shadcn@latest add button
```

## 🗺️ Routing

This project uses **TanStack Router** with file-based routing.

### How It Works

Routes are automatically generated from files in `src/routes/`:

- File: `src/routes/about.tsx` → Route: `/about`
- File: `src/routes/_authenticated/dashboard.tsx` → Protected route: `/dashboard`

### Adding Routes

1. Create a new file in `src/routes/` directory
2. Export a default component:

```tsx
// src/routes/new-page.tsx
export default function NewPage() {
  return <div>New Page</div>
}
```

3. Navigate using the Link component:

```tsx
import { Link } from '@tanstack/react-router'

export default function Navigation() {
  return <Link to="/new-page">Go to New Page</Link>
}
```

## 📚 Core Technologies

| Technology      | Version | Purpose                 |
| --------------- | ------- | ----------------------- |
| React           | 18+     | UI library              |
| TypeScript      | Latest  | Type safety             |
| TanStack Router | Latest  | File-based routing      |
| TanStack Query  | v5      | Server state management |
| Tailwind CSS    | v4      | Styling                 |
| shadcn/ui       | Latest  | Component library       |
| Clerk           | Latest  | Authentication          |
| Vitest          | Latest  | Testing framework       |
| ESLint          | Latest  | Code linting            |
| Prettier        | Latest  | Code formatting         |

## 🔐 Authentication (Clerk)

### Setup

1. Create a Clerk account at [clerk.com](https://clerk.com)
2. Get your Publishable Key
3. Add to `.env.local`:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_key
```

4. Protected routes use `_authenticated.tsx` layout

## 🎨 Component Development

### Creating New Components

Use shadcn/ui as base for consistency:

```tsx
// src/components/my-component.tsx
import { Button } from '@/components/ui/button'

export default function MyComponent() {
  return <Button>Click me</Button>
}
```

### UI Component Library

All components are in `src/components/ui/`. Use them throughout your features.

## 🚀 Deployment

### Build

```bash
pnpm build
```

Output will be in the `dist/` directory.

### Deployment Options

- **Vercel** (recommended for React apps)
- **Netlify**
- **Docker**
- **Traditional hosting** (Node.js server)

## 📖 Scripts Reference

| Script      | Command        | Purpose                  |
| ----------- | -------------- | ------------------------ |
| Development | `pnpm dev`     | Start dev server         |
| Build       | `pnpm build`   | Production build         |
| Preview     | `pnpm preview` | Preview production build |
| Test        | `pnpm test`    | Run Vitest               |
| Lint        | `pnpm lint`    | Check code quality       |
| Format      | `pnpm format`  | Format code              |
| Check       | `pnpm check`   | Lint + format            |

## 🤝 Contributing

When adding new features, follow this structure:

1. Create feature folder: `src/features/feature-name/`
2. Include:
   - `api.ts` - API calls
   - `hooks.ts` - Custom hooks
   - `types.ts` - TypeScript types
   - `schemas.ts` - Validation schemas
   - `components/` - Feature components
3. Export from `src/features/feature-name/index.ts`

## 📝 Coding Patterns

### API Layer (TanStack Query)

```typescript
// src/features/users/hooks.ts
import { useQuery } from '@tanstack/react-query'
import { api } from './api'

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```

### Type-Safe Components

```typescript
interface ComponentProps {
  title: string;
  onAction: () => void;
}

export default function Component({ title, onAction }: ComponentProps) {
  return <button onClick={onAction}>{title}</button>;
}
```

## 📚 Additional Resources

- [TanStack Router Documentation](https://tanstack.com/router)
- [TanStack Query Documentation](https://tanstack.com/query)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Clerk Documentation](https://clerk.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is already in use, you can specify a different port:

```bash
pnpm dev -- --port 3001
```

### Clear Dependencies

If you encounter dependency issues:

```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Type Errors

Make sure TypeScript is up to date:

```bash
pnpm add -D typescript@latest
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For issues and questions:

- 📧 Email: cn.mdasif@gmail.com
- 🌐 Website: https://muhammadasif.me/
- 📦 Repository: https://github.com/ZMC-Technologies-Limited/property-chain-panel-csr

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from '@tanstack/react-router'

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).

## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/people',
  loader: async () => {
    const response = await fetch('https://swapi.dev/api/people')
    return response.json() as Promise<{
      results: {
        name: string
      }[]
    }>
  },
  component: () => {
    const data = peopleRoute.useLoaderData()
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    )
  },
})
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ...

const queryClient = new QueryClient()

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  )
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
})
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from '@tanstack/react-query'

import './App.css'

function App() {
  const { data } = useQuery({
    queryKey: ['people'],
    queryFn: () =>
      fetch('https://swapi.dev/api/people')
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  })

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
pnpm add @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from '@tanstack/react-store'
import { Store } from '@tanstack/store'
import './App.css'

const countStore = new Store(0)

function App() {
  const count = useStore(countStore)
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  )
}

export default App
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from '@tanstack/react-store'
import { Store, Derived } from '@tanstack/store'
import './App.css'

const countStore = new Store(0)

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
})
doubledStore.mount()

function App() {
  const count = useStore(countStore)
  const doubledCount = useStore(doubledStore)

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  )
}

export default App
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
