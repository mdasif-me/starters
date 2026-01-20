import type { IApiResponse } from '@/interface'
import { apiClient } from '../../lib/api-client'
import type { ICompanyInfo } from './interface'
import type { TUpdateCompanyInfo, TUpdateProfile } from './schema'

export const profileApi = {
  //note: pid: means profile ID
  updateProfile: (
    pid: string,
    data: Partial<TUpdateProfile>,
  ): Promise<IApiResponse<ICompanyInfo>> => {
    return apiClient.patch<IApiResponse<ICompanyInfo>>(`/p/${pid}`, data)
  },
  updateCompany: (
    pid: string,
    data: Partial<TUpdateCompanyInfo>,
  ): Promise<IApiResponse<ICompanyInfo>> => {
    return apiClient.patch<IApiResponse<ICompanyInfo>>(`/p/${pid}`, data)
  },
}
