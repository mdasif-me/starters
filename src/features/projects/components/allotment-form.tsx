'use client'

import { Button } from '@/components/ui/button'
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
import { Separator } from '@/components/ui/separator'
import { Upload } from '@/features/uploads'
import { Plus, Trash2 } from 'lucide-react'
import { type UseFormReturn, useFieldArray } from 'react-hook-form'

interface IAllotmentFormProps {
  onSubmit: (data: any) => Promise<void>
  form: UseFormReturn<any>
  isLoading?: boolean
}

export const AllotmentForm = ({
  onSubmit,
  form,
  isLoading = false,
}: IAllotmentFormProps) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'allotments',
  })

  const handleUpload =
    (index: number) => (assetIds: string[], fileUrls: string[]) => {
      console.info('assetIds', assetIds)
      if (fileUrls.length > 0) {
        form.setValue(`allotments.${index}.icon`, fileUrls[0], {
          shouldValidate: true,
        })
      }
    }

  const handleAddAllotment = () => {
    append({
      name: '',
      assigned_shares: 0,
      icon: '',
    })
  }

  const handleRemoveAllotment = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  return (
    <Form {...form}>
      <form
        className="w-full space-y-6 py-4"
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
      >
        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id}>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Allotment {index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveAllotment(index)}
                    disabled={fields.length === 1 || isLoading}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>

                <FormField
                  control={form.control}
                  name={`allotments.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Allotment Name{' '}
                        <span className="text-destructive">*</span>
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
                  name={`allotments.${index}.assigned_shares`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Assigned Shares{' '}
                        <span className="text-destructive">*</span>
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
                    onUploadComplete={handleUpload(index)}
                  />
                </div>
              </div>

              {index < fields.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddAllotment}
            disabled={isLoading}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add More Allotment
          </Button>
        </div>
      </form>
    </Form>
  )
}
