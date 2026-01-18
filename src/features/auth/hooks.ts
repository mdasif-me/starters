import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toastManager } from '../../components/ui/toast'
import { useCookieStorage } from '../../hooks/use-cookie-storage'
import { apiClient } from '../../lib/api-client'
import { authApi } from './api'
import type { AuthVerifyCredentials } from './schemas'
import { ERole, EScope, type IUser } from './types'

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
      if (data.status_code !== 200) {
        toastManager.add({
          title: 'Message',
          description: data.message,
          type: 'info',
        })
      } else {
        toastManager.add({
          title: 'Success',
          description: data.message,
          type: 'success',
        })
        navigate({ to: '/auth/verify' })
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
 * It will also store the user profile information in cookies for persistence.
 * It will show a success toast if the verification is successful, and an error
 * toast if the verification fails.
 */
export const useVerify = () => {
  const [, setUserInfo] = useCookieStorage<IUser | null>('user', null, {
    path: '/',
  })
  const [auth_verification] = useCookieStorage<AuthVerifyCredentials>(
    'auth_verification',
    {
      otp: '',
      phone_number: '',
      scope: EScope.REGISTER,
    },
    {
      path: '/',
    },
  )

  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: authApi.verify,
    onSuccess: async (data) => {
      if (auth_verification.scope !== EScope.REGISTER.toLowerCase()) {
        apiClient.setToken(data.access_token)
        const userResponse = await authApi.getUserProfile()
        const user = userResponse.edge.data

        setUserInfo(user)
        queryClient.setQueryData(['user'], user)
        toastManager.add({
          title: 'Success',
          description: data.message,
          type: 'success',
        })
        window.location.href = '/'
      } else {
        window.location.href = '/auth/login'
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
 * It will call the logout endpoint, clear the user data from the query client,
 * clear user info from cookies, and redirect the user to the login route.
 * It will also show a success toast if the logout is successful, and an error
 * toast if the logout fails.
 */
export const useLogout = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [, , removeUserCookie] = useCookieStorage<IUser | null>('user', null, {
    path: '/',
  })

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.setQueryData(['user'], null)
      removeUserCookie()
      navigate({ to: '/auth/login' })
    },
  })
}

/**
 * A hook to check user permissions and roles.
 * Currently provides dummy/hardcoded role checking.
 * TODO: Implement actual permission checking when auth system is fully implemented.
 */
export const usePermission = () => {
  const [user] = useCookieStorage<IUser | null>('user', null, {
    path: '/',
  })

  const hasRole = (roles: ERole[]): boolean => {
    if (!user) return false
    // For now, all authenticated users are treated as having at least USER role
    // This will be properly implemented when role management is added
    const userRole = (user.role || ERole.USER) as ERole
    return roles.includes(userRole)
  }

  const hasPermission = (_permission: string): boolean => {
    // TODO: Implement actual permission checking
    // For now, all authenticated users have all permissions
    return !!user
  }

  return {
    hasRole,
    hasPermission,
    user,
  }
}
