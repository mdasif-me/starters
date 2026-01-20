'use client'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { IFileUploadItem } from '@/features/uploads/types'
import { CloudUpload, Trash2 } from 'lucide-react'
import { UploadTableRow } from './upload-table-row'

interface IUploadTableProps {
  files: IFileUploadItem[]
  formatBytes: (bytes: number) => string
  deletingFiles: Set<string>
  onAddFiles: () => void
  onClearAll: () => void
  onRetry: (fileId: string) => void
  onDelete: (fileId: string) => void
}

export function UploadTable({
  files,
  formatBytes,
  deletingFiles,
  onAddFiles,
  onClearAll,
  onRetry,
  onDelete,
}: IUploadTableProps) {
  if (files.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Files ({files.length})</h3>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={onAddFiles}
            variant="outline"
            size="sm"
          >
            <CloudUpload />
            Add files
          </Button>
          <Button
            type="button"
            onClick={onClearAll}
            variant="outline"
            size="sm"
          >
            <Trash2 />
            Remove all
          </Button>
        </div>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="text-xs">
              <TableHead className="h-9">Name</TableHead>
              <TableHead className="h-9">Type</TableHead>
              <TableHead className="h-9">Size</TableHead>
              <TableHead className="h-9 w-25 text-end">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((fileItem) => (
              <UploadTableRow
                key={fileItem.id}
                fileItem={fileItem}
                formatBytes={formatBytes}
                isDeleting={deletingFiles.has(fileItem.id)}
                onRetry={onRetry}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
