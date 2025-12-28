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
import { useLogin } from '@/features/auth/hooks'
import { loginSchema, type LoginCredentials } from '@/features/auth/schemas'
import { useCookieStorage } from '@/hooks/use-cookie-storage'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { LoaderCircleIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { EScope } from '../types'

export default function LoginForm() {
  const { mutate: login, isPending } = useLogin()
  const [, setAuthInfo] = useCookieStorage<LoginCredentials>(
    'auth_verification',
    { phone_number: '', scope: EScope.LOGIN },
    { path: '/' },
  )

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone_number: '' },
    mode: 'onSubmit',
  })

  function onSubmit(data: z.infer<typeof loginSchema>) {
    //* NOTE: we are storing phone number and scope in cookie to use it in verify form
    const req_data: LoginCredentials = {
      phone_number: data.phone_number,
      scope: EScope.LOGIN,
    }
    setAuthInfo(req_data)
    login(data)
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
          <Button
            variant="primary"
            disabled={isPending}
            type="submit"
            className="w-full"
          >
            {isPending ? (
              <LoaderCircleIcon className="animate-spin size-4" />
            ) : null}
            {isPending ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
