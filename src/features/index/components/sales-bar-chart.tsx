'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
} from '@hugeicons-pro/core-stroke-rounded'
import * as React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { Button } from '../../../components/ui/button'
import { Icon } from '../../../utils/icon'

export const description = 'An interactive bar chart'

const chartData = [
  { date: '2025-06-01', sales: 178 },
  { date: '2025-06-02', sales: 470 },
  { date: '2025-06-03', sales: 103 },
  { date: '2025-06-04', sales: 439 },
  { date: '2025-06-05', sales: 88 },
  { date: '2025-06-06', sales: 294 },
  { date: '2025-06-07', sales: 323 },
  { date: '2025-06-08', sales: 385 },
  { date: '2025-06-09', sales: 438 },
  { date: '2025-06-10', sales: 155 },
  { date: '2025-06-11', sales: 92 },
  { date: '2025-06-12', sales: 492 },
  { date: '2025-06-13', sales: 81 },
  { date: '2025-06-14', sales: 426 },
  { date: '2025-06-15', sales: 307 },
  { date: '2025-06-16', sales: 371 },
  { date: '2025-06-17', sales: 475 },
  { date: '2025-06-18', sales: 107 },
  { date: '2025-06-19', sales: 341 },
  { date: '2025-06-20', sales: 408 },
  { date: '2025-06-21', sales: 169 },
  { date: '2025-06-22', sales: 317 },
  { date: '2025-06-23', sales: 480 },
  { date: '2025-06-24', sales: 132 },
  { date: '2025-06-25', sales: 141 },
  { date: '2025-06-26', sales: 434 },
  { date: '2025-06-27', sales: 448 },
  { date: '2025-06-28', sales: 149 },
  { date: '2025-06-29', sales: 103 },
  { date: '2025-06-30', sales: 446 },
]

const chartConfig = {
  sales: {
    label: 'Sales',
    color: 'var(--primary)',
  },
} satisfies ChartConfig

export default function SalesBarChart() {
  const [activeMonth, setActiveMonth] = React.useState<number>(
    new Date().getMonth(),
  )
  const [activeYear, setActiveYear] = React.useState<number>(
    new Date().getFullYear(),
  )

  const month = React.useMemo(() => {
    return new Date(activeYear, activeMonth).toLocaleString('default', {
      month: 'long',
    })
  }, [activeMonth, activeYear])

  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('sales')

  const total = React.useMemo(
    () => ({
      sales: chartData.reduce((acc, curr) => acc + curr.sales, 0),
    }),
    [],
  )
  /**
   * handle month change (previous and next)
   * previous month allow only (current month to january)
   * next month maximum allow only current month
   */
  const handleChangeMonth = (direction: 'prev' | 'next') => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    if (direction === 'prev') {
      if (activeMonth === 0) {
        setActiveMonth(11)
        setActiveYear((prev) => prev - 1)
      } else {
        setActiveMonth((prev) => prev - 1)
      }
    }

    if (direction === 'next') {
      if (activeMonth === currentMonth && activeYear === currentYear) return

      if (activeMonth === 11) {
        setActiveMonth(0)
        setActiveYear((prev) => prev + 1)
      } else {
        setActiveMonth((prev) => prev + 1)
      }
    }
  }

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>
            Monthly Sales ( {month} {activeYear} )
          </CardTitle>
          <CardDescription>
            Showing total sales for the month of {month} {activeYear}
          </CardDescription>
        </div>
        <div className="flex">
          {['sales'].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <div key={chart} className="flex flex-wrap">
                <div className="flex items-center gap-2 px-4">
                  <Button
                    size={'lg'}
                    variant="outline"
                    mode="icon"
                    onClick={() => handleChangeMonth('prev')}
                  >
                    <Icon
                      icon={ArrowLeft01Icon}
                      strokeWidth={2}
                      size={24}
                      className="shrink-0 size-6 text-muted-foreground"
                    />
                  </Button>
                  <Button
                    size={'lg'}
                    variant="outline"
                    mode="icon"
                    onClick={() => handleChangeMonth('next')}
                  >
                    <Icon
                      icon={ArrowRight01Icon}
                      strokeWidth={2}
                      size={24}
                      className="shrink-0 size-6 text-muted-foreground"
                    />
                  </Button>
                </div>
                <button
                  data-active={activeChart === chart}
                  className="data-[active=true]:bg-muted/50 relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                  onClick={() => setActiveChart(chart)}
                >
                  <span className="text-muted-foreground text-xs">
                    {chartConfig[chart].label}
                  </span>
                  <span className="text-lg leading-none font-bold sm:text-3xl">
                    {total[key as keyof typeof total].toLocaleString()}
                  </span>
                </button>
              </div>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-72 w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 5,
              right: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="4 8"
              stroke="var(--ring)"
              strokeOpacity={1}
              horizontal={true}
              vertical={false}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: 'var(--text-muted-foreground)' }}
              tickFormatter={(value) => `৳${value}`}
              domain={[0, 60]}
              tickMargin={10}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              radius={8}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-40"
                  nameKey="sales"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  }}
                />
              }
            />
            <Bar
              radius={[50, 50, 0, 0]}
              dataKey={activeChart}
              fill={`var(--color-${activeChart})`}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
