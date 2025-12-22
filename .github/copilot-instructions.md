# Copilot Instructions for PMS-Admin

## Project Stack

- React 18+ with TypeScript
- Create React App (no Vite)
- TanStack Query v5
- Clerk Authentication
- shadcn/ui components
- Tailwind CSS
- pnpm workspace

## Coding Patterns

### API Layer Pattern

```typescript
// Example pattern for TanStack Query hooks
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```
