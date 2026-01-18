# Upload Feature

Production-ready, modular file upload system with drag & drop, progress tracking, and complete file management capabilities.

## Features

- ✅ Drag and drop file upload
- ✅ Progress tracking with visual indicators
- ✅ File validation (size, type, count)
- ✅ Retry failed uploads
- ✅ Delete individual or all files
- ✅ Preview/download uploaded files
- ✅ Fully typed with TypeScript
- ✅ Modular and reusable components
- ✅ Production-ready error handling
- ✅ Customizable and themeable

## Project Structure

```
src/features/uploads/
├── api.ts                              # API client functions
├── hooks.ts                            # React Query hooks
├── types.ts                            # TypeScript interfaces
├── utils.ts                            # File validation utilities
├── index.ts                            # Main exports
├── components/
│   ├── index.ts                        # Component exports
│   ├── upload.tsx                      # Main upload component
│   ├── upload-dropzone.tsx             # Drag & drop zone
│   ├── upload-table.tsx                # File list table
│   ├── upload-table-row.tsx            # Single file row
│   ├── upload-file-status.tsx          # Status indicator
│   ├── upload-file-actions.tsx         # Action buttons
│   └── upload-errors.tsx               # Error display
├── hooks/
│   └── use-file-upload-state.ts        # Upload state management
└── utils/
    ├── index.ts
    └── file-icons.tsx                  # File icon utilities
```

## Quick Start

### Basic Usage

```tsx
import { Upload } from '@/features/uploads'

function MyComponent() {
  return (
    <Upload
      maxFiles={10}
      maxSize={50 * 1024 * 1024} // 50MB
      accept="image/*,application/pdf"
      onUploadComplete={(assetIds) => {
        console.log('Uploaded files:', assetIds)
      }}
    />
  )
}
```

### Custom Implementation

Use individual components for custom layouts:

```tsx
import {
  useFileUploadState,
  UploadDropzone,
  UploadTable,
  UploadErrors,
} from '@/features/uploads'

function CustomUploadComponent() {
  const {
    uploadFiles,
    deletingFiles,
    isDragging,
    errors,
    removeUploadFile,
    retryUpload,
    handleClearFiles,
    openFileDialog,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    getInputProps,
    formatBytes,
  } = useFileUploadState({
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024,
    onUploadComplete: (ids) => console.log(ids),
  })

  return (
    <div>
      <UploadDropzone
        isDragging={isDragging}
        maxSize={10 * 1024 * 1024}
        maxFiles={5}
        formatBytes={formatBytes}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onBrowseClick={openFileDialog}
        inputProps={getInputProps()}
      />

      <UploadTable
        files={uploadFiles}
        formatBytes={formatBytes}
        deletingFiles={deletingFiles}
        onAddFiles={openFileDialog}
        onClearAll={handleClearFiles}
        onRetry={retryUpload}
        onDelete={removeUploadFile}
      />

      <UploadErrors errors={errors} />
    </div>
  )
}
```

## API Reference

### Components

#### `<Upload />`

Main upload component with all features.

**Props:**

- `maxFiles?: number` - Maximum number of files (default: 10)
- `maxSize?: number` - Maximum file size in bytes (default: 50MB)
- `accept?: string` - Accepted file types (default: '\*')
- `multiple?: boolean` - Allow multiple files (default: true)
- `className?: string` - Additional CSS classes
- `initialFiles?: IFileMetadata[]` - Pre-existing files
- `onFilesChange?: (files) => void` - Callback when files change
- `onUploadComplete?: (assetIds) => void` - Callback on upload success

#### `<UploadDropzone />`

Drag and drop upload zone.

#### `<UploadTable />`

Table displaying uploaded files with actions.

#### `<UploadTableRow />`

Individual file row in the table.

#### `<UploadFileStatus />`

Status indicator for a file (uploading, completed, error).

#### `<UploadFileActions />`

Action buttons for a file (download, retry, delete).

#### `<UploadErrors />`

Error messages display component.

### Hooks

#### `useFileUploadState(options)`

Main hook for managing upload state.

