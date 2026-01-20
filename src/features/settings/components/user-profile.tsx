import { Card, CardContent } from '@/components/ui/card'
import type { IUser } from '@/features/auth/types'
import profile from '../../../../public/logo-icon.svg'
import UpdateProfile from './update-profile'

export default function UserProfile({ user }: { user: IUser }) {
  return (
    <Card>
      <CardContent className="flex w-full justify-between sm:p-4 p-2">
        <div className="flex items-center sm:gap-4 gap-2">
          <img
            className="sm:w-24 sm:h-24 shrink-0 object-center rounded-xl object-cover bg-muted"
            src={user.company_info?.logo || profile}
            alt={user.company_info?.name || 'User Profile'}
          />
          <article>
            <h3 className="sm:text-2xl text-sm font-medium">
              {user.company_info?.name || 'Asif'}
            </h3>
            <p className="text-muted-foreground sm:text-base text-xs">
              {user.phone_number || '+880123456789'}
            </p>
            <p className="text-muted-foreground sm:text-base text-xs">
              {user.company_info?.email_address || 'biswas.mail@gmail.com'}
            </p>
          </article>
        </div>
        <div>
          <UpdateProfile />
        </div>
      </CardContent>
    </Card>
  )
}
