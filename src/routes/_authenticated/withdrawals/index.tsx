import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/withdrawals/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/withdrawals/"!</div>
}
