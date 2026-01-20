import type { IApiResponseSingle } from '@/interface'
import { apiClient } from '../../lib/api-client'
import type { ICompanyInfo } from './interface'
import type { TUpdateCompanyInfo, TUpdateProfile } from './schema'

export const profileApi = {
  updateProfile: (
    data: Partial<TUpdateProfile>,
  ): Promise<IApiResponseSingle<ICompanyInfo>> => {
    const payload = {
      company_info: { ...data },
    }
    return apiClient.patch<IApiResponseSingle<ICompanyInfo>>(
      `/u?scope=update_information`,
      payload,
    )
  },
  updateCompany: (
    data: Partial<TUpdateCompanyInfo>,
  ): Promise<IApiResponseSingle<ICompanyInfo>> => {
    const payload = { company_info: { ...data } }
    return apiClient.patch<IApiResponseSingle<ICompanyInfo>>(
      `/u?scope=update_information`,
      payload,
    )
  },
}
