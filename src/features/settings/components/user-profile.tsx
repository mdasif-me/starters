import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { IUser } from '@/features/auth/types'
import { PencilLineIcon } from 'lucide-react'
import profile from '../../../../public/user.png'

export default function UserProfile({ user }: { user: IUser }) {
  return (
    <Card>
      <CardContent className="flex w-full justify-between p-4">
        <div className="flex items-center gap-4">
          <img
            className="w-24 h-24 shrink-0 object-center rounded-xl object-cover bg-muted"
            src={user.company_info?.logo || profile}
            alt={user.company_info?.name || 'User Profile'}
          />
          <article>
            <h3 className="text-2xl font-medium">
              {user.company_info?.name || 'Asif'}
            </h3>
            <p className="text-muted-foreground">
              {user.phone_number || '+880123456789'}
            </p>
            <p className="text-muted-foreground">
              {user.company_info?.email_address || 'biswas.mail@gmail.com'}
            </p>
          </article>
        </div>
        <div>
          <Button variant="secondary" className="text-muted-foreground">
            <PencilLineIcon />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
