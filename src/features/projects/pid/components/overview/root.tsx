import { Card, CardContent } from '@/components/ui/card'
import { useProject } from '@/features/projects/hooks'
import { useParams } from '@tanstack/react-router'
import Allotment from './allotment'
import Article from './article'
import { Images } from './images'
import Info from './info'
import Share from './share'

export default function OverviewRoot() {
  const { pid } = useParams({ strict: false })
  const { data, isLoading } = useProject(pid as string)

  const project = data?.edge.data

  const ProjectStats = (
    <div className="space-y-4">
      <Info
        loading={isLoading}
        info={{
          title: project?.title || '',
          logo: project?.company.profile_picture || '',
          name: project?.company.company_info.name || '',
          price: project?.share_price || 0,
        }}
      />
      <Share
        loading={isLoading}
        info={{
          total_shares: project?.total_shares || 0,
          remaining_shares: project?.remaining_shares || 0,
        }}
      />
    </div>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <Images loading={isLoading} info={project?.gallery || []} />
            <div className="flex-1 w-full space-y-4">
              <Article info={project?.description || ''} loading={isLoading} />
              <div className="hidden lg:block">{ProjectStats}</div>
            </div>
          </div>
          <div className="block lg:hidden mt-6">{ProjectStats}</div>
        </CardContent>
      </Card>
      <div>
        <Card>
          <CardContent className="p-4">
            {project?.allotments.map((allotment, idx) => (
              <Allotment
                key={idx}
                info={{
                  icon: allotment.icon,
                  name: allotment.name,
                  price: allotment.total_price,
                }}
                loading={isLoading}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
