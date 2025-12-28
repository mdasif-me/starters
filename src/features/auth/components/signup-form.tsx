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
import { useSignup } from '@/features/auth/hooks'
import { signupSchema, type SignupCredentials } from '@/features/auth/schemas'
import { EScope } from '@/features/auth/types'
import { useCookieStorage } from '@/hooks/use-cookie-storage'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { LoaderCircleIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function SignupForm() {
  const [, setAuthInfo] = useCookieStorage<SignupCredentials>(
    'auth_verification',
    { phone_number: '', scope: EScope.REGISTER },
    { path: '/' },
  )

  const { mutate: signup, isPending } = useSignup()

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { phone_number: '' },
    mode: 'onSubmit',
  })

  function onSubmit(data: z.infer<typeof signupSchema>) {
    //* NOTE: we are storing phone number and scope in cookie to use it in verify form
    const req_data = {
      phone_number: data.phone_number,
      scope: EScope.REGISTER,
    }
    setAuthInfo(req_data)
    signup(data)
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full sm:w-sm space-y-6"
      >
        <FormField
          control={form.control}
          name="phone_number"
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

        <div className="mt-20 space-y-5">
          <p className="text-sm text-center">
            Already have an account?
            <Link
              to="/auth/login"
              className="ml-1 underline text-muted-foreground"
            >
              Login
            </Link>
          </p>
        </div>
        <div className="flex items-center justify-center gap-2.5">
          <Button
            variant="primary"
            disabled={isPending}
            type="submit"
            className="w-full"
          >
            {isPending ? (
              <LoaderCircleIcon className="animate-spin size-4" />
            ) : null}
            {isPending ? 'Signing up...' : 'Signup'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
