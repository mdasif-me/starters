export interface IUploadedFile {
  id: string
  original_name?: string
  filename?: string
  file_path?: string
  file_url?: string
  name?: string
  size: number
  type?: string
  mimetype?: string
  secure_url?: string
  url?: string
  created_at?: string
}

export interface IValidationResult {
  valid: boolean
  error?: string
}

export interface IUploadProgress {
  file: File | null
  progress: number
  status: 'idle' | 'uploading' | 'completed' | 'error'
  error: string | null
  uploadedFile: IUploadedFile | null
}

export interface IFileMetadata {
  id: string
  name: string
  size: number
  type: string
  url: string
}

export interface IFileWithPreview {
  id: string
  file: File
  preview: string
}

export interface IFileUploadItem extends IFileWithPreview {
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
  assetId?: string
}

export type TUploadStatus = IFileUploadItem['status']
