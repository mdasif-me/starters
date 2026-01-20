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
import type { IUser } from '@/features/auth/types'
import { getCookie } from '@/hooks/use-cookie-storage'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { Loader2, PencilLineIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useUpdateProfile } from '../hooks'
import { updateProfileSchema, type TUpdateProfile } from '../schema'
import UpdateProfileForm from './update-profile-form'

export default function UpdateProfile() {
  const user = getCookie<IUser>('user')

  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { mutate: updateProfile, isPending } = useUpdateProfile()
  const form = useForm<TUpdateProfile>({
    defaultValues: {
      logo: user?.company_info?.logo || null,
    },
    resolver: zodResolver(updateProfileSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: TUpdateProfile): Promise<void> => {
    updateProfile(
      { data },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['profile'] })
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
      <SheetTrigger
        render={
          <Button
            variant="secondary"
            className="text-muted-foreground py-2 sm:size-fit size-6"
          />
        }
      >
        <PencilLineIcon />
        <span className="sm:block hidden">Edit</span>
      </SheetTrigger>

      <SheetPopup inset className={'max-w-2xl w-full'}>
        <SheetHeader>
          <SheetTitle>Update Profile</SheetTitle>
          <SheetDescription>
            Fill out the form below to update your profile information. Fields
            marked with * are required.
          </SheetDescription>
        </SheetHeader>
        <Separator />

        <SheetPanel className="max-h-[calc(100vh-180px)] h-lvh">
          <UpdateProfileForm
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
              {isPending ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </SheetFooter>
      </SheetPopup>
    </Sheet>
  )
}
