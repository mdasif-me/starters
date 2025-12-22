import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/withdrawals/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/withdrawals/"!</div>
}
