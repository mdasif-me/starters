'use client'

import {
  type IFileMetadata,
  type IFileWithPreview,
  formatBytes,
} from '@/features/uploads'
import { useCallback, useRef, useState } from 'react'

export interface IFileUploadOptions {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  initialFiles?: IFileMetadata[]
  onFilesChange?: (files: IFileWithPreview[]) => void
}

export interface IFileUploadReturn {
  isDragging: boolean
  errors: string[]
  removeFile: (fileId: string) => void
  clearFiles: () => void
  handleDragEnter: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  openFileDialog: () => void
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>
}

// Re-export for backward compatibility
export { formatBytes }
export type { IFileMetadata, IFileWithPreview }

export function useUploadManager(options: IFileUploadOptions = {}): [
  { isDragging: boolean; errors: string[] },
  {
    removeFile: (fileId: string) => void
    clearFiles: () => void
    handleDragEnter: (e: React.DragEvent) => void
    handleDragLeave: (e: React.DragEvent) => void
    handleDragOver: (e: React.DragEvent) => void
    handleDrop: (e: React.DragEvent) => void
    openFileDialog: () => void
    getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>
  },
] {
  const {
    maxFiles = 10,
    maxSize = 50 * 1024 * 1024,
    accept = '*',
    multiple = true,
    initialFiles = [],
    onFilesChange,
  } = options

  const [isDragging, setIsDragging] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [files, setFiles] = useState<IFileWithPreview[]>(
    initialFiles.map((file) => ({
      id: file.id,
      file: new File([], file.name, { type: file.type }),
      preview: file.url,
    })),
  )

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const dragCounterRef = useRef(0)

  const validateFiles = useCallback(
    (filesToValidate: File[]): { valid: File[]; errors: string[] } => {
      const validFiles: File[] = []
      const validationErrors: string[] = []

      // Check total files count
      if (files.length + filesToValidate.length > maxFiles) {
        validationErrors.push(
          `Maximum ${maxFiles} files allowed. You're trying to upload ${filesToValidate.length} files.`,
        )
        return { valid: [], errors: validationErrors }
      }

      for (const file of filesToValidate) {
        // Check file size
        if (file.size > maxSize) {
          validationErrors.push(
            `File "${file.name}" exceeds maximum size of ${formatBytes(maxSize)}`,
          )
          continue
        }

        // Check file type if specified
        if (accept !== '*') {
          const acceptedTypes = accept.split(',').map((t) => t.trim())
          const isAccepted = acceptedTypes.some(
            (type) =>
              file.type === type ||
              file.type.startsWith(type.replace('/*', '')),
          )

          if (!isAccepted) {
            validationErrors.push(
              `File "${file.name}" has unsupported type: ${file.type}`,
            )
            continue
          }
        }

        validFiles.push(file)
      }

      return { valid: validFiles, errors: validationErrors }
    },
    [files.length, maxFiles, maxSize, accept],
  )

  const processFiles = useCallback(
    (filesToProcess: File[]) => {
      const { valid: validFiles, errors: validationErrors } =
        validateFiles(filesToProcess)

      if (validationErrors.length > 0) {
        setErrors((prev) => [...prev, ...validationErrors])
      }

      if (validFiles.length > 0) {
        const newFiles: IFileWithPreview[] = validFiles.map((file) => ({
          id: `${Date.now()}-${Math.random()}`,
          file,
          preview: URL.createObjectURL(file),
        }))

        const updatedFiles = [...files, ...newFiles]
        setFiles(updatedFiles)
        onFilesChange?.(updatedFiles)
      }
    },
    [files, validateFiles, onFilesChange],
  )

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current++
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounterRef.current--
    if (dragCounterRef.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounterRef.current = 0

    const droppedFiles = Array.from(e.dataTransfer.files)
    processFiles(multiple ? droppedFiles : droppedFiles.slice(0, 1))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    processFiles(multiple ? selectedFiles : selectedFiles.slice(0, 1))
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const removeFile = (fileId: string) => {
    const updatedFiles = files.filter((f) => f.id !== fileId)
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  const clearFiles = () => {
    setFiles([])
    setErrors([])
    onFilesChange?.([])
  }

  const getInputProps = (): React.InputHTMLAttributes<HTMLInputElement> & {
    ref: React.RefObject<HTMLInputElement | null>
  } => ({
    ref: fileInputRef,
    type: 'file',
    multiple,
    accept,
    onChange: handleInputChange,
  })

  return [
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
  ]
}
