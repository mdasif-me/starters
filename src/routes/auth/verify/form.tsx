import { CreativeOTPInput } from '@/components/ui/creative-otp-input'
import { Form } from '@/components/ui/form'
import { useVerify } from '@/features/auth/hooks'
import { authVerifySchema } from '@/features/auth/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function VerifyForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleComplete = (otp: string) => {
    console.log('Completed OTP:', otp)
    if (otp === '123456') {
      setStatus('success')
    } else {
      setStatus('error')
    }
  }

  const { mutate: verify, isPending } = useVerify()

  const form = useForm<z.infer<typeof authVerifySchema>>({
    resolver: zodResolver(authVerifySchema),
    defaultValues: { otp: '' },
    mode: 'onSubmit',
  })

  function onSubmit(data: z.infer<typeof authVerifySchema>) {
    verify(data, {
      onError: (error) => {
        console.log('error', error)
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
              We&apos;ve sent a code to your email
            </p>
          </div>

          <div className="relative ">
            <CreativeOTPInput
              length={6}
              variant="default"
              status={status}
              onComplete={handleComplete}
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
              className="text-primary hover:underline dark:text-primary/90"
              onClick={() => setStatus('idle')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Resend
            </motion.button>
          </motion.p>
        </div>
      </form>
    </Form>
  )
}
