'use client'

import { uploadApi } from '@/features/uploads/api'
import type {
  IFileMetadata,
  IFileUploadItem,
  IFileWithPreview,
} from '@/features/uploads/types'
import { formatBytes, useUploadManager } from '@/hooks/use-upload-manager'
import { useState } from 'react'
import { useUploadFile } from '../hooks'

export interface IUploadOptions {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  initialFiles?: IFileMetadata[]
  onFilesChange?: (files: IFileWithPreview[]) => void
  onUploadComplete?: (assetIds: string[], fileUrls: string[]) => void
}

export function useUploadState({
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024,
  accept = '*',
  multiple = true,
  initialFiles = [],
  onFilesChange,
  onUploadComplete,
}: IUploadOptions = {}) {
  const defaultUploadFiles: IFileUploadItem[] = initialFiles.map((file) => ({
    id: file.id,
    file: {
      name: file.name,
      size: file.size,
      type: file.type,
    } as File,
    preview: file.url,
    progress: 100,
    status: 'completed' as const,
  }))

  const [uploadFiles, setUploadFiles] =
    useState<IFileUploadItem[]>(defaultUploadFiles)
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set())
  const { mutateAsync: uploadFile } = useUploadFile()

  const [
    { isDragging, errors },
    {
      removeFile,
      clearFiles,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useUploadManager({
    maxFiles,
    maxSize,
    accept,
    multiple,
    initialFiles,
    onFilesChange: (newFiles: IFileWithPreview[]) => {
      const newUploadFiles = newFiles.map((file: IFileWithPreview) => {
        const existingFile = uploadFiles.find(
          (existing) => existing.id === file.id,
        )

        if (existingFile) {
          return {
            ...existingFile,
            ...file,
          }
        } else {
          return {
            ...file,
            progress: 0,
            status: 'uploading' as const,
          }
        }
      })

      setUploadFiles(newUploadFiles)
      onFilesChange?.(newFiles)
      autoUploadFiles(
        newUploadFiles.filter((f: IFileUploadItem) => f.status === 'uploading'),
      )
    },
  })

  const autoUploadFiles = async (filesToUpload: IFileUploadItem[]) => {
    const uploadedAssetIds: string[] = []
    const uploadedFileUrls: string[] = []

    for (const fileItem of filesToUpload) {
      try {
        const asset = await uploadFile({
          file: fileItem.file,
          onProgress: (progress: number) => {
            setUploadFiles((prev) =>
              prev.map((f) => (f.id === fileItem.id ? { ...f, progress } : f)),
            )
          },
        })

        if (asset) {
          console.log('Upload response:', asset)
          uploadedAssetIds.push(asset.id)
          const fileUrl = asset.file_url || asset.secure_url || asset.url || ''
          uploadedFileUrls.push(fileUrl)

          setUploadFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id
                ? {
                    ...f,
                    progress: 100,
                    status: 'completed' as const,
                    assetId: asset.id,
                    preview: fileUrl,
                  }
                : f,
            ),
          )
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed'

        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === fileItem.id
              ? {
                  ...f,
                  status: 'error' as const,
                  error: errorMessage,
                }
              : f,
          ),
        )
      }
    }

    if (uploadedAssetIds.length > 0) {
      onUploadComplete?.(uploadedAssetIds, uploadedFileUrls)
    }
  }

  const removeUploadFile = async (fileId: string) => {
    const fileItem = uploadFiles.find((f) => f.id === fileId)
    if (!fileItem) return

    setDeletingFiles((prev) => new Set(prev).add(fileId))

    if (fileItem.assetId) {
      try {
        console.log('Deleting file with ID:', fileItem.assetId)
        await uploadApi.deleteFile(fileItem.assetId)
        console.log('File deleted successfully')
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to delete file'
        console.error('Delete error:', errorMessage)
      } finally {
        setDeletingFiles((prev) => {
          const newSet = new Set(prev)
          newSet.delete(fileId)
          return newSet
        })
      }
    } else {
      setDeletingFiles((prev) => {
        const newSet = new Set(prev)
        newSet.delete(fileId)
        return newSet
      })
    }

    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId))
    removeFile(fileId)
  }

  const retryUpload = async (fileId: string) => {
    const fileItem = uploadFiles.find((f) => f.id === fileId)
    if (!fileItem) return

    setUploadFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              progress: 0,
              status: 'uploading' as const,
              error: undefined,
            }
          : file,
      ),
    )

    try {
      const asset = await uploadFile({
        file: fileItem.file,
        onProgress: (progress: number) => {
          setUploadFiles((prev) =>
            prev.map((f) => (f.id === fileId ? { ...f, progress } : f)),
          )
        },
      })

      if (asset) {
        const fileUrl = asset.file_url || asset.secure_url || asset.url || ''
        console.log('Retry upload response:', asset)
        setUploadFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? {
                  ...f,
                  progress: 100,
                  status: 'completed' as const,
                  assetId: asset.id,
                  preview: fileUrl,
                }
              : f,
          ),
        )

        onUploadComplete?.([asset.id], [fileUrl])
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed'

      setUploadFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: 'error' as const,
                error: errorMessage,
              }
            : f,
        ),
      )
    }
  }

  const handleClearFiles = async () => {
    const assetIds = uploadFiles.filter((f) => f.assetId).map((f) => f.assetId!)
    const fileIdsToDelete = uploadFiles.map((f) => f.id)

    setDeletingFiles(new Set(fileIdsToDelete))

    if (assetIds.length > 0) {
      try {
        console.log('Deleting files with IDs:', assetIds)
        await uploadApi.deleteFiles(assetIds)
        console.log('Files deleted successfully')
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to delete files'
        console.error('Bulk delete error:', errorMessage)
      } finally {
        setDeletingFiles(new Set())
      }
    } else {
      setDeletingFiles(new Set())
    }

    setUploadFiles([])
    clearFiles()
  }

  return {
    // State
    uploadFiles,
    deletingFiles,
    isDragging,
    errors,

    // Handlers
    removeUploadFile,
    retryUpload,
    handleClearFiles,
    openFileDialog,

    // Drag and drop handlers
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,

    // Input props
    getInputProps,

    // Utilities
    formatBytes,
  }
}
