import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from '@tanstack/react-router'
import type { Row } from '@tanstack/react-table'
import { Ellipsis } from 'lucide-react'
import { useState } from 'react'
import UpdateProject from '../components/update-project'
import type { IProjectList } from '../interface'

export function ActionsCell({ row }: { row: Row<IProjectList> }) {
  const [openEditSheet, setOpenEditSheet] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="size-7" mode="icon" variant="ghost">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="end">
          <DropdownMenuItem onClick={() => setOpenEditSheet(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link to={`/projects/${row.original.id}` as any}>View Details</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => {}}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {openEditSheet && (
        <UpdateProject
          row={row}
          open={openEditSheet}
          onOpenChange={setOpenEditSheet}
        />
      )}
    </>
  )
}
