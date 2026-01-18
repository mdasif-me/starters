'use client'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Upload } from '@/features/uploads'
import { type UseFormReturn } from 'react-hook-form'
import type { TAllotment } from '../schema'

interface IAllotmentFormProps {
  onSubmit: (data: TAllotment) => Promise<void>
  form: UseFormReturn<TAllotment>
  isLoading?: boolean
}

export const AllotmentForm = ({
  onSubmit,
  form,
  isLoading = false,
}: IAllotmentFormProps) => {
  const handleUpload = (assetIds: string[], fileUrls: string[]) => {
    console.info('assetIds', assetIds)
    if (fileUrls.length > 0) {
      form.setValue('icon', fileUrls[0], { shouldValidate: true })
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
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Allotment Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter the allotment name"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Name of the allotment (e.g., "Allotment A")
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assigned_shares"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Assigned Shares <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter the assigned shares"
                    disabled={isLoading}
                    {...field}
                    value={field.value || ''}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : '',
                      )
                    }
                  />
                </FormControl>
                <FormDescription>
                  Number of shares assigned to this allotment (e.g., 100)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-2">
            <h3 className="font-medium text-sm">Allotment Icon</h3>
            <Upload
              maxFiles={10}
              maxSize={50 * 1024 * 1024}
              accept="image/*"
              onUploadComplete={handleUpload}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}
