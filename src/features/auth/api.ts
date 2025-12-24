import { apiClient } from '../../lib/api-client'
import type {
  AuthVerifyCredentials,
  LoginCredentials,
  SignupCredentials,
} from './schemas'
import type { IAuthResponse, IUser } from './types'

export const authApi = {
  login: (data: LoginCredentials) => {
    return apiClient.post<IAuthResponse>('/a/otp/send', data)
  },

  signup: (data: SignupCredentials) => {
    return apiClient.post<IAuthResponse>('/a/otp/send', data)
  },

  resend: (data: SignupCredentials) => {
    return apiClient.post<IAuthResponse>('/a/otp/send', data)
  },

  verify: (data: AuthVerifyCredentials) => {
    return apiClient.post<IAuthResponse>('/a/otp/verify', data)
  },

  getUserProfile: () => {
    return apiClient.get<IUser>('/u/me')
  },

  logout: () => {
    /**
     * if server side invalidation exists
     * return apiClient.post('/auth/logout', {})
     */

    apiClient.removeToken()
    return Promise.resolve()
  },
}
