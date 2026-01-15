import { Button } from '@/components/ui/button'
import type { IUser } from '@/features/auth/types'
import {
  CardAreaChart,
  PendingSalesTable,
  SalesBarChart,
} from '@/features/index'
import InfoForm from '@/features/index/components/info-form'
import { getCookie } from '@/hooks/use-cookie-storage'
import { Icon } from '@/utils/icon'
import { File01Icon } from '@hugeicons-pro/core-stroke-rounded'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_authenticated/')({
  component: RouteComponent,
})

function RouteComponent() {
  const user: IUser | null = getCookie('user')
  const is_company: boolean = user?.company_info === null ? true : false

  if (is_company) {
    return (
      <div className="w-full flex justify-center braid-shape">
        <div className="w-fit h-fit mx-auto my-auto bg-white rounded-2xl shadow backdrop-blur">
          <InfoForm />
        </div>
      </div>
    )
  }

  const [selectedCard, setSelectedCard] = useState<
    'total_sales' | 'approved_sales' | 'pending_sales'
  >('total_sales')

  const handleCardClick = (
    cardType: 'total_sales' | 'approved_sales' | 'pending_sales',
  ) => {
    setSelectedCard(cardType)
  }
  const cardTypes = ['total_sales', 'approved_sales', 'pending_sales'] as const
  return (
    <div>
      <div className="flex items-center justify-between">
        <article>
          <h3 className="text-2xl font-semibold tracking-tight">
            Welcome back, Rakatul!
          </h3>
          <p className="leading-7 text-muted-foreground">
            Track and manage your property dashboard efficiently.
          </p>
        </article>
        <Button className="gradient-btn">
          <Icon
            icon={File01Icon}
            strokeWidth={2}
            size={20}
            className="size-4 text-white md:size-5"
          />
          Export PDF
        </Button>
      </div>
      <div className="flex flex-wrap justify-center items-center lg:gap-8 gap-2">
        {cardTypes.map((type) => (
          <CardAreaChart
            key={type}
            selectedCard={selectedCard}
            cardId={type}
            onClick={() => handleCardClick(type)}
          />
        ))}
      </div>

      <div className="space-y-10 mt-5">
        <SalesBarChart />
        <PendingSalesTable />
      </div>
    </div>
  )
}
