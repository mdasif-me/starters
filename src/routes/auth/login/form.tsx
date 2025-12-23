import { PhoneInput } from '@/components/ui/base-phone-input'
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
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { z } from 'zod'

export default function LoginForm() {
  const schema = z.object({
    phoneNumber: z.string().refine(isValidPhoneNumber, {
      message: 'Please enter a valid phone number.',
    }),
  })

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { phoneNumber: '' },
    mode: 'onSubmit',
  })

  function onSubmit(data: z.infer<typeof schema>) {
    console.log('Form submitted:', data)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-sm space-y-6">
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <PhoneInput
                  {...field}
                  placeholder="Enter phone number"
                  popupClassName="w-sm"
                  scrollAreaClassName="h-sm"
                  aria-invalid={!!fieldState.error}
                />
              </FormControl>
              <FormDescription>
                Enter your phone number to proceed
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="my-7 w-full flex items-center justify-center overflow-hidden">
          <Separator />
          <span className="text-sm px-2">OR</span>
          <Separator />
        </div>
        <div className="mt-5 space-y-5">
          <Link
            to="/auth/forgot-password"
            className="text-sm block underline text-muted-foreground text-center"
          >
            Forgot your password?
          </Link>
          <p className="text-sm text-center">
            Don&apos;t have an account?
            <Link
              to="/auth/signup"
              className="ml-1 underline text-muted-foreground"
            >
              Create account
            </Link>
          </p>
        </div>
        <div className="flex items-center justify-center gap-2.5">
          <Button className="w-full" type="submit">
            Login
          </Button>
        </div>
      </form>
    </Form>
  )
}
