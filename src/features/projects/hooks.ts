import { toastManager } from '@/components/ui/toast'
import { useMutation, useQuery } from '@tanstack/react-query'
import { projectApi } from './api'
import type { IListProjectsParams } from './interface'
import type { TCreateProject } from './schema'

export const useProjects = (params: IListProjectsParams = {}) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectApi.listProjects(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useProject = (pid: string) => {
  return useQuery({
    queryKey: ['project', pid],
    queryFn: () => projectApi.getProject(pid),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

export const useCreateProject = () => {
  return useMutation({
    mutationFn: projectApi.createProject,
    onSuccess: (data) => {
      if (data.status_code !== 201) {
        toastManager.add({
          title: 'Message',
          description: data.message,
          type: 'info',
        })
      } else {
        toastManager.add({
          title: 'Success',
          description: data.message,
          type: 'success',
        })
      }
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error',
        description: error.message,
        type: 'error',
      })
    },
  })
}

export const useUpdateProject = () => {
  return useMutation({
    mutationFn: ({
      pid,
      data,
    }: {
      pid: string
      data: Partial<TCreateProject>
    }) => projectApi.updateProject(pid, data),
    onSuccess: (data) => {
      if (data.status_code !== 200) {
        toastManager.add({
          title: 'Message',
          description: data.message,
          type: 'info',
        })
      } else {
        toastManager.add({
          title: 'Success',
          description: data.message,
          type: 'success',
        })
      }
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error',
        description: error.message,
        type: 'error',
      })
    },
  })
}
