'use client'

import { Form } from '@/components/ui/form'
import { Upload } from '@/features/uploads'
import type { UseFormReturn } from 'react-hook-form'
import type { TUpdateProfile } from '../schema'

interface IUpdateProfileFormProps {
  onSubmit: (data: TUpdateProfile) => Promise<void>
  form: UseFormReturn<TUpdateProfile>
  isLoading?: boolean
}

export default function UpdateProfileForm({
  onSubmit,
  form,
}: IUpdateProfileFormProps) {
  const photo = form.watch('photo')
  const handleUpload = (assetIds: string[], fileUrls: string[]) => {
    console.info('assetIds', assetIds)
    if (fileUrls.length > 0) {
      const currentPhoto = photo
      form.setValue('photo', currentPhoto, { shouldValidate: true })
    }
  }

  return (
    <Form {...form}>
      <form
        className="w-full space-y-6 py-4"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Project Images</h3>
            <Upload
              maxFiles={10}
              maxSize={50 * 1024 * 1024}
              accept="image/*"
              initialFiles={
                photo
                  ? [
                      {
                        url: photo,
                        id: photo,
                        name: 'company-logo',
                        size: 0,
                        type: 'image/jpeg',
                      },
                    ]
                  : []
              }
              onUploadComplete={handleUpload}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}
