import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { Skeleton } from '@/components/ui/skeleton'
import type { IComponentProps } from '../../interface'

export function Images({ loading, info }: IComponentProps<string[]>) {
  if (loading) {
    return (
      <div className="w-full max-w-sm">
        <div className="flex aspect-square items-center justify-center">
          <Skeleton className="aspect-square h-full w-full rounded-xl" />
        </div>
      </div>
    )
  }

  return (
    <Carousel className="w-full max-w-sm">
      <CarouselContent>
        {info?.map((image, index) => (
          <CarouselItem key={index}>
            <div className="flex aspect-square items-center justify-center">
              <img
                src={image || ''}
                alt={`Project Image ${index + 1}`}
                className="h-full w-full object-cover rounded-xl"
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}
