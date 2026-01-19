import { Card, CardContent } from '@/components/ui/card'
import { useProject } from '@/features/projects/hooks'
import { useParams } from '@tanstack/react-router'
import Article from './article'
import { Images } from './images'
import Info from './info'
import Share from './share'

export default function OverviewRoot() {
  const { pid } = useParams({ strict: false })
  const { data, isLoading } = useProject(pid as string)

  const project = data?.edge.data

  return (
    <div>
      <Card>
        <CardContent className="p-4 flex items-center gap-6 flex-col md:flex-row">
          <Images loading={isLoading} info={project?.gallery || []} />
          <div className="w-full space-y-4">
            <Article info={project?.description || ''} loading={isLoading} />
            <Info
              info={{
                title: project?.title || '',
                logo: project?.company.profile_picture || '',
                name: project?.company.company_info.name || '',
                price: project?.share_price || 0,
              }}
              loading={isLoading}
            />
            <Share
              info={{
                total_shares: project?.total_shares || 0,
                remaining_shares: project?.remaining_shares || 0,
              }}
              loading={isLoading}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