**Returns:**

```ts
{
  uploadFiles: IFileUploadItem[]
  deletingFiles: Set<string>
  isDragging: boolean
  errors: string[]
  removeUploadFile: (fileId: string) => Promise<void>
  retryUpload: (fileId: string) => Promise<void>
  handleClearFiles: () => Promise<void>
  openFileDialog: () => void
  handleDragEnter: (e: React.DragEvent) => void
  handleDragLeave: (e: React.DragEvent) => void
  handleDragOver: (e: React.DragEvent) => void
  handleDrop: (e: React.DragEvent) => void
  getInputProps: () => InputHTMLAttributes
  formatBytes: (bytes: number) => string
}
```

#### `useUploadFile()`

React Query mutation for single file upload.

#### `useUploadFiles()`

React Query mutation for multiple file upload.

#### `useDeleteFile()`

React Query mutation for file deletion.

#### `useListFiles(params)`

React Query hook for listing files.

### API Functions

#### `uploadApi.uploadFile(file, onProgress)`

Upload a single file with progress tracking.

#### `uploadApi.uploadFiles(files, onProgress)`

Upload multiple files with progress tracking.

#### `uploadApi.deleteFile(fileId)`

Delete a single file.

#### `uploadApi.deleteFiles(fileIds)`

Delete multiple files.

#### `uploadApi.listFiles(params)`

List uploaded files with pagination.

### Utilities

#### `getFileIcon(file)`

Get appropriate icon component for file type.

#### `getFileTypeLabel(mimeType)`

Get human-readable label from MIME type.

#### `formatBytes(bytes)`

Format bytes into human-readable string (KB, MB, GB).

#### `validateFile(file, maxSize?)`

Validate file size and type.

## TypeScript Types

```ts
interface IUploadedFile {
  id: string
  original_name?: string
  filename?: string
  file_url?: string
  mimetype?: string
  size: number
  created_at?: string
}

interface IFileUploadItem extends IFileWithPreview {
  progress: number
  status: 'uploading' | 'completed' | 'error'
  error?: string
  assetId?: string
}

interface IFileWithPreview {
  id: string
  file: File
  preview: string
}
```

## Customization

### Styling

All components use Tailwind CSS and can be customized via:

- `className` props
- Global CSS variables
- shadcn/ui theme configuration

### File Icons

Customize file icons by modifying `utils/file-icons.tsx`:

```tsx
export const getFileIcon = (file: File | FileType) => {
  const type = file instanceof File ? file.type : file.type

  // Add custom icon logic
  if (type === 'application/custom') {
    return <CustomIcon className="size-4" />
  }

  // ... existing logic
}
```

## Backend Integration

The upload feature expects these backend endpoints:

### Upload Endpoints

- `POST /f/s` - Single file upload
- `POST /f/m` - Multiple files upload

**Response Format:**

```json
{
  "status_code": 201,
  "message": "File uploaded successfully",
  "edge": {
    "data": {
      "id": "uuid",
      "original_name": "file.png",
      "file_url": "https://example.com/file.png",
      "mimetype": "image/png",
      "size": 12345,
      "created_at": "2026-01-18T09:48:56.922Z"
    }
  }
}
```

### Delete Endpoints

- `DELETE /f/:fileId` - Delete single file
- Bulk delete via multiple calls

### List Endpoint

- `GET /f/g?offset=0&limit=10` - List files with pagination

## Copy-Paste Ready

This feature is designed to be copy-pasted into other projects:

1. Copy the entire `src/features/uploads/` directory
2. Update import paths if needed
3. Ensure you have required dependencies:
   - `@tanstack/react-query`
   - `lucide-react`
   - shadcn/ui components (Button, Badge, Table, Alert, Progress)
4. Configure your API base URL in environment variables

## Environment Variables

```env
VITE_API_BASE_URL=https://api.example.com
```

## Dependencies

Required packages:

```json
{
  "@tanstack/react-query": "^5.x",
  "lucide-react": "^0.x",
  "react": "^18.x"
}
```

## License

This code is production-ready and can be used in commercial projects.
