'use client'

import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import type { ReactNode } from 'react'

export type FileStatus = 'uploading' | 'completed' | 'error'

interface IUploadStatusProps {
  status: FileStatus
  progress: number
  fileName: string
  error?: string
  fileIcon: ReactNode
  className?: string
}

export function UploadStatus({
  status,
  progress,
  fileName,
  error,
  fileIcon,
  className,
}: IUploadStatusProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div
        className={cn(
          'size-8 shrink-0 relative flex items-center justify-center text-muted-foreground/80',
        )}
      >
        {status === 'uploading' ? (
          <div className="relative">
            {/* Circular progress background */}
            <svg className="size-8 -rotate-90" viewBox="0 0 32 32">
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-muted-foreground/20"
              />
              {/* Progress circle */}
              <circle
                cx="16"
                cy="16"
                r="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray={`${2 * Math.PI * 14}`}
                strokeDashoffset={`${2 * Math.PI * 14 * (1 - progress / 100)}`}
                className="text-primary transition-all duration-300"
                strokeLinecap="round"
              />
            </svg>
            {/* Loader icon in center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="size-4 animate-spin text-primary" />
            </div>
          </div>
        ) : (
          <div className="not-[]:size-8 flex items-center justify-center">
            {fileIcon}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 min-w-0 flex-1">
        <p className="flex items-center gap-1 truncate text-sm font-medium">
          <span className="max-w-52 truncate">{fileName}</span>
          {status === 'error' && (
            <Badge variant="destructive" size="sm" appearance="light">
              Error
            </Badge>
          )}
          {status === 'completed' && (
            <Badge variant="success" size="sm" appearance="light">
              Done
            </Badge>
          )}
        </p>
        {status === 'uploading' && (
          <div className="flex items-center gap-2">
            <Progress value={progress} size="sm" className="flex-1" />
            <span className="text-xs text-muted-foreground min-w-[3ch]">
              {progress}%
            </span>
          </div>
        )}
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  )
}
