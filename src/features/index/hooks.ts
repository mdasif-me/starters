import { useCookieStorage } from '@/hooks/use-cookie-storage'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toastManager } from '../../components/ui/toast'
import { apiClient } from '../../lib/api-client'
import { infoApi } from './api'
import type { companyInfo } from './schema'

export const useInfo = () => {
  const [, setUser] = useCookieStorage('user', '', { path: '/' })

  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: companyInfo) => infoApi.addInformation(data),
    onSuccess: (data) => {
      apiClient.setToken(data.access_token)
      queryClient.setQueryData(['info'], data.access_token)
      setUser(JSON.stringify({ company_info: data }))
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
