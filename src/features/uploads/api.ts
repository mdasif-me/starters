import type { IApiResponse } from '@/interface'
import { apiClient } from '@/lib/api-client'
import type { IUploadedFile } from './types'

export interface IListFilesParams {
  offset?: number
  limit?: number
}

export interface IListFilesResponse {
  data: IUploadedFile[]
  total: number
  offset: number
  limit: number
}

const buildQueryString = (params: IListFilesParams): string => {
  const queryParams = new URLSearchParams()
  if (params.offset !== undefined)
    queryParams.append('offset', String(params.offset))
  if (params.limit !== undefined)
    queryParams.append('limit', String(params.limit))
  return queryParams.toString()
}

// Helper function to get token from cookies
const getToken = (): string | null => {
  const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'))
  if (match) return match[2]
  return null
}

// Helper function to upload file with progress tracking using XMLHttpRequest
const uploadFileWithProgress = (
  file: File,
  endpoint: string,
  onProgress?: (progress: number) => void,
): Promise<IUploadedFile | IUploadedFile[]> => {
  const formData = new FormData()

  if (endpoint.includes('/f/m')) {
    formData.append('files', file)
  } else {
    formData.append('file', file)
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100)
        onProgress?.(percentComplete)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText)
          const fileData =
            response.edge?.data || response.edge || response.data || response
          resolve(fileData)
        } catch (error) {
          reject(new Error('Failed to parse upload response'))
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed due to network error'))
    })

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload was aborted'))
    })

    const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
    xhr.open('POST', `${baseUrl}${endpoint}`)

    const token = getToken()
    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }

    xhr.send(formData)
  })
}

export const uploadApi = {
  uploadFile: (
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<IUploadedFile> => {
    return uploadFileWithProgress(
      file,
      '/f/s',
      onProgress,
    ) as Promise<IUploadedFile>
  },

  uploadFiles: (
    files: File[],
    onProgress?: (progress: number) => void,
  ): Promise<IUploadedFile[]> => {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100)
          onProgress?.(percentComplete)
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText)
            // Handle wrapped API response - extract file data from edge/data property
            const filesData = response.edge || response.data || response
            resolve(filesData)
          } catch (error) {
            reject(new Error('Failed to parse upload response'))
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      })

      xhr.addEventListener('error', () => {
        reject(new Error('Upload failed due to network error'))
      })

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload was aborted'))
      })

      const baseUrl = import.meta.env.VITE_API_BASE_URL || '/api'
      xhr.open('POST', `${baseUrl}/f/m`)

      const token = getToken()
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`)
      }

      xhr.send(formData)
    })
  },

  listFiles: (
    params: IListFilesParams,
  ): Promise<IApiResponse<IListFilesResponse>> => {
    const queryString = buildQueryString(params)
    const endpoint = queryString ? `/f/g?${queryString}` : '/f/g'
    const token = getToken()
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined
    return apiClient.get<IApiResponse<IListFilesResponse>>(endpoint, {
      headers,
    })
  },

  deleteFile: (fileId: string): Promise<void> => {
    const token = getToken()
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined
    return apiClient.delete<void>(`/f/${fileId}`, {
      headers,
    })
  },

  deleteFiles: async (fileIds: string[]): Promise<void> => {
    if (fileIds.length === 0) return
    for (const fileId of fileIds) {
      await uploadApi.deleteFile(fileId)
    }
  },
}
