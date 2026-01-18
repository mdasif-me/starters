import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import type { Row } from '@tanstack/react-table'
import { Ellipsis } from 'lucide-react'
import { toastManager } from '../../../components/ui/toast'
import type { IProjectList } from '../interface'

export function ActionsCell({ row }: { row: Row<IProjectList> }) {
  const [copy] = useCopyToClipboard()
  const handleCopyId = () => {
    copy(row.original.id)
    const message = `Employee ID successfully copied: ${row.original.id}`
    toastManager.add({
      title: 'Success',
      description: message,
      type: 'success',
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="size-7" mode="icon" variant="ghost">
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuItem onClick={() => {}}>Edit</DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyId}>Copy ID</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => {}}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
