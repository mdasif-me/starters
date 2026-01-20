import { Card, CardContent } from '@/components/ui/card'
import type { IUser } from '@/features/auth/types'
import { companyInfoConfig } from '../utils/company-info-config'
import { formatValue } from '../utils/format-value'
import UpdateCompany from './update-company-info'

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
      <CardContent className="w-full md:p-4 p-2">
        <div className="flex w-full items-center justify-between relative">
          <h2 className="sm:text-2xl font-medium">Company Information</h2>
          <UpdateCompany />
        </div>
        <div className="grid md:grid-cols-3 grid-cols-2 w-full sm:mt-6 mt-3 md:gap-6 sm:gap-4 gap-2">
          {sortedEntries.map(([key, value]) => {
            const config = companyInfoConfig[key]
            const label =
              config?.label ||
              key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())

            return (
              <article key={key} className="space-y-2">
                <p className="text-muted-foreground md:text-base text-xs">
                  {label}
                </p>
                <h3 className="md:text-xl sm:text-base text-sm text-foreground/70 font-medium break-all">
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
