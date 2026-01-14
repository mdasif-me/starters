import { apiClient } from '../../lib/api-client'
import type {
  AuthVerifyCredentials,
  LoginCredentials,
  SignupCredentials,
} from './schemas'
import type { IAuthResponse } from './types'

export const authApi = {
  /**
   * Login with phone number.
   * @param {LoginCredentials} data - Phone number and scope.
   * @returns {Promise<IAuthResponse>} - Promise with auth response.
   */
  login: (data: LoginCredentials): Promise<IAuthResponse> => {
    return apiClient.post<IAuthResponse>('/a/otp/send', data)
  },

  /**
   * Signup with phone number and scope.
   * @param {SignupCredentials} data - Phone number and scope.
   * @returns {Promise<IAuthResponse>} - Promise with auth response.
   */
  signup: (data: SignupCredentials): Promise<IAuthResponse> => {
    return apiClient.post<IAuthResponse>('/a/otp/send', data)
  },

  /**
   * Resend a verification OTP.
   * @param {SignupCredentials} data - Phone number and scope.
   * @returns {Promise<IAuthResponse>} - Promise with auth response.
   */
  resend: (data: SignupCredentials): Promise<IAuthResponse> => {
    return apiClient.post<IAuthResponse>('/a/otp/send', data)
  },

  /**
   * Verify a user with phone number and OTP.
   * @param {AuthVerifyCredentials} data - Phone number and OTP.
   * @returns {Promise<IAuthResponse>} - Promise with auth response.
   */
  verify: (data: AuthVerifyCredentials): Promise<IAuthResponse> => {
    return apiClient.post<IAuthResponse>('/a/otp/verify', data)
  },

  /**
   * Get the user profile.
   * @returns {Promise<IAuthResponse>} - Promise with user response.
   */
  getUserProfile: (): Promise<IAuthResponse> => {
    return apiClient.get<IAuthResponse>('/u/me')
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
