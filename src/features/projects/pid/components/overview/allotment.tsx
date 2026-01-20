import { BDTCurrencyIcon } from '@/assets/icon'
import { Skeleton } from '@/components/ui/skeleton'
import type { IComponentProps } from '../../interface'

export default function Allotment({
  info,
}: IComponentProps<{
  icon: string
  name: string
  price: number
}>) {
  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex items-center gap-2">
        <img
          className="w-20 h-12 shrink-0 object-center rounded object-cover"
          src={info?.icon}
          alt={info?.name}
          aria-label="logo"
        />
        <h2 className="font-medium">{info?.name}</h2>
      </div>
      <h1 className="flex items-start">
        <BDTCurrencyIcon size={20} />
        <span className="text-xl font-bold">
          {info?.price.toLocaleString('en-IN')}
        </span>
      </h1>
    </div>
  )
}

export const AllotmentSkeleton = () => (
  <div className="flex w-full justify-between items-center">
    <div className="flex items-center gap-2">
      <Skeleton className="w-20 h-12 shrink-0 rounded" />
      <Skeleton className="h-5 w-32 rounded" />
    </div>

    <div className="flex items-center gap-1">
      <Skeleton className="h-5 w-5 rounded-full" />
      <Skeleton className="h-7 w-16" />
    </div>
  </div>
)
