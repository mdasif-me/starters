import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toastManager } from '../../components/ui/toast'
import { useCookieStorage } from '../../hooks/use-cookie-storage'
import { apiClient } from '../../lib/api-client'
import { authApi } from './api'

/**
 * A hook to login a user.
 * It will call the login endpoint, set the token to the api client and
 * update the user data in the query client.
 * It will also show a success toast if the login is successful, and an error
 * toast if the login fails.
 */
export const useLogin = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      toastManager.add({
        title: 'Success',
        description: data.message,
        type: 'success',
      })
      navigate({ to: '/auth/verify' })
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error',
        description: error.message,
        type: 'error',
      })
    },
  })
}

/**
 * A hook to signup a user.
 * It will call the signup endpoint, set the token to the api client and
 * update the user data in the query client.
 * It will also show a success toast if the signup is successful, and an error
 * toast if the signup fails.
 */
export const useSignup = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      toastManager.add({
        title: 'Success',
        description: data.message,
        type: 'success',
      })
      navigate({ to: '/auth/verify' })
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error',
        description: error.message,
        type: 'error',
      })
    },
  })
}

/**
 * A hook to verify a user.
 * It will call the verify endpoint, set the token to the api client,
 * update the user data in the query client and cookie storage.
 * It will also show a success toast if the verification is successful, and an error
 * toast if the verification fails. If the verification fails, it will also redirect
 * the user to the root route.
 */
export const useVerify = () => {
  const [, setToken] = useCookieStorage<string | null>('token', null, {
    path: '/',
  })

  const [, setUser] = useCookieStorage<string | null>('user', null, {
    path: '/',
  })
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.verify,
    onSuccess: async (data) => {
      apiClient.setToken(data.access_token)
      const userResponse = await authApi.getUserProfile()
      const user = userResponse.edge.data
      setToken(data.access_token)
      setUser(JSON.stringify(user))
      queryClient.setQueryData(['user'], user)
      toastManager.add({
        title: 'Success',
        description: data.message,
        type: 'success',
      })
      navigate({ to: '/' })
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error',
        description: error.message,
        type: 'error',
      })
    },
  })
}

/**
 * A hook to resend a verification OTP.
 * It will call the resend endpoint, passing the required phone number and scope.
 * It will also show a success toast if the resend is successful, and an error
 * toast if the resend fails.
 * @returns A mutation hook to resend a verification OTP.
 */
export const useResend = () => {
  return useMutation({
    mutationFn: authApi.resend,
    onSuccess: (data) => {
      toastManager.add({
        title: 'Success',
        description: data.message || 'Verification code resent successfully.',
        type: 'success',
      })
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error',
        description: error.message,
        type: 'error',
      })
    },
  })
}

/**
 * A hook to logout a user.
 * It will call the logout endpoint, clear the user data from the query client and
 * redirect the user to the login route.
 * It will also show a success toast if the logout is successful, and an error
 * toast if the logout fails.
 */
export const useLogout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null)
      navigate({ to: '/auth/login' })
    },
  })
}
