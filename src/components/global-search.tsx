'use client'

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { SearchIcon } from '@hugeicons-pro/core-solid-rounded'
import { Calculator, Calendar, Smile } from 'lucide-react'
import * as React from 'react'
import { Icon } from '../utils/icon'
import { Input, InputAddon, InputGroup } from './ui/input'

export default function GlobalSearch() {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  return (
    <>
      <InputGroup>
        <InputAddon mode="icon" className="bg-white">
          <Icon icon={SearchIcon} size={16} />
        </InputAddon>
        <Input
          type="text"
          placeholder="Quick Search..."
          className="focus-visible:ring-0 focus-visible:ring-offset-0 border-l-0 shadow-none focus-visible:border-input"
        />
        <InputAddon className="bg-white">
          <p className="text-muted-foreground text-sm">
            Press{' '}
            <kbd className="bg-muted text-muted-foreground pointer-events-none inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none">
              <span className="text-xs">⌘</span>J
            </kbd>
          </p>
        </InputAddon>
      </InputGroup>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smile />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Calculator />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
