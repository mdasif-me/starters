'use client'

import { toastManager } from '@/components/ui/toast'
import { uploadApi } from '@/features/uploads/api'
import type { IUploadedFile, IUploadProgress } from '@/features/uploads/types'
import { useCallback, useState } from 'react'

export interface IUseUploadReturn {
  state: IUploadProgress
  uploadFile: (
    file: File,
    onProgress?: (progress: number) => void,
  ) => Promise<IUploadedFile | null>
  uploadFiles: (files: File[]) => Promise<IUploadedFile[] | null>
  reset: () => void
  resetError: () => void
}

export function useUpload(): IUseUploadReturn {
  const [state, setState] = useState<IUploadProgress>({
    file: null,
    progress: 0,
    status: 'idle',
    error: null,
    uploadedFile: null,
  })

  const uploadFile = useCallback(
    async (
      file: File,
      onProgress?: (progress: number) => void,
    ): Promise<IUploadedFile | null> => {
      setState((prev: IUploadProgress) => ({
        ...prev,
        file,
        status: 'uploading',
        progress: 0,
        error: null,
      }))

      try {
        const uploadedFile = await uploadApi.uploadFile(
          file,
          (progress: number) => {
            console.log(`[${file.name}] Upload progress: ${progress}%`)
            setState((prev: IUploadProgress) => ({
              ...prev,
              progress,
            }))
            // Pass progress to component
            onProgress?.(progress)
          },
        )

        setState((prev: IUploadProgress) => ({
          ...prev,
          status: 'completed',
          progress: 100,
          uploadedFile,
        }))

        console.log(`[${file.name}] Upload completed - 100%`)
        toastManager.add({
          title: 'Success',
          description: 'File uploaded successfully!',
          type: 'success',
        })
        return uploadedFile
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed'

        setState((prev: IUploadProgress) => ({
          ...prev,
          status: 'error',
          error: errorMessage,
        }))

        toastManager.add({
          title: 'Error',
          description: errorMessage,
          type: 'error',
        })
        return null
      }
    },
    [],
  )

  const uploadFiles = useCallback(
    async (files: File[]): Promise<IUploadedFile[] | null> => {
      setState((prev: IUploadProgress) => ({
        ...prev,
        status: 'uploading',
        progress: 0,
        error: null,
      }))

      try {
        const results = await uploadApi.uploadFiles(
          files,
          (progress: number) => {
            console.log(`Upload progress: ${progress}%`)
            setState((prev: IUploadProgress) => ({
              ...prev,
              progress,
            }))
          },
        )

        setState((prev: IUploadProgress) => ({
          ...prev,
          status: 'completed',
          progress: 100,
        }))

        toastManager.add({
          title: 'Success',
          description: `${files.length} file(s) uploaded successfully!`,
          type: 'success',
        })
        return results
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed'

        setState((prev: IUploadProgress) => ({
          ...prev,
          status: 'error',
          error: errorMessage,
        }))

        toastManager.add({
          title: 'Error',
          description: errorMessage,
          type: 'error',
        })
        return null
      }
    },
    [],
  )

  const reset = useCallback(() => {
    setState({
      file: null,
      progress: 0,
      status: 'idle',
      error: null,
      uploadedFile: null,
    })
  }, [])

  const resetError = useCallback(() => {
    setState((prev: IUploadProgress) => ({
      ...prev,
      error: null,
    }))
  }, [])

  return {
    state,
    uploadFile,
    uploadFiles,
    reset,
    resetError,
  }
}
