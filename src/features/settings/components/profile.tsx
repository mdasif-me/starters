import type { IUser } from '@/features/auth/types'
import { getCookie } from '@/hooks/use-cookie-storage'
import CompanyProfile from './company-profile'
import UserProfile from './user-profile'

export default function Profile() {
  const user_info = getCookie<IUser>('user')
  return (
    <div className="space-y-4">
      <UserProfile user={user_info as IUser} />
      <CompanyProfile user={user_info as IUser} />
    </div>
  )
}
