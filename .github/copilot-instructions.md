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
- Please don't add comments unless you need to. Avoid generating .md files in the project. If you need to explain something, do it here. All explanations should be in this file only, and in lowercase. If multiple explanations are needed, use bullet points.
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

export const useCreateProject = () => {
  return useMutation({
    mutationFn: projectApi.createProject,
    onSuccess: (data) => {
      if (data.status_code !== 201) {
        toastManager.add({
          title: 'Message',
          description: data.message,
          type: 'info',
        })
      } else {
        toastManager.add({
          title: 'Success',
          description: data.message,
          type: 'success',
        })
      }
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error',
        description: error.message,
        type: 'error',
      })
    },
  })
}

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: ({
      pid,
      data,
    }: {
      pid: string
      data: Partial<TCreateProject>
    }) => projectApi.updateProject(pid, data),
    onSuccess: (data) => {
      if (data.status_code !== 200) {
        toastManager.add({
          title: 'Message',
          description: data.message,
          type: 'info',
        })
      } else {
        toastManager.add({
          title: 'Success',
          description: data.message,
          type: 'success',
        })
      }
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error',
        description: error.message,
        type: 'error',
      })
    },
  })
}
```
