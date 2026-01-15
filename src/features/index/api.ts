import { apiClient } from '../../lib/api-client'
import type { companyInfo } from './schema'
import type { IInfoResponse } from './types'

export const infoApi = {
  addInformation: (data: companyInfo): Promise<IInfoResponse> => {
    const payload = {
      company_info: { ...data },
    }
    return apiClient.patch<IInfoResponse>(
      `/u?scope=update_information`,
      payload,
    )
  },
}
