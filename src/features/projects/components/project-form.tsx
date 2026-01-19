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
import { Textarea } from '@/components/ui/textarea'
import { Upload } from '@/features/uploads'
import { type UseFormReturn } from 'react-hook-form'
import type { TCreateProject } from '../schema'

interface IProjectFormProps {
  onSubmit: (data: TCreateProject) => Promise<void>
  form: UseFormReturn<TCreateProject>
  isLoading?: boolean
}

export const ProjectForm = ({
  onSubmit,
  form,
  isLoading = false,
}: IProjectFormProps) => {
  const gallery = form.watch('gallery')

  const handleUpload = (assetIds: string[], fileUrls: string[]) => {
    console.info('assetIds', assetIds)
    if (fileUrls.length > 0) {
      const currentGallery = gallery || []
      const updatedGallery = [...currentGallery, ...fileUrls]
      form.setValue('gallery', updatedGallery, { shouldValidate: true })
    }
  }

  const getInitialGalleryFiles = () => {
    if (!gallery || gallery.length === 0) return []

    return gallery.map((url, index) => ({
      id: `gallery-${index}`,
      name: `project-image-${index}`,
      size: 0,
      type: 'image/jpeg',
      url,
    }))
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Project Name <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter the project name"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Name of the project (e.g., "Project A")
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Project Location <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter the project location"
                    disabled={isLoading}
                    {...field}
                    value={field.value || ''}
                  />
                </FormControl>
                <FormDescription>
                  Location of the project (e.g., "Baddhamondir, Dhaka-1214,
                  Bangladesh")
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="commission_rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Commission Rate <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter commission rate"
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
                    Commission rate as a percentage (e.g., 5 for 5%)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="total_shares"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Total Shares <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter total shares"
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
                    Total number of shares available (e.g., 1000)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="share_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Share Price <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter share price"
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
                <FormDescription>Price per share (e.g., 10.00)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-2">
            <h3 className="font-medium text-sm">Project Images</h3>
            <Upload
              maxFiles={10}
              maxSize={50 * 1024 * 1024}
              accept="image/*"
              initialFiles={getInitialGalleryFiles()}
              onUploadComplete={handleUpload}
            />
          </div>

          <div className="col-span-2">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter a detailed product description"
                      disabled={isLoading}
                      className="resize-none"
                      rows={4}
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of the project. This will be
                    displayed on the project page. (max 1024 characters are
                    allowed)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  )
}
