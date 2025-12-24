import { apiClient } from '../../lib/api-client'
import type {
  AuthVerifyCredentials,
  LoginCredentials,
  SignupCredentials,
} from './schemas'
import type { AuthResponse, User } from './types'

export const authApi = {
  login: (data: LoginCredentials) => {
    return apiClient.post<AuthResponse>('/a/otp/send', data)
  },

  signup: (data: SignupCredentials) => {
    return apiClient.post<AuthResponse>('/a/otp/send', data)
  },

  resend: (data: SignupCredentials) => {
    return apiClient.post<AuthResponse>('/a/otp/send', data)
  },

  verify: (data: AuthVerifyCredentials) => {
    return apiClient.post<AuthResponse>('/a/otp/verify', data)
  },

  getUserProfile: () => {
    return apiClient.get<User>('/u/me')
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
