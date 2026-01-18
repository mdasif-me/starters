'use client'

import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/alert'
import { TriangleAlert } from 'lucide-react'

interface IUploadErrorsProps {
  errors: string[]
}

export function UploadErrors({ errors }: IUploadErrorsProps) {
  if (errors.length === 0) {
    return null
  }

  return (
    <Alert variant="destructive" appearance="light" className="mt-5">
      <AlertIcon>
        <TriangleAlert />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>File upload error(s)</AlertTitle>
        <AlertDescription>
          {errors.map((error: string, index: number) => (
            <p key={index} className="last:mb-0">
              {error}
            </p>
          ))}
        </AlertDescription>
      </AlertContent>
    </Alert>
  )
}
