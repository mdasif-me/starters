import { toastManager } from '@/components/ui/toast'
import { useMutation } from '@tanstack/react-query'
import { profileApi } from './api'
import type { TUpdateCompanyInfo, TUpdateProfile } from './schema'

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: ({
      pid,
      data,
    }: {
      pid: string
      data: Partial<TUpdateProfile>
    }) => profileApi.updateProfile(pid, data),
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
export const useUpdateCompany = () => {
  return useMutation({
    mutationFn: ({
      pid,
      data,
    }: {
      pid: string
      data: Partial<TUpdateCompanyInfo>
    }) => profileApi.updateCompany(pid, data),
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
