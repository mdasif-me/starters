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
  SheetTrigger,
} from '@/components/ui/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, PlusIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useCreateProject } from '../hooks'
import { projectSchema, type TCreateProject } from '../schema'
import { ProjectForm } from './project-form'

export default function Project() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { mutate: createProject, isPending } = useCreateProject()
  const form = useForm<TCreateProject>({
    defaultValues: {
      title: '',
      commission_rate: 0,
      total_shares: 0,
      share_price: 0,
    },
    resolver: zodResolver(projectSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: TCreateProject): Promise<void> => {
    createProject(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['projects'] })
        setOpen(false)
        form.reset()
      },
    })
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      form.reset()
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger render={<Button size={'lg'} />}>
        <PlusIcon className="h-4 w-4" />
        <span className="md:block hidden">Add Project</span>
      </SheetTrigger>

      <SheetPopup inset className={'max-w-2xl w-full'}>
        <SheetHeader>
          <SheetTitle>Add Project</SheetTitle>
          <SheetDescription>
            Fill out the form below to add a new project to your catalog. Fields
            marked with * are required.
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
              {isPending ? 'Adding Project...' : 'Add Project'}
            </Button>
          </div>
        </SheetFooter>
      </SheetPopup>
    </Sheet>
  )
}
