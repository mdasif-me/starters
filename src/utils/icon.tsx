import { HugeiconsIcon } from '@hugeicons/react'
import type { ComponentProps } from 'react'

type IconProps = ComponentProps<typeof HugeiconsIcon>

export function Icon({ size = 128, strokeWidth = 1, ...rest }: IconProps) {
  return <HugeiconsIcon size={size} strokeWidth={strokeWidth} {...rest} />
}
