'use client'

import {
  UploadDropzone,
  UploadErrors,
  UploadTable,
} from '@/features/uploads/components'
import type { IFileMetadata, IFileWithPreview } from '@/features/uploads/types'
import { cn } from '@/lib/utils'
import { useUploadState } from '../hooks'

interface IUpload {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  className?: string
  onFilesChange?: (files: IFileWithPreview[]) => void
  onUploadComplete?: (assetIds: string[], files: string[]) => void
  showDefaults?: boolean
  initialFiles?: IFileMetadata[]
}

/**
 * @example
 * ```tsx
 * <Upload
 *   maxFiles={10}
 *   maxSize={50 * 1024 * 1024}
 *   accept="image/*,application/pdf"
 *   onUploadComplete={(assetIds) => console.log('Uploaded:', assetIds)}
 * />
 * ```
 */
export default function Upload({
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024,
  accept = '*',
  multiple = true,
  className,
  onFilesChange,
  onUploadComplete,
  showDefaults = true,
  initialFiles = [],
}: IUpload) {
  const {
    uploadFiles,
    deletingFiles,
    isDragging,
    errors,
    removeUploadFile,
    retryUpload,
    handleClearFiles,
    openFileDialog,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    getInputProps,
    formatBytes,
  } = useUploadState({
    maxFiles,
    maxSize,
    accept,
    multiple,
    initialFiles: showDefaults ? initialFiles : [],
    onFilesChange,
    onUploadComplete,
  })

  return (
    <div className={cn('w-full space-y-4', className)}>
      <UploadDropzone
        isDragging={isDragging}
        maxSize={maxSize}
        maxFiles={maxFiles}
        formatBytes={formatBytes}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onBrowseClick={openFileDialog}
        inputProps={getInputProps()}
      />

      <UploadTable
        files={uploadFiles}
        formatBytes={formatBytes}
        deletingFiles={deletingFiles}
        onAddFiles={openFileDialog}
        onClearAll={handleClearFiles}
        onRetry={retryUpload}
        onDelete={removeUploadFile}
      />

      <UploadErrors errors={errors} />
    </div>
  )
}
