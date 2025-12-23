# Route-Level Authentication

Implemented `beforeLoad`-based authentication for middleware-like behavior — no UI flicker, no AuthGuard component needed for page protection.

## Route Structure

```
routes/
├── __root.tsx          # Minimal root (just Outlet + devtools)
├── auth.tsx            # Auth layout (no sidebar, beforeLoad redirects logged-in users)
├── auth/
│   ├── login/index.tsx
│   └── signup/index.tsx
├── _authenticated.tsx  # Protected layout (sidebar + beforeLoad auth check)
├── _authenticated/
│   ├── index.tsx       # Dashboard (/)
│   ├── projects/
│   ├── sales/
│   └── ...             # All protected routes
└── 403.tsx             # Forbidden page
```

## How It Works

```
User visits /              User visits /auth/login
       ↓                           ↓
_authenticated.beforeLoad    auth.beforeLoad
       ↓                           ↓
   getUser()                   getUser()
       ↓                           ↓
  null? → redirect         exists? → redirect
   to /auth/login              to /
       ↓                           ↓
  COMPONENT NEVER           COMPONENT NEVER
    RENDERS                   RENDERS
```

## Usage

For **page-level** auth (recommended):

```tsx
// In route file - use beforeLoad
export const Route = createFileRoute('/admin')({
  beforeLoad: ({ context }) => {
    if (!context.auth.hasRole(['admin'])) {
      throw redirect({ to: '/403' })
    }
  },
  component: AdminPage,
})
```

For **UI-level** auth (buttons/sections):

```tsx
import { PermissionGuard } from '@/components/auth-guard'
;<PermissionGuard allowedRoles={['admin']}>
  <DeleteButton />
</PermissionGuard>
```
