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
    onSuccess: (response, submittedData) => {
      const updatedUser: IUser = {
        ...currentUser,
        company_info: { ...submittedData, verification_status: 'pending' },
      } as unknown as IUser

      queryClient.setQueryData(['user'], updatedUser)
      setUser(updatedUser)
      toastManager.add({
        title: 'Success',
        description: response.message,
        type: 'success',
      })
      window.location.reload()
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
