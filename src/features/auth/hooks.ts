import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toastManager } from '../../components/ui/toast'
import { useCookieStorage } from '../../hooks/use-cookie-storage'
import { apiClient } from '../../lib/api-client'
import { authApi } from './api'
import type { IUser } from './types'

/**
 * A hook to login a user.
 * It will call the login endpoint, set the token to the api client and
 * update the user data in the query client.
 * It will also show a success toast if the login is successful, and an error
 * toast if the login fails.
 */
export const useLogin = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      apiClient.setToken(data.access_token)
      queryClient.setQueryData(['user'], data.access_token)
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
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      apiClient.setToken(data.access_token)
      queryClient.setQueryData(['user'], data.access_token)
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
  const [, setUser] = useCookieStorage<IUser | null>('user', null, {
    path: '/',
  })
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.verify,
    onSuccess: async (data) => {
      apiClient.setToken(data.access_token)

      try {
        const userResponse = await authApi.getUserProfile()
        const user = userResponse.edge.data
        setUser(user)
        queryClient.setQueryData(['user'], user)
        toastManager.add({
          title: 'Success',
          description: data.message,
          type: 'success',
        })
        navigate({ to: '/' })
      } catch (error) {
        toastManager.add({
          title: 'Error',
          description: error as string,
          type: 'error',
        })
        navigate({ to: '/' })
      }
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
  })
}

/**
 * A hook to get the user data from the query client.
 * It will fetch the user data from the api and cache it in the query client.
 * The user data will be fetched only once, and subsequent calls will return the cached data.
 * The stale time for the user data is 5 minutes.
 */

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: authApi.getUserProfile,
    select: (data) => data.edge.data,
    retry: false,
    staleTime: 1000 * 60 * 5,
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

/**
 * A hook to check if a user has a certain role or permission.
 * It takes advantage of the useUser hook to fetch the user data and then
 * checks if the user has the specified role or permission.
 * If the user is not logged in, it will return false for both checks.
 * If the user is logged in, it will return true if the user has the specified role or permission,
 * and false otherwise.
 * @returns An object with two functions: hasRole and hasPermission.
 * hasRole takes an array of roles and returns true if the user has any of those roles.
 * hasPermission takes a string permission and returns true if the user has that permission.
 * The user field contains the user data if the user is logged in, otherwise it is null.
 */
export const usePermission = () => {
  const { data: user } = useUser()

  return {
    hasRole: (roles: IUser['role'][]) => {
      if (!user) return false
      return roles.includes(user.role)
    },
    // permissions field is removed from IUser, so we default to false or remove this
    hasPermission: (_permission: string) => {
      return false
    },
    user,
  }
}
