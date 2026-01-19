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
