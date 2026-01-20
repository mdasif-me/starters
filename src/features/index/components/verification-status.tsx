import { Button } from '@/components/ui/button'
import { toastManager } from '@/components/ui/toast'
import { authApi } from '@/features/auth/api'
import { useCookieStorage } from '@/hooks/use-cookie-storage'
import { ReloadIcon } from '@hugeicons-pro/core-solid-rounded'
import { HugeiconsIcon } from '@hugeicons/react'
import { ClockIcon } from 'lucide-react'

export default function VerificationStatus() {
  const [, setUserInfo] = useCookieStorage<any>('user', {}, { path: '/' })
  const handleRecheck = async () => {
    const userResponse = await authApi.getUserProfile()
    const user = userResponse.edge.data
    setUserInfo(user)
    toastManager.add({
      title: 'Success',
      type: 'success',
    })
    window.location.href = '/'
  }

  return (
    <div className="flex items-center justify-center h-screen min-h-96 w-full p-4">
      <div className="max-w-xl w-full bg-background border border-border rounded-3xl shadow-xl overflow-hidden">
        <div className="h-2 w-full bg-warning/70" />
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-warning/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
            <ClockIcon className="w-8 h-8 text-warning" />
          </div>

          <h3 className="text-2xl font-bold text-foreground mb-3">
            Verification in Progress
          </h3>
          <p className="text-muted-foreground leading-relaxed mb-8">
            Your company information is currently being reviewed by our
            compliance team. This usually takes{' '}
            <span className="font-semibold text-warning">24-48</span> hours.
          </p>
          <div className="w-full space-y-3">
            <button
              disabled
              className="w-full py-3 px-4 bg-warning/5 text-warning font-medium rounded-xl cursor-not-allowed"
            >
              Waiting for Approval
            </button>
          </div>
        </div>
        <div className="bg-background flex items-center justify-between px-8 py-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center uppercase tracking-wider font-semibold">
            Status: Pending Review
          </p>
          <Button onClick={handleRecheck}>
            Recheck <HugeiconsIcon icon={ReloadIcon} size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}
