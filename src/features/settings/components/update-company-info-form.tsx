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
import type { UseFormReturn } from 'react-hook-form'
import type { TUpdateCompanyInfo } from '../schema'

interface IUpdateCompanyFormProps {
  onSubmit: (data: TUpdateCompanyInfo) => Promise<void>
  form: UseFormReturn<TUpdateCompanyInfo>
  isLoading?: boolean
}

export default function UpdateCompanyInfoForm({
  onSubmit,
  form,
  isLoading,
}: IUpdateCompanyFormProps) {
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
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Company Website <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter the company website"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Website of the company (e.g., "https://www.company.com")
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registered_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Registered Address <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter the registered address"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Registered address of the company (e.g., "123 Main St, City,
                  Country")
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mailing_address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Mailing Address <span className="text-destructive">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Enter the mailing address"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Mailing address of the company (e.g., "123 Main St, City,
                  Country")
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  )
}
