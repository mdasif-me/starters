import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/revenue/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/revenue/"!</div>
}
