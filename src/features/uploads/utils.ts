import type { IValidationResult } from './types'

export const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export const validateFile = (file: File): IValidationResult => {
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${formatBytes(MAX_FILE_SIZE)}`,
    }
  }

  return { valid: true }
}

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

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}
