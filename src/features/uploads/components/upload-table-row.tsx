'use client'

import { Badge } from '@/components/ui/badge'
import { TableCell, TableRow } from '@/components/ui/table'
import type { IFileUploadItem } from '@/features/uploads/types'
import {
  getFileIcon,
  getFileTypeLabelFromFile,
} from '@/features/uploads/utils/file-icons'
import { UploadActions } from './upload-actions'
import { UploadStatus } from './upload-status'

interface UploadTableRowProps {
  fileItem: IFileUploadItem
  formatBytes: (bytes: number) => string
  isDeleting: boolean
  onRetry: (fileId: string) => void
  onDelete: (fileId: string) => void
}

export function UploadTableRow({
  fileItem,
  formatBytes,
  isDeleting,
  onRetry,
  onDelete,
}: UploadTableRowProps) {
  return (
    <TableRow>
      <TableCell className="py-2 ps-1.5">
        <UploadStatus
          status={fileItem.status}
          progress={fileItem.progress}
          fileName={fileItem.file.name}
          error={fileItem.error}
          fileIcon={getFileIcon(fileItem.file)}
        />
      </TableCell>
      <TableCell className="py-2">
        <Badge variant="secondary" className="text-xs">
          {getFileTypeLabelFromFile(fileItem.file)}
        </Badge>
      </TableCell>

      <TableCell className="py-2 text-sm text-muted-foreground">
        {formatBytes(fileItem.file.size)}
      </TableCell>

      <TableCell className="py-2 pe-1">
        <UploadActions
          fileId={fileItem.id}
          status={fileItem.status}
          previewUrl={fileItem.preview}
          isDeleting={isDeleting}
          onRetry={onRetry}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  )
}
