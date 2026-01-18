export interface IFileWithPreview {
  id: string
  name: string
  preview: string
  size: number
}

export interface IFileUploadItem extends IFileWithPreview {
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
  assetId?: string
}
