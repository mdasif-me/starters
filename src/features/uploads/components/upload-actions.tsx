'use client'

import { Button } from '@/components/ui/button'
import { EyeIcon, Loader2, RefreshCwIcon, Trash2 } from 'lucide-react'

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
    <div className="flex items-center justify-end gap-1">
      {/* Preview button - only show for completed uploads with preview URL */}
      {previewUrl && status === 'completed' && (
        <Button
          variant="inverse"
          size="icon"
          className="size-6 hover:bg-foreground/10"
          asChild
          title="Preview file"
        >
          <a href={previewUrl} target="_blank" rel="noopener noreferrer">
            <EyeIcon className="size-4" />
          </a>
        </Button>
      )}

      {/* Retry button - only show for failed uploads */}
      {status === 'error' ? (
        <Button
          onClick={() => onRetry(fileId)}
          variant="inverse"
          size="icon"
          className="size-6 text-destructive/80 hover:text-destructive"
          title="Retry upload"
        >
          <RefreshCwIcon className="size-4" />
        </Button>
      ) : (
        /* Delete button - show for all non-error files */
        <Button
          onClick={() => onDelete(fileId)}
          variant="destructive"
          size="icon"
          className="size-6 text-white"
          type="button"
          disabled={isDeleting}
          title="Delete file"
        >
          {isDeleting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </Button>
      )}
    </div>
  )
}
