import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useProject } from '@/features/projects/hooks'
import { useParams } from '@tanstack/react-router'
import Allotment, { AllotmentSkeleton } from './allotment'
import Article from './article'
import BookingList from './booking-list'
import { Images } from './images'
import Info from './info'
import SalesList from './sales-list'
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
      <div className="flex items-start gap-4">
        <Card className="flex-1">
          <CardContent className="p-4">
            {isLoading
              ? Array(5)
                  .fill(null)
                  .map((_, idx) => (
                    <>
                      <AllotmentSkeleton key={idx} />
                      {idx !== 5 - 1 && <Separator className="my-4" />}
                    </>
                  ))
              : project?.allotments.map((allotment, idx) => (
                  <>
                    <Allotment
                      key={idx}
                      info={{
                        icon: allotment.icon,
                        name: allotment.name,
                        price: allotment.total_price,
                      }}
                      loading={isLoading}
                    />
                    {idx !== project.allotments.length - 1 && (
                      <Separator className="my-4" />
                    )}
                  </>
                ))}
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <SalesList />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <BookingList />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
