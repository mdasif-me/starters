import { File01Icon } from '@hugeicons-pro/core-stroke-rounded'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import CardAreaChart from '@/components/card-area-chart'
import { Button } from '@/components/ui/button'
import { Icon } from '@/utils/icon'
import SalesBarChart from '@/components/sales-bar-chart'

export const Route = createFileRoute('/_authenticated/')({
  component: RouteComponent,
})

function RouteComponent() {
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

      <div>
        <SalesBarChart />
      </div>
    </div>
  )
}
