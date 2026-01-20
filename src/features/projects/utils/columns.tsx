import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/base-avatar'
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header'
import { type ColumnDef } from '@tanstack/react-table'
import Allotment from '../components/allotment'
import type { IProjectList } from '../interface'
import { ActionsCell } from '../utils/action-cell'

export const columns: ColumnDef<IProjectList>[] = [
  {
    id: 'no',
    header: ({ column }) => (
      <DataGridColumnHeader title="No" visibility={true} column={column} />
    ),
    cell: ({ row, table }) =>
      (table
        .getSortedRowModel()
        ?.flatRows?.findIndex((flatRow) => flatRow.id === row.id) || 0) + 1,
    enableSorting: false,
    size: 20,
    enableResizing: false,
  },
  {
    accessorKey: 'title',
    id: 'title',
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Project Profile"
        visibility={true}
        column={column}
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage
              src={row.original.gallery[0]}
              alt={row.original.title}
            />
            <AvatarFallback>{row.original.title[0]}</AvatarFallback>
          </Avatar>
          <div className="space-y-px">
            <div className="font-medium text-foreground">
              {row.original.title}
            </div>
            <div className="text-muted-foreground">{row.original.location}</div>
          </div>
        </div>
      )
    },
    size: 250,
    enableSorting: true,
    enableHiding: false,
    enableResizing: true,
  },
  {
    accessorKey: 'allotments',
    id: 'allotments',
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Packages"
        visibility={true}
        column={column}
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-full justify-between items-center gap-1.5">
          <div className="font-medium text-foreground">
            <span className="text-xs">
              {row.original.allotments.length > 0 ? (
                `(${row.original.allotments.length}) `
              ) : (
                <p className="text-muted-foreground">No Packages</p>
              )}
            </span>
            {row.original.allotments
              .map((allotment: any) => allotment.name)
              .join(', ')}
          </div>
          <div>
            {row.original.allotments.length > 0 ? (
              <Allotment row={row} />
            ) : (
              <Allotment row={row} />
            )}
          </div>
        </div>
      )
    },
    size: 200,
    meta: {
      headerClassName: '',
      cellClassName: 'text-start',
    },
    enableSorting: false,
    enableHiding: true,
    enableResizing: true,
  },
  {
    accessorKey: 'share_price',
    id: 'share_price',
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Starting Price (Sales)"
        visibility={true}
        column={column}
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium text-foreground">
          {row.original.share_price.toLocaleString('en-IN', {
            style: 'currency',
            currency: 'BDT',
            minimumFractionDigits: 0,
          })}
        </div>
      )
    },
    size: 100,
    enableSorting: false,
    enableHiding: true,
    enableResizing: true,
  },
  {
    accessorKey: 'company',
    id: 'company',
    header: ({ column }) => (
      <DataGridColumnHeader
        title="Project By"
        visibility={true}
        column={column}
      />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium text-foreground">
          {row.original.company.company_info.name}
        </div>
      )
    },
    size: 200,
    meta: {
      headerClassName: '',
      cellClassName: 'text-start',
    },
    enableSorting: false,
    enableHiding: true,
    enableResizing: true,
  },
  {
    id: 'actions',
    header: ({ column }) => (
      <DataGridColumnHeader title="Actions" visibility={true} column={column} />
    ),
    cell: ({ row }) => <ActionsCell row={row} />,
    size: 60,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false,
  },
]
