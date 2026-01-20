import { apiClient } from '../../lib/api-client'
import type { IUserResponse } from '../auth/types'
import type { companyInfo } from './schema'

export const infoApi = {
  addInformation: (data: companyInfo): Promise<IUserResponse> => {
    const payload = {
      company_info: { ...data },
    }
    return apiClient.patch<IUserResponse>(
      `/u?scope=update_information`,
      payload,
    )
  },
}
