import { toastManager } from '@/components/ui/toast'
import { useMutation, useQuery } from '@tanstack/react-query'
import type { IListFilesParams } from './api'
import { uploadApi } from './api'
import { validateFile } from './utils'
export { useUploadState, type IUploadOptions } from './hooks/use-upload-state'

export const useUploadFile = () => {
  return useMutation({
    mutationFn: async ({
      file,
      onProgress,
    }: {
      file: File
      onProgress?: (progress: number) => void
    }) => {
      const validation = validateFile(file)
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid file')
      }

      return uploadApi.uploadFile(file, onProgress)
    },
    onSuccess: () => {
      toastManager.add({
        title: 'Success',
        description: 'File uploaded successfully!',
        type: 'success',
      })
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Upload failed',
        type: 'error',
      })
    },
  })
}

export const useUploadFiles = () => {
  return useMutation({
    mutationFn: async ({
      files,
      onProgress,
    }: {
      files: File[]
      onProgress?: (progress: number) => void
    }) => {
      for (const file of files) {
        const validation = validateFile(file)
        if (!validation.valid) {
          throw new Error(`${file.name}: ${validation.error || 'Invalid file'}`)
        }
      }

      return uploadApi.uploadFiles(files, onProgress)
    },
    onSuccess: (data) => {
      toastManager.add({
        title: 'Success',
        description: `${Array.isArray(data) ? data.length : 1} file(s) uploaded successfully!`,
        type: 'success',
      })
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Upload failed',
        type: 'error',
      })
    },
  })
}

export const useListFiles = (params: IListFilesParams) => {
  return useQuery({
    queryKey: ['files', params.offset, params.limit],
    queryFn: () => uploadApi.listFiles(params),
    staleTime: 5 * 60 * 1000,
  })
}

export const useDeleteFile = () => {
  return useMutation({
    mutationFn: uploadApi.deleteFile,
    onSuccess: () => {
      toastManager.add({
        title: 'Success',
        description: 'File deleted successfully!',
        type: 'success',
      })
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Delete failed',
        type: 'error',
      })
    },
  })
}

export const useDeleteFiles = () => {
  return useMutation({
    mutationFn: uploadApi.deleteFiles,
    onSuccess: () => {
      toastManager.add({
        title: 'Success',
        description: 'Files deleted successfully!',
        type: 'success',
      })
    },
    onError: (error) => {
      toastManager.add({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Delete failed',
        type: 'error',
      })
    },
  })
}
