import {
  FileArchiveIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  VideoIcon,
} from 'lucide-react'

export interface IFileType {
  type: string
}

/**
 * Get the appropriate icon component for a file based on its MIME type
 * @param file - File or object with type property
 * @returns JSX element representing the file icon
 */
export const getFileIcon = (file: File | IFileType) => {
  const type = file instanceof File ? file.type : file.type

  if (type.startsWith('image/')) return <ImageIcon className="size-4" />
  if (type.startsWith('video/')) return <VideoIcon className="size-4" />
  if (type.startsWith('audio/')) return <HeadphonesIcon className="size-4" />
  if (type.includes('pdf')) return <FileTextIcon className="size-4" />
  if (type.includes('word') || type.includes('doc'))
    return <FileTextIcon className="size-4" />
  if (type.includes('excel') || type.includes('sheet'))
    return <FileSpreadsheetIcon className="size-4" />
  if (type.includes('zip') || type.includes('rar'))
    return <FileArchiveIcon className="size-4" />

  return <FileTextIcon className="size-4" />
}

/**
 * Get a human-readable file type label from MIME type
 * @param mimeType - The MIME type string
 * @returns Human-readable file type label
 */
export const getFileTypeLabel = (mimeType: string): string => {
  if (mimeType.startsWith('image/')) return 'Image'
  if (mimeType.startsWith('video/')) return 'Video'
  if (mimeType.startsWith('audio/')) return 'Audio'
  if (mimeType.includes('pdf')) return 'PDF'
  if (mimeType.includes('word') || mimeType.includes('doc')) return 'Document'
  if (mimeType.includes('excel') || mimeType.includes('sheet'))
    return 'Spreadsheet'
  if (mimeType.includes('zip') || mimeType.includes('rar')) return 'Archive'

  return 'File'
}

/**
 * Get file type label from a file object
 * @param file - File or object with type property
 * @returns Human-readable file type label
 */
export const getFileTypeLabelFromFile = (file: File | IFileType): string => {
  const type = file instanceof File ? file.type : file.type
  return getFileTypeLabel(type)
}
