import { apiClient } from '@/lib/api-client'
import type {
  AuthVerifyCredentials,
  LoginCredentials,
  SignupCredentials,
} from './schemas'
import type { IAuthResponse, IUserResponse } from './types'

export const authApi = {
  login: (data: LoginCredentials): Promise<IAuthResponse> => {
    return apiClient.post<IAuthResponse>('/a/otp/send', data)
  },

  signup: (data: SignupCredentials): Promise<IAuthResponse> => {
    return apiClient.post<IAuthResponse>('/a/otp/send', data)
  },

  resend: (data: SignupCredentials): Promise<IAuthResponse> => {
    return apiClient.post<IAuthResponse>('/a/otp/send', data)
  },

  verify: (data: AuthVerifyCredentials): Promise<IAuthResponse> => {
    return apiClient.post<IAuthResponse>('/a/otp/verify', data)
  },

  getUserProfile: (): Promise<IUserResponse> => {
    return apiClient.get<IUserResponse>('/u?scope=retrieve_information')
  },

  logout: () => {
    apiClient.removeToken()
    return Promise.resolve()
  },
}
