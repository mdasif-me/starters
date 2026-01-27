## project stack

- React 19+ with TypeScript
- Create React App (no Vite)
- TanStack Query v5
- Clerk Authentication
- shadcn/ui components
- Tailwind CSS v4
- pnpm workspace

## coding patterns

- Don't use extra commit on the file. Just provide the final code.
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
- Use ESLint and Prettier for code formatting and linting.

## example code comment pattern

```
/**
 * a hook to check user permissions and roles.
 * currently provides dummy/hardcoded role checking.
 * todo: implement actual permission checking when auth system is fully implemented.
 */
```

## example tanstack query hook with api layer

```typescript
import { useQuery } from '@tanstack/react-query'
import { api } from '@/features/api/api-client'

import { toastManager } from '@/components/ui/toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { projectApi } from './api'
import type { IApprovedProject, IListProjectsParams } from './interface'
import type { TCreateProject } from './schema'

export const useProjects = (params: IListProjectsParams = {}) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectApi.listProjects(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useProject = (pid: string, tab: string) => {
  return useQuery({
    queryKey: ['project', pid, tab],
    queryFn: () => projectApi.getProject(pid, tab),
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

export const useDeleteProject = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (pid: string) => projectApi.deleteProject(pid),
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
        queryClient.invalidateQueries({ queryKey: ['projects'] })
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

## example data grid with server side pagination and client side pagination with filtering

```typescript
// server side pagination with client side filtering and sorting
import { Button } from '@/components/ui/button'
import {
  Card,
  CardFooter,
  CardHeader,
  CardHeading,
  CardTable,
  CardToolbar,
} from '@/components/ui/card'
import { DataGrid } from '@/components/ui/data-grid'
import { DataGridPagination } from '@/components/ui/data-grid-pagination'
import { DataGridTable } from '@/components/ui/data-grid-table'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useMemo, useState } from 'react'

import { useDebounceCallback } from '@/hooks/use-debounce-callback'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { Search, X } from 'lucide-react'
import { useProjects } from '../hooks'
import type { IProjectList } from '../interface'
import { columns } from '../utils/columns'
import Project from './project'

export default function ProjectsLists() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'title', desc: false },
  ])
  const [searchQuery, setSearchQuery] = useState('')
  const [inputValue, setInputValue] = useState('')
  const debounced = useDebounceCallback(setSearchQuery, 500)

  const offset = pagination.pageIndex + 1
  const limit = pagination.pageSize
  const sortBy = sorting[0]?.id as
    | 'title'
    | 'created_at'
    | 'updated_at'
    | undefined
  const sortOrder = sorting[0]?.desc ? 'desc' : 'asc'

  const { data: projectsData, isLoading } = useProjects({
    offset,
    limit,
    search: searchQuery || undefined,
    sort_by: sortBy,
    sort_order: sortOrder,
  })

  const filteredData = useMemo(() => {
    return projectsData?.data?.edges?.map((edge) => edge.data) || []
  }, [projectsData])

  const metadata = projectsData?.data?.metadata
  const totalItems = metadata?.total_items || 0
  const totalPages = metadata?.total_pages || 1

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string),
  )

  const table = useReactTable({
    columns,
    data: filteredData,
    pageCount: totalPages,
    getRowId: (row: IProjectList) => row.id,
    state: {
      pagination,
      sorting,
      columnOrder,
    },
    columnResizeMode: 'onChange',
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
  })

  return (
    <DataGrid
      table={table}
      recordCount={totalItems}
      tableLayout={{
        columnsPinnable: true,
        columnsResizable: true,
        columnsMovable: true,
        columnsVisibility: true,
      }}
      isLoading={isLoading}
    >
      <Card>
        <CardHeader className="py-4">
          <CardToolbar>
            <h1 className="text-xl text-foreground/80 font-semibold tracking-tight">
              Our Projects
            </h1>
          </CardToolbar>
          <CardHeading>
            <div className="flex w-full items-center gap-2.5">
              <div className="relative w-full">
                <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search..."
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    debounced(e.target.value)
                  }}
                  className="ps-9 md:w-xs w-full focus-visible:ring-0 shadow-none"
                />
                {inputValue.length > 0 && (
                  <Button
                    mode="icon"
                    variant="ghost"
                    className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => {
                      setInputValue('')
                      setSearchQuery('')
                    }}
                  >
                    <X />
                  </Button>
                )}
              </div>
              <Project />
            </div>
          </CardHeading>
        </CardHeader>
        <CardTable>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        <CardFooter>
          <DataGridPagination />
        </CardFooter>
      </Card>
    </DataGrid>
  )
}

// client side pagination with filtering and sorting
import { Button } from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardHeading,
  CardTable,
  CardToolbar,
} from '@/components/ui/card'
import { DataGrid } from '@/components/ui/data-grid'
import { DataGridTable } from '@/components/ui/data-grid-table'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useMemo, useState } from 'react'

import type { ISalesItem } from '@/features/projects/interface'
import { useDebounceCallback } from '@/hooks/use-debounce-callback'
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { Search, X } from 'lucide-react'
import { columns } from './utils/columns'

export default function SalesList({
  item,
  isLoading,
}: {
  item: ISalesItem[] | undefined
  isLoading: boolean
}) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [inputValue, setInputValue] = useState('')
  const debounced = useDebounceCallback(setSearchQuery, 500)

  const filteredData = useMemo(() => {
    if (!item) return []

    if (!searchQuery.trim()) return item
    return item.filter((sale) =>
      sale.full_name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [item, searchQuery])

  const [columnOrder, setColumnOrder] = useState<string[]>(
    columns.map((column) => column.id as string),
  )

  const table = useReactTable({
    columns,
    data: filteredData,
    getRowId: (row: ISalesItem) => row.id,
    state: {
      pagination,
      sorting,
      columnOrder,
    },
    columnResizeMode: 'onChange',
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <DataGrid
      table={table}
      recordCount={filteredData.length}
      tableLayout={{
        columnsPinnable: true,
        columnsResizable: true,
        columnsMovable: true,
        columnsVisibility: true,
      }}
      isLoading={isLoading}
    >
      <Card>
        <CardHeader className="py-4">
          <CardToolbar>
            <h1 className="text-xl text-foreground/80 font-semibold tracking-tight">
              Approved Installment Sales
            </h1>
          </CardToolbar>
          <CardHeading>
            <div className="flex w-full items-center gap-2.5">
              <div className="relative w-full">
                <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search..."
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    debounced(e.target.value)
                  }}
                  className="ps-9 md:w-xs w-full focus-visible:ring-0 shadow-none"
                />
                {inputValue.length > 0 && (
                  <Button
                    mode="icon"
                    variant="ghost"
                    className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
                    onClick={() => {
                      setInputValue('')
                      setSearchQuery('')
                    }}
                  >
                    <X />
                  </Button>
                )}
              </div>
            </div>
          </CardHeading>
        </CardHeader>
        <CardTable>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
      </Card>
    </DataGrid>
  )
}

```
