'use client'

import { cn } from '@/lib/utils'
import { Upload as UploadIcon } from 'lucide-react'

interface IUploadDropzoneProps {
  isDragging: boolean
  maxSize: number
  maxFiles: number
  formatBytes: (bytes: number) => string
  onDragEnter: (e: React.DragEvent) => void
  onDragLeave: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onBrowseClick: () => void
  inputProps: React.InputHTMLAttributes<HTMLInputElement>
  className?: string
}

/**
 * A component that renders a dropzone for file uploads.
 * @param {boolean} isDragging - Whether the dropzone is currently being dragged over.
 */
export function UploadDropzone({
  isDragging,
  maxSize,
  maxFiles,
  formatBytes,
  onDragEnter,
  onDragLeave,
  onDragOver,
  onDrop,
  onBrowseClick,
  inputProps,
  className,
}: IUploadDropzoneProps) {
  return (
    <div
      className={cn(
        'relative rounded-lg border border-dashed p-6 text-center transition-colors',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        className,
      )}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <input {...inputProps} className="sr-only" />

      <div className="flex flex-col items-center gap-4">
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full bg-muted transition-colors',
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-muted-foreground/25',
          )}
        >
          <UploadIcon className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">
            Drop files here or{' '}
            <button
              type="button"
              onClick={onBrowseClick}
              className="cursor-pointer text-primary underline-offset-4 hover:underline"
            >
              browse files
            </button>
          </p>
          <p className="text-xs text-muted-foreground">
            Maximum file size: {formatBytes(maxSize)} • Maximum files:{' '}
            {maxFiles}
          </p>
        </div>
      </div>
    </div>
  )
}
