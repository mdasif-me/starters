import { BDTCurrencyIcon } from '@/assets/icon'
import { Skeleton } from '@/components/ui/skeleton'
import logo from '../../../../../../public/logo-icon.svg'
import type { IComponentProps } from '../../interface'

export default function Info({
  loading,
  info,
}: IComponentProps<{
  title: string
  name: string
  logo: string
  price: number
}>) {
  if (loading) {
    return (
      <div className="bg-muted lg:w-fit w-full p-2 rounded-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="w-fit flex items-center gap-2">
            <Skeleton className="size-12 shrink-0 rounded-lg" />
            <article className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-16" />
            </article>
          </div>
          <div className="w-full md:w-fit flex justify-center">
            <article className="space-y-2">
              <Skeleton className="h-3 w-24" />
              <div className="flex items-center gap-1">
                <Skeleton className="h-5 w-5 rounded-full" />{' '}
                <Skeleton className="h-7 w-20" />
              </div>
            </article>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-muted lg:w-fit w-full p-2 rounded-xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="w-fit flex items-center gap-2">
          <img
            src={info.logo || logo}
            alt="Project Info Placeholder"
            className="size-12 shrink-0 object-cover rounded-lg bg-white"
          />
          <article>
            <h2 className="text-base font-semibold leading-7">
              {info.title || 'Project Name'}
            </h2>
            <p className="text-xs text-muted-foreground">
              By {info.name || '0'}
            </p>
          </article>
        </div>
        <div className="w-full md:w-fit flex justify-center">
          <article>
            <p className="text-muted-foreground text-sm">Share Sell Start</p>
            <h1 className="flex items-start">
              <BDTCurrencyIcon size={18} className="text-primary" />
              <span className="bg-linear-to-t from-[#407AFF] to-[#74B5FF] text-transparent bg-clip-text inline-block font-bold text-xl">
                {info.price.toLocaleString('en-IN')}
              </span>
            </h1>
          </article>
        </div>
      </div>
    </div>
  )
}
