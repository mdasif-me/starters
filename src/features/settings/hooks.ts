import { toastManager } from '@/components/ui/toast'
import { useCookieStorage } from '@/hooks/use-cookie-storage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { IUser } from '../auth/types'
import { profileApi } from './api'
import type { TUpdateCompanyInfo, TUpdateProfile } from './schema'

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const [, setUser] = useCookieStorage<IUser | null>('user', null, {
    path: '/',
  })
  return useMutation({
    mutationFn: ({ data }: { data: Partial<TUpdateProfile> }) => {
      const mergedData: Partial<TUpdateProfile> = {}
      if (data.logo) {
        mergedData.logo = data.logo
      }
      return profileApi.updateProfile(mergedData)
    },
    onSuccess: (response, variables) => {
      if (response.status_code !== 200) {
        toastManager.add({
          title: 'Message',
          description: response.message,
          type: 'info',
        })
      } else {
        const currentUser = queryClient.getQueryData<IUser>(['user'])
        const submittedData = variables?.data
        if (!submittedData || !currentUser) return
        const updatedUser: IUser = {
          ...currentUser,
          company_info: {
            ...currentUser?.company_info,
            logo: submittedData.logo || currentUser?.company_info?.logo,
          },
        } as unknown as IUser

        queryClient.setQueryData(['user'], updatedUser)
        setUser(updatedUser)
        toastManager.add({
          title: 'Success',
          description: response.message,
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
  const queryClient = useQueryClient()
  const [, setUser] = useCookieStorage<IUser | null>('user', null, {
    path: '/',
  })
  return useMutation({
    mutationFn: ({ data }: { data: Partial<TUpdateCompanyInfo> }) => {
      const currentUser = queryClient.getQueryData<IUser>(['user'])
      const mergedData: Partial<TUpdateCompanyInfo> = {
        website: data.website || currentUser?.company_info?.website,
        mailing_address:
          data.mailing_address || currentUser?.company_info?.mailing_address,
        registered_address:
          data.registered_address ||
          currentUser?.company_info?.registered_address,
      }
      return profileApi.updateCompany(mergedData)
    },
    onSuccess: (response, variables) => {
      if (response.status_code !== 200) {
        toastManager.add({
          title: 'Message',
          description: response.message,
          type: 'info',
        })
      } else {
        const currentUser = queryClient.getQueryData<IUser>(['user'])
        const submittedData = variables?.data
        if (!submittedData || !currentUser) return
        const updatedUser: IUser = {
          ...currentUser,
          company_info: {
            ...currentUser?.company_info,
            website:
              submittedData.website || currentUser?.company_info?.website,
            mailing_address:
              submittedData.mailing_address ||
              currentUser?.company_info?.mailing_address,
            registered_address:
              submittedData.registered_address ||
              currentUser?.company_info?.registered_address,
          },
        } as unknown as IUser
        queryClient.setQueryData(['user'], updatedUser)
        setUser(updatedUser)
        toastManager.add({
          title: 'Success',
          description: response.message,
          type: 'success',
        })
        window.location.reload()
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
