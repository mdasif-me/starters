import { getCookie, useCookieStorage } from '@/hooks/use-cookie-storage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toastManager } from '../../components/ui/toast'
import type { IUser } from '../auth/types'
import { infoApi } from './api'
import type { companyInfo } from './schema'

export const useInfo = () => {
  const token = getCookie<string>('token')
  const currentUser = getCookie<IUser>('user')

  const [, setUser] = useCookieStorage<IUser | null>('user', null, {
    path: '/',
  })

  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: companyInfo) => infoApi.addInformation(data),

    onSuccess: (data) => {
      queryClient.setQueryData(['user'], token)
      setUser({
        ...currentUser,
        company_info: data.edge.data,
      } as unknown as IUser)
      toastManager.add({
        title: 'Success',
        description: data.message,
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
