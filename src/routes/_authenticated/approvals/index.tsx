import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/approvals/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/approvals/"!</div>
}
