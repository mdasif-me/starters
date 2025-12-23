import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/auth')({
  beforeLoad: ({ context }) => {
    const { auth } = context
    const user = auth.getUser()
    if (user) {
      throw redirect({
        to: '/',
      })
    }
  },
  component: () => <Outlet />,
})
