import { File01Icon } from '@hugeicons-pro/core-stroke-rounded'
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '../components/ui/button'
import { Icon } from '../utils/icon'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
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
  )
}
