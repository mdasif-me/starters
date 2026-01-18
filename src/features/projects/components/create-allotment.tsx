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
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useUpdateProject } from '../hooks'
import { allotmentSchema } from '../schema'
import { AllotmentForm } from './allotment-form'

const allotmentsSchema = z.object({
  allotments: z
    .array(allotmentSchema)
    .min(1, 'At least one allotment is required'),
})

type TAllotmentsForm = z.infer<typeof allotmentsSchema>

export default function CreateAllotment({ row }: { row?: any }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { mutate: updateProject, isPending } = useUpdateProject()
  const form = useForm<TAllotmentsForm>({
    defaultValues: {
      allotments: [
        {
          name: '',
          assigned_shares: 0,
          icon: '',
        },
      ],
    },
    resolver: zodResolver(allotmentsSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: TAllotmentsForm): Promise<void> => {
    updateProject(
      { pid: row.original.id, data: { allotments: data.allotments } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['projects'] })
          setOpen(false)
          form.reset()
        },
      },
    )
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      form.reset()
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger render={<Button size={'xs'} />}>Setup</SheetTrigger>

      <SheetPopup inset className={'max-w-2xl w-full'}>
        <SheetHeader>
          <SheetTitle>Setup Allotment</SheetTitle>
          <SheetDescription>
            Fill out the form below to add a new allotment to your catalog.
            Fields marked with * are required.
          </SheetDescription>
        </SheetHeader>
        <Separator />

        <SheetPanel className="max-h-[calc(100vh-180px)] h-lvh">
          <AllotmentForm
            onSubmit={onSubmit}
            form={form}
            isLoading={isPending}
          />
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
              {isPending ? 'Adding...' : 'Add'}
            </Button>
          </div>
        </SheetFooter>
      </SheetPopup>
    </Sheet>
  )
}
