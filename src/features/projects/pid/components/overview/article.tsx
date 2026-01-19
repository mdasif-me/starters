import { Skeleton } from '@/components/ui/skeleton'
import type { IComponentProps } from '../../interface'

export default function Article({ info, loading }: IComponentProps<string>) {
  if (loading) {
    return (
      <article className="w-full">
        <h2 className="text-base font-semibold leading-12">About Project</h2>
        <div className="mt-2 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[40%]" />
        </div>
      </article>
    )
  }

  return (
    <article>
      <h2 className="text-base font-semibold leading-12">About Project</h2>
      <p className="text-sm leading-6 whitespace-pre-line text-muted-foreground">
        {info}
      </p>
    </article>
  )
}
