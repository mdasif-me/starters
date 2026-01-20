import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsPanel, TabsTab } from '@/components/ui/tabs'
import {
  Agents,
  Clients,
  Overview,
  Sales,
} from '@/features/projects/pid/components'

import { createFileRoute, Link } from '@tanstack/react-router'
import { ChevronLeftIcon, PencilLineIcon } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/projects/$pid/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between w-full">
        <div className="flex items-center md:gap-4 gap-2">
          <Link
            to={'/projects'}
            className="bg-muted/50 flex items-center justify-center rounded-full md:size-12 shadow border shrink-0 size-8"
          >
            <ChevronLeftIcon
              className="text-foreground md:size-8 size-6"
              size={32}
            />
          </Link>
          <article>
            <h1 className="md:text-2xl font-semibold md:leading-8">
              Projects Informations
            </h1>
            <p className="text-muted-foreground md:text-sm text-xs">
              Track and manage your projects
            </p>
          </article>
        </div>
        <Button
          className="gradient-btn md:size-fit size-10"
          title="Edit Project"
          aria-label="edit-project"
        >
          <PencilLineIcon />
          <span className="md:block hidden">Edit Project</span>
        </Button>
      </header>
      <Tabs defaultValue="overview">
        <div className="border-b">
          <TabsList variant="underline">
            <TabsTab value="overview">Overview</TabsTab>
            <TabsTab value="sales">Sales</TabsTab>
            <TabsTab value="agents">Agents</TabsTab>
            <TabsTab value="clients">Clients</TabsTab>
          </TabsList>
        </div>
        <TabsPanel value="overview">
          <Overview />
        </TabsPanel>
        <TabsPanel value="sales">
          <Sales />
        </TabsPanel>
        <TabsPanel value="agents">
          <Agents />
        </TabsPanel>
        <TabsPanel value="clients">
          <Clients />
        </TabsPanel>
      </Tabs>
    </div>
  )
}
