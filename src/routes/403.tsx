import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/403')({
  component: ForbiddenPage,
})

function ForbiddenPage() {
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-bold text-red-500">403</h1>
        <h2 className="mt-4 text-2xl font-semibold text-gray-900">
          Access Denied
        </h2>
        <p className="mt-2 text-gray-600">
          You do not have permission to view this page.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
