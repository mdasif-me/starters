import { getCookie, useCookieStorage } from '@/hooks/use-cookie-storage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toastManager } from '../../components/ui/toast'
import type { IUser } from '../auth/types'
import { infoApi } from './api'
import type { companyInfo } from './schema'

export const useInfo = () => {
  const currentUser = getCookie<IUser>('user')

  const [, setUser] = useCookieStorage<IUser | null>('user', null, {
    path: '/',
  })

  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: companyInfo) => infoApi.addInformation(data),

    onSuccess: (data) => {
      const updatedUser: IUser = {
        ...currentUser,
        company_info: data.edge.data,
      } as unknown as IUser

      queryClient.setQueryData(['user'], updatedUser)
      setUser(updatedUser)
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
