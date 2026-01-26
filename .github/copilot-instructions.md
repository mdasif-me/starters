# Copilot Instructions for PMS-Admin

## Project Stack

- React 19+ with TypeScript
- Create React App (no Vite)
- TanStack Query v5
- Clerk Authentication
- shadcn/ui components
- Tailwind CSS
- pnpm workspace

## Coding Patterns

- Don't use an extra commit on the file. Just provide the final code.
- Don't add comments unless necessary. And avoid .md file generate on the project.
- When adding new features, follow the existing project structure.
- Follow the existing project structure and coding conventions.
- Use TanStack Query for data fetching and mutations.
- Use shadcn/ui components for UI elements.
- Use TypeScript interfaces for type safety.
- Organize code into features and hooks.
- Separate API calls into an `api.ts` file within each feature.
- Use React hooks for state management and side effects.
- Follow the existing naming conventions for hooks and components.
- Ensure all API interactions are handled through a centralized API layer.
- Write clean, maintainable, and well-documented code.
- Follow best practices for React and TypeScript development.
- Ensure proper error handling and loading states in data fetching hooks.
- Use descriptive names for query keys in TanStack Query.
- Avoid unnecessary re-renders by optimizing hook dependencies.
- Use toast notifications for user feedback on actions.
- Ensure responsiveness and accessibility in UI components.
- Follow the existing folder structure for features, components, and routes.
- Write unit tests for critical components and hooks.

### API Layer Pattern

```typescript
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => api.getUsers(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
```
