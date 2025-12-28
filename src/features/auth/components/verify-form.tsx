import { CreativeOTPInput } from '@/components/ui/creative-otp-input'
import { Form } from '@/components/ui/form'
import { toastManager } from '@/components/ui/toast'
import { useResend, useVerify } from '@/features/auth/hooks'
import {
  authVerifySchema,
  type AuthVerifyCredentials,
} from '@/features/auth/schemas'
import { useCookieStorage } from '@/hooks/use-cookie-storage'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { EScope } from '../types'

export default function VerifyForm() {
  const [authInfo, setAuthInfo] = useCookieStorage<AuthVerifyCredentials>(
    'auth_verification',
    { phone_number: '', otp: '', scope: EScope.REGISTER },
    { path: '/' },
  )

  const { mutate: verify } = useVerify()
  const { mutate: resend, isPending: isResending } = useResend()
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const form = useForm<z.infer<typeof authVerifySchema>>({
    resolver: zodResolver(authVerifySchema),
    defaultValues: {
      otp: authInfo.otp,
      phone_number: authInfo.phone_number,
      scope: authInfo.scope || EScope.REGISTER,
    },
    mode: 'onSubmit',
  })

  /**
   * Verify a user with phone number and OTP.
   * If the verification is successful, it will set the status to 'success'.
   * If the verification fails, it will set the status to 'error'.
   */
  function onSubmit(data: z.infer<typeof authVerifySchema>) {
    verify(data, {
      onSuccess: () => {
        setStatus('success')
      },
      onError: () => {
        setStatus('error')
      },
    })
  }

  /**
   * Handle resend OTP button click.
   * If the phone number is not found, it will show an error toast.
   * If the phone number is found, it will call the resend endpoint with the phone number and scope.
   * If the resend is successful, it will set the status to 'idle'.
   */
  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!authInfo.phone_number) {
      toastManager.add({
        title: 'Error',
        description: `Phone number not found. Please try to ${authInfo.scope} again.`,
        type: 'error',
      })
      return
    }
    const data = { phone_number: authInfo.phone_number, scope: authInfo.scope }
    resend(data, {
      onSuccess: () => {
        setStatus('idle')
      },
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full sm:w-sm space-y-6"
      >
        <div className="z-20 flex flex-col items-center gap-y-10 p-8">
          <div className="space-y-2 text-center">
            <motion.h3
              className="text-xl font-semibold dark:text-white"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Enter Verification Code
            </motion.h3>
            <p className="text-sm text-muted-foreground dark:text-muted-foreground/80">
              We&apos;ve sent a code to your number
            </p>
          </div>

          <div className="relative ">
            <CreativeOTPInput
              length={6}
              variant="default"
              status={status}
              onComplete={(otp) => {
                setAuthInfo({ ...authInfo, otp })
                form.setValue('otp', otp)
                form.handleSubmit(onSubmit)()
              }}
            />
            <AnimatePresence>
              {status === 'error' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-x-0 -bottom-8 text-center text-sm font-medium text-red-500 dark:text-red-400"
                >
                  Invalid code. Please try again.
                </motion.p>
              )}
              {status === 'success' && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-x-0 -bottom-8 text-center text-sm font-medium text-green-500 dark:text-green-400"
                >
                  Verification successful!
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.p
            className="mt-5 text-sm text-muted-foreground dark:text-muted-foreground/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Didn&apos;t receive the code?{' '}
            <motion.button
              className="text-primary hover:underline dark:text-primary/90 disabled:opacity-50"
              onClick={handleResend}
              disabled={isResending}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isResending ? 'Sending...' : 'Resend'}
            </motion.button>
          </motion.p>
        </div>
      </form>
    </Form>
  )
}
