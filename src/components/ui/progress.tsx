'use client'

import { cn } from '@/lib/utils'
import * as React from 'react'

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number
  max?: number
  variant?: 'default' | 'success' | 'warning' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value = 0,
      max = 100,
      variant = 'default',
      size = 'md',
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full overflow-hidden rounded-full bg-secondary',
          {
            'h-1': size === 'sm',
            'h-2': size === 'md',
            'h-3': size === 'lg',
          },
          className,
        )}
        {...props}
      >
        <div
          className={cn('h-full transition-all duration-300 ease-in-out', {
            'bg-primary': variant === 'default',
            'bg-green-500': variant === 'success',
            'bg-yellow-500': variant === 'warning',
            'bg-destructive': variant === 'destructive',
          })}
          style={{ width: `${percentage}%` }}
        />
      </div>
    )
  },
)
Progress.displayName = 'Progress'

export { Progress }
