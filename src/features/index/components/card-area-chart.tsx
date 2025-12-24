'use client'

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart'
import { SaleTag02Icon } from '@hugeicons-pro/core-solid-rounded'
import { Area, AreaChart, XAxis } from 'recharts'
import { formatMoney } from '../../../utils/format-money'
import { Icon } from '../../../utils/icon'

// Digital Marketing Impressions data for different periods (in thousands)
const impressionsData = {
  '5D': [
    { period: 'Mon', impressions: 145.2 },
    { period: 'Tue', impressions: 298.7 },
    { period: 'Wed', impressions: 356.4 },
    { period: 'Thu', impressions: 289.1 },
    { period: 'Fri', impressions: 412.8 },
  ],
  '2W': [
    { period: 'W1', impressions: 1245.5 },
    { period: 'W2', impressions: 1687.3 },
    { period: 'W3', impressions: 1354.9 },
    { period: 'W4', impressions: 1892.6 },
    { period: 'W5', impressions: 1456.2 },
    { period: 'W6', impressions: 2134.7 },
  ],
  '1M': [
    { period: 'W1', impressions: 3245.5 },
    { period: 'W2', impressions: 4187.3 },
    { period: 'W3', impressions: 3654.9 },
    { period: 'W4', impressions: 4892.6 },
    { period: 'W5', impressions: 4156.2 },
    { period: 'W6', impressions: 5234.7 },
    { period: 'W7', impressions: 4823.1 },
    { period: 'W8', impressions: 5567.4 },
  ],
  '6M': [
    { period: 'Jan', impressions: 18745.3 },
    { period: 'Feb', impressions: 22187.7 },
    { period: 'Mar', impressions: 19654.2 },
    { period: 'Apr', impressions: 25892.8 },
    { period: 'May', impressions: 23456.6 },
    { period: 'Jun', impressions: 27234.4 },
  ],
}

const chartConfig = {
  impressions: {
    label: 'Impressions',
    color: '#fff',
  },
} satisfies ChartConfig

// Custom Tooltip
interface TooltipProps {
  active?: boolean
  payload?: Array<{
    value: number
  }>
  label?: string
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const value = payload[0].value
    return (
      <div className="bg-zinc-900 text-white px-3 py-2 rounded-lg text-sm font-medium shadow-lg">
        ${(value / 1000).toFixed(1)}M USD
      </div>
    )
  }
  return null
}

export default function CardAreaChart({
  selectedCard,
  onClick,
  cardId,
}: {
  selectedCard: 'total_sales' | 'approved_sales' | 'pending_sales'
  onClick: () => void
  cardId: 'total_sales' | 'approved_sales' | 'pending_sales'
}) {
  const isSelected = selectedCard === cardId
  return (
    <div
      onClick={onClick}
      className={`card-container ${isSelected ? 'card-selected' : ''} max-w-96 w-full h-full`}
    >
      <div className="h-32 mb-0 w-full z-30 p-3">
        <div className="flex items-center justify-between text-white -mt-9">
          <div className="flex items-center gap-2">
            <div className={'card-chip'}>
              <Icon
                icon={SaleTag02Icon}
                className="h-4 w-4 text-white sm:h-5 sm:w-5"
              />
            </div>
            <article>
              <p className="text-sm font-semibold">Monthly Sales</p>
              <p className="text-xs text-muted">Sales In September</p>
            </article>
          </div>
          <p className={'card-chip'}>+23%</p>
        </div>
        <h1 className="text-white w-full truncate text-3xl font-semibold tracking-tight mt-2">
          {formatMoney(887474)}
        </h1>

        <ChartContainer
          config={chartConfig}
          className="h-full w-full rounded-b-3xl overflow-hidden [&_.recharts-curve.recharts-tooltip-cursor]:stroke-initial"
        >
          <AreaChart
            data={impressionsData['5D']}
            margin={{
              top: 10,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="impressionsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={chartConfig.impressions.color}
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.impressions.color}
                  stopOpacity={0.1}
                />
              </linearGradient>

              <filter
                id="activeDotShadow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feDropShadow
                  dx="2"
                  dy="2"
                  stdDeviation="4"
                  floodColor={chartConfig.impressions.color}
                  floodOpacity="0.6"
                />
              </filter>
            </defs>

            <XAxis dataKey="period" hide />

            <ChartTooltip
              content={<CustomTooltip />}
              cursor={{
                strokeWidth: 1,
                strokeDasharray: '2 2',
                stroke: chartConfig.impressions.color,
                strokeOpacity: 1,
              }}
            />

            <Area
              dataKey="impressions"
              type="natural"
              fill="url(#impressionsGradient)"
              stroke={chartConfig.impressions.color}
              strokeWidth={2}
              dot={{
                r: 4,
                fill: chartConfig.impressions.color,
                stroke: 'white',
                strokeWidth: 2,
                filter: 'url(#activeDotShadow)',
              }}
              activeDot={{
                r: 6,
                fill: chartConfig.impressions.color,
                stroke: 'white',
                strokeWidth: 2,
                filter: 'url(#activeDotShadow)',
              }}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}
