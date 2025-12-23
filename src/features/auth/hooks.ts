import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { apiClient } from '../../lib/api-client'
import { authApi } from './api'
import type { User } from './types'

export const useLogin = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      apiClient.setToken(data.token)
      queryClient.setQueryData(['user'], data.user)
      navigate({ to: '/' })
    },
  })
}

export const useSignup = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.signup,
    onSuccess: (data) => {
      apiClient.setToken(data.token)
      queryClient.setQueryData(['user'], data.user)
      navigate({ to: '/' })
    },
  })
}

export const useVerify = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: authApi.verify,
    onSuccess: (data) => {
      apiClient.setToken(data.token)
      queryClient.setQueryData(['user'], data.user)
      navigate({ to: '/' })
    },
  })
}

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: authApi.getUserProfile,
    retry: false,
    staleTime: 1000 * 60 * 5,
  })
}

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

export const usePermission = () => {
  const { data: user } = useUser()

  return {
    hasRole: (roles: User['role'][]) => {
      if (!user) return false
      return roles.includes(user.role)
    },
    hasPermission: (permission: string) => {
      if (!user || !user.permissions) return false
      return user.permissions.includes(permission)
    },
    user,
  }
}
