import { Skeleton } from '@/components/ui/skeleton'
import type { IComponentProps } from '../../interface'

export default function Share({
  loading,
  info,
}: IComponentProps<{ total_shares: number; remaining_shares: number }>) {
  if (loading) {
    return (
      <article className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-7 w-16" />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-16" />
        </div>
      </article>
    )
  }
  return (
    <article className="w-full">
      <p className="w-full flex items-center font-medium text-sm justify-between">
        Total Share{' '}
        <span className="text-xl font-semibold">
          {info?.total_shares.toLocaleString('en-IN') || 0}
        </span>
      </p>
      <p className="w-full flex items-center font-medium text-sm justify-between">
        Available Share{' '}
        <span className="text-xl font-semibold">
          {info?.remaining_shares.toLocaleString('en-IN') || 0}
        </span>
      </p>
    </article>
  )
}
