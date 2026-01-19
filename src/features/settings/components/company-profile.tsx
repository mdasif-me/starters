import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { IUser } from '@/features/auth/types'
import { PencilLineIcon } from 'lucide-react'
import { companyInfoConfig } from '../utils/company-info-config'
import { formatValue } from '../utils/format-value'

export default function CompanyProfile({ user }: { user: IUser }) {
  const companyInfo = user?.company_info || {}
  const sortedEntries = Object.entries(companyInfo)
    .filter(([key]) => companyInfoConfig[key]?.isVisible !== false)
    .sort(([keyA], [keyB]) => {
      const orderA = companyInfoConfig[keyA]?.order ?? 999
      const orderB = companyInfoConfig[keyB]?.order ?? 999
      return orderA - orderB
    })

  return (
    <Card>
      <CardContent className="w-full">
        <div className="flex w-full items-center justify-between">
          <h2 className="text-2xl font-medium">Company Information</h2>
          <Button variant="secondary" className="text-muted-foreground">
            <PencilLineIcon />
            Edit
          </Button>
        </div>
        <div className="grid grid-cols-3 w-full mt-6 gap-6">
          {sortedEntries.map(([key, value]) => {
            const config = companyInfoConfig[key]
            const label =
              config?.label ||
              key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

            return (
              <article key={key} className="space-y-2">
                <p className="text-muted-foreground">{label}</p>
                <h3 className="text-xl text-foreground/70 font-medium break-all">
                  {formatValue(key, value)}
                </h3>
              </article>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
