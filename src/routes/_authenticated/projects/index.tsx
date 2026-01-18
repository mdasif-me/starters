import ProjectsLists from '@/features/projects/components/projects-lists'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/projects/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      <ProjectsLists />
    </div>
  )
}
