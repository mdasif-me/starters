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

export default function Allotment({ row }: { row?: any }) {
  const [open, setOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editedIndex, setEditedIndex] = useState<number | null>(null)
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

  /**
   * Builds the payload for the updateProject mutation based on the editMode and editedIndex state.
   * If editMode is false or editedIndex is null, it returns the formData as is.
   * If editMode is true and editedIndex is a number, it returns a new array with the same length as formData.allotments,
   * but with all elements before editedIndex set to empty objects, and the element at editedIndex set to the edited allotment.
   * @param {TAllotmentsForm} formData - The form data to build the payload from.
   */
  const buildPayload = (formData: TAllotmentsForm) => {
    if (!editMode || editedIndex === null) {
      return { allotments: formData.allotments }
    }
    const allotmentsPayload: any[] = []
    for (let i = 0; i < editedIndex; i++) {
      allotmentsPayload.push({})
    }
    allotmentsPayload.push(formData.allotments[editedIndex])

    return { allotments: allotmentsPayload }
  }

  const onSubmit = async (data: TAllotmentsForm): Promise<void> => {
    const payload = buildPayload(data)
    updateProject(
      { pid: row.original.id, data: payload },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['projects'] })
          setOpen(false)
          form.reset()
          setEditMode(false)
          setEditedIndex(null)
        },
      },
    )
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) {
      if (row.original.allotments && row.original.allotments.length > 0) {
        setEditMode(true)
        form.reset({
          allotments: row.original.allotments,
        })
      } else {
        setEditMode(false)
        form.reset()
      }
    } else {
      form.reset()
      setEditMode(false)
      setEditedIndex(null)
    }
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger render={<Button size={'xs'} />}>
        {row.original.allotments.length > 0 ? 'Update' : 'Add'}
      </SheetTrigger>
      <SheetPopup inset className={'max-w-2xl w-full'}>
        <SheetHeader>
          <SheetTitle>{editMode ? 'Edit' : 'Setup'} Allotment</SheetTitle>
          <SheetDescription>
            {editMode
              ? 'Edit the allotment details below. Only edited allotment will be updated.'
              : 'Fill out the form below to add a new allotment to your catalog.'}
            Fields marked with * are required.
          </SheetDescription>
        </SheetHeader>
        <Separator />

        <SheetPanel className="max-h-[calc(100vh-180px)] h-lvh">
          <AllotmentForm
            onSubmit={onSubmit}
            form={form}
            isLoading={isPending}
            editMode={editMode}
            editedIndex={editedIndex}
            onEditChange={setEditedIndex}
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
              {isPending
                ? editMode
                  ? 'Updating...'
                  : 'Adding...'
                : editMode
                  ? 'Update'
                  : 'Add'}
            </Button>
          </div>
        </SheetFooter>
      </SheetPopup>
    </Sheet>
  )
}
