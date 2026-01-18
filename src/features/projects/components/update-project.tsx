'use client'

import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetClose,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetPanel,
  SheetPopup,
  SheetTitle,
} from '@/components/ui/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import type { Row } from '@tanstack/react-table'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useUpdateProject } from '../hooks'
import type { IProjectList } from '../interface'
import { projectSchema, type TCreateProject } from '../schema'
import { ProjectForm } from './project-form'

interface IUpdateProjectProps {
  row: Row<IProjectList>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function UpdateProject({
  row,
  open,
  onOpenChange,
}: IUpdateProjectProps) {
  const queryClient = useQueryClient()
  const { mutate: updateProject, isPending } = useUpdateProject()
  const project = row.original

  const form = useForm<TCreateProject>({
    defaultValues: {
      title: project.title || '',
      location: project.location || '',
      commission_rate: project.commission_rate || 0,
      total_shares: project.total_shares || 0,
      share_price: project.share_price || 0,
      description: project.description || '',
      gallery: project.gallery || [],
    },
    resolver: zodResolver(projectSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: TCreateProject): Promise<void> => {
    const { allotments, ...updateData } = data

    updateProject(
      { pid: project.id, data: updateData },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['projects'] })
          onOpenChange(false)
          form.reset()
        },
      },
    )
  }

  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen)
    if (!isOpen) {
      form.reset()
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetPopup inset className={'max-w-2xl w-full'}>
        <SheetHeader>
          <SheetTitle>Update Project</SheetTitle>
          <SheetDescription>
            Update the project details below. Fields marked with * are required.
            Allotment changes are managed separately.
          </SheetDescription>
        </SheetHeader>
        <Separator />

        <SheetPanel className="max-h-[calc(100vh-180px)] h-lvh">
          <ProjectForm onSubmit={onSubmit} form={form} isLoading={isPending} />
        </SheetPanel>

        <SheetFooter>
          <div className="flex items-center w-full">
            <SheetClose
              render={<Button variant="ghost" />}
              disabled={isPending}
            >
              Cancel
            </SheetClose>
            <Button
              className="ms-auto"
              type="submit"
              disabled={isPending}
              onClick={() => form.handleSubmit(onSubmit)()}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? 'Updating Project...' : 'Update Project'}
            </Button>
          </div>
        </SheetFooter>
      </SheetPopup>
    </Sheet>
  )
}
