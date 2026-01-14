import { apiClient } from '../../lib/api-client'
import type { companyInfo } from './schema'
import type { IInfoResponse } from './types'

export const infoApi = {
  addInformation: (
    data: companyInfo,
    phone_number: string,
  ): Promise<IInfoResponse> => {
    return apiClient.post<IInfoResponse>(`/u/${phone_number}`, data)
  },
}
