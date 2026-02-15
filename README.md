This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Architecture Overview

This project uses **Vertical Slices + Layered Architecture**, which combines:

- **Vertical Slices**: Each feature is self-contained with its own layers
- **Layered Architecture**: Separation of concerns across UI, business logic, and data layers
- **Composition Pattern**: Container/Presentational component separation for reusability

## Folder Structure

```bash
src/
├── features/                    # Business domain features (vertical slices)
│   ├── auth/
│   │   ├── ui/                 # Presentational components (UI only)
│   │   │   ├── index.ts
│   │   │   └── ...
│   │   ├── api/                # API calls & endpoints
│   │   │   ├── index.ts
│   │   │   └── ...
│   │   ├── schema/             # Validation schemas, types
│   │   │   ├── index.ts
│   │   │   └── ...
│   │   ├── services/           # Business logic & hooks
│   │   │   ├── index.ts
│   │   │   └── ...
│   │   └── index.ts            # Public exports (barrel file)
│   │
│   └── products/
│       ├── ui/
│       ├── api/
│       ├── schema/
│       ├── services/
│       └── index.ts
│
├── shared/                      # Reusable, cross-cutting concerns
│   ├── ui/                      # Shared presentational components
│   │   ├── components/
│   │   │   ├── button.tsx
│   │   │   ├── checkbox.tsx
│   │   │   └── input.tsx
│   │   ├── container/
│   │   └── index.ts
│   ├── api/                     # Shared API client
│   │   ├── api-client.ts
│   │   └── README.md
│   ├── lib/                     # Utilities & helpers
│   │   ├── utils.ts
│   │   └── index.ts
│   └── utils/                   # Specific utilities
│       └── formatters.ts
│
app/                            # Next.js App Router (route handlers & pages)
├── (pages)/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   ├── test-client/
│   ├── test-server/
│   └── ...
└── ...

public/                         # Static assets
```

## Layer Responsibilities

### 🎨 **UI Layer** (`/ui`)

- Presentational components (no business logic)
- Pure, stateless, reusable components
- Only receive data via props
- Examples: `Button`, `Card`, `Input`, `Modal`

### 📡 **API Layer** (`/api`)

- API call functions & endpoints
- Request/response handling
- No business logic, just HTTP communication
- Uses shared `api-client.ts`

### 🔍 **Schema Layer** (`/schema`)

- Validation schemas (Zod, TypeScript interfaces)
- Type definitions for domain models
- Request/response contracts

### ⚙️ **Services Layer** (`/services`)

- Business logic & hooks (data fetching, state management)
- Orchestrates API calls with schemas
- Example: `useAuth()`, `useProducts()` hooks

## Feature Development Workflow

### Adding a New Feature

1. **Create feature directory** under `src/features/{feature-name}`
2. **Create layer subdirectories**: `ui/`, `api/`, `schema/`, `services/`
3. **Populate each layer**:

   ```typescript
   // schema/index.ts - Define types
   export interface User {
     id: string;
     name: string;
   }

   // api/index.ts - API calls
   export async function fetchUser(id: string) {
     return apiClient.get<User>(`/users/${id}`);
   }

   // services/index.ts - Business logic
   export function useUser(id: string) {
     const [user, setUser] = useState<User | null>(null);
     useEffect(() => {
       fetchUser(id).then(setUser);
     }, [id]);
     return user;
   }

   // ui/index.ts - UI components
   export function UserCard({ userId }: { userId: string }) {
     const user = useUser(userId);
     return user ? <div>{user.name}</div> : <div>Loading...</div>;
   }

   // index.ts - Public exports
   export { UserCard } from './ui';
   export { useUser } from './services';
   export type { User } from './schema';
   ```

4. **Export from feature** via `index.ts` (barrel file)
5. **Use in pages**: `import { UserCard } from '@/features/users'`

## Best Practices

✅ **DO**

- Keep UI components pure and stateless
- Put business logic in services/hooks
- Use barrel exports (`index.ts`) for clean imports
- Validate data with schemas
- Reuse shared components from `/shared/ui`

❌ **DON'T**

- Put business logic in UI components
- Import directly from subdirectories (use barrel exports)
- Create circular dependencies between features
- Duplicate UI components (add to `/shared/ui` instead)
- Mix API calls with component logic

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
API_TIMEOUT=10000
```

- **`NEXT_PUBLIC_API_BASE_URL`**: Base URL for external API calls (default: `http://localhost:3000/api`)
- **`API_TIMEOUT`**: Default timeout for API requests in milliseconds (default: `10000`)

### API Client

This project includes a universal API client located at `src/shared/api/api-client.ts` that works seamlessly in both Server and Client Components. See [src/shared/api/README.md](src/shared/api/README.md) for detailed usage examples and documentation.

Key features:

- Automatic server-side cookie/header forwarding
- Next.js fetch compatibility (cache, revalidation tags)
- TypeScript type safety with generic responses
- Zod schema validation support
- Custom error handling with `ApiError` class
- Timeout and cancellation support
- File upload with FormData

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
