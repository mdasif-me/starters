'use client'

import { Button } from '@/components/ui/button'
import { Download, Loader2, RefreshCwIcon, Trash2 } from 'lucide-react'

export type IFileActionStatus = 'uploading' | 'completed' | 'error'

interface IUploadActionsProps {
  fileId: string
  status: IFileActionStatus
  previewUrl?: string
  isDeleting: boolean
  onRetry: (fileId: string) => void
  onDelete: (fileId: string) => void
}

export function UploadActions({
  fileId,
  status,
  previewUrl,
  isDeleting,
  onRetry,
  onDelete,
}: IUploadActionsProps) {
  return (
    <div className="flex items-center gap-1">
      {/* Download button - only show for completed uploads with preview URL */}
      {previewUrl && status === 'completed' && (
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          asChild
          title="Download file"
        >
          <a href={previewUrl} target="_blank" rel="noopener noreferrer">
            <Download className="size-3.5" />
          </a>
        </Button>
      )}

      {/* Retry button - only show for failed uploads */}
      {status === 'error' ? (
        <Button
          onClick={() => onRetry(fileId)}
          variant="ghost"
          size="icon"
          className="size-8 text-destructive/80 hover:text-destructive"
          title="Retry upload"
        >
          <RefreshCwIcon className="size-3.5" />
        </Button>
      ) : (
        /* Delete button - show for all non-error files */
        <Button
          onClick={() => onDelete(fileId)}
          variant="ghost"
          size="icon"
          className="size-8"
          type="button"
          disabled={isDeleting}
          title="Delete file"
        >
          {isDeleting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Trash2 className="size-3.5" />
          )}
        </Button>
      )}
    </div>
  )
}
