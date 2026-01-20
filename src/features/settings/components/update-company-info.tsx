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
import { useUpdateCompany } from '../hooks'
import { updateCompanyInfoSchema, type TUpdateCompanyInfo } from '../schema'
import UpdateCompanyInfoForm from './update-company-info-form'

export default function UpdateCompany() {
  const user = getCookie<IUser>('user')
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { mutate: updateCompany, isPending } = useUpdateCompany()
  const form = useForm<TUpdateCompanyInfo>({
    defaultValues: {
      mailing_address: user?.company_info?.mailing_address || '',
      registered_address: user?.company_info?.registered_address || '',
      website: user?.company_info?.website || '',
    },
    resolver: zodResolver(updateCompanyInfoSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data: TUpdateCompanyInfo): Promise<void> => {
    updateCompany(
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
          <SheetTitle>Update Company Info</SheetTitle>
          <SheetDescription>
            Fill out the form below to update your company information. Fields
            marked with * are required.
          </SheetDescription>
        </SheetHeader>
        <Separator />

        <SheetPanel className="max-h-[calc(100vh-180px)] h-lvh">
          <UpdateCompanyInfoForm
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
