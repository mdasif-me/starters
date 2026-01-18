import type { IApiResponse } from '@/interface'
import { apiClient } from '../../lib/api-client'
import type { IListProjectsParams, IProjectList } from './interface'
import type { TAllotment, TCreateProject } from './schema'

const buildQueryString = (params: IListProjectsParams): string => {
  const queryParams = new URLSearchParams()
  if (params.offset !== undefined)
    queryParams.append('offset', String(params.offset))
  if (params.limit !== undefined)
    queryParams.append('limit', String(params.limit))
  if (params.search) queryParams.append('search', params.search)
  if (params.sort_by) queryParams.append('sort_by', params.sort_by)
  if (params.sort_order) queryParams.append('sort_order', params.sort_order)
  return queryParams.toString()
}

export const projectApi = {
  listProjects: (
    params: IListProjectsParams,
  ): Promise<IApiResponse<IProjectList>> => {
    const queryString = buildQueryString(params)
    const endpoint = queryString ? `/p/l?${queryString}` : '/p/l'
    return apiClient.get<IApiResponse<IProjectList>>(endpoint)
  },

  createProject: (
    data: TCreateProject,
  ): Promise<IApiResponse<IProjectList>> => {
    return apiClient.post<IApiResponse<IProjectList>>('/p/c', data)
  },

  updateProject: (
    pid: string,
    data: Partial<TAllotment>,
  ): Promise<IApiResponse<IProjectList>> => {
    return apiClient.put<IApiResponse<IProjectList>>(`/p/${pid}`, data)
  },
}
