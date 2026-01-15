'use client'

import { Badge, BadgeButton } from '@/components/ui/badge'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
  avatarStatusVariants,
} from '@/components/ui/base-avatar'
import { Button, ButtonArrow } from '@/components/ui/button'
import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ChevronLeft, Plus, X } from 'lucide-react'
import * as React from 'react'

export type TComboboxOption = {
  value: string
  label: string
  disabled?: boolean
  icon?: React.ReactNode
  flag?: string
  avatar?: string
  status?: keyof typeof avatarStatusVariants
  state?: string
  dialCode?: string
  [key: string]: any
}

export type TComboboxGroup = {
  group: string
  options: TComboboxOption[]
}

export type TComboboxProps = {
  options: TComboboxOption[] | TComboboxGroup[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyMessage?: string
  className?: string
  mode?: 'single' | 'multiple'
  multipleDisplayMode?: 'badges' | 'count' | 'text'
  multipleExpandedLimit?: number
  showSearch?: boolean
  allowAddNew?: boolean
  addNewLabel?: string
  onAddNew?: () => void
  showScrollArea?: boolean
  scrollAreaHeight?: string
  showSeparator?: boolean
  variant?:
    | 'default'
    | 'with-icons'
    | 'with-avatars'
    | 'with-status'
    | 'with-flags'
    | 'phone-input'
  checkIcon?: 'default' | 'custom' | 'hidden'
  customCheckIcon?: React.ReactNode
  displayFormat?: (option: TComboboxOption) => React.ReactNode
  name?: string
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
}

export default function Combobox({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  className = 'w-64',

  mode = 'single',
  multipleDisplayMode = 'badges',
  multipleExpandedLimit = 2,

  showSearch = true,
  allowAddNew = false,
  addNewLabel = 'Add new',
  onAddNew,
  showScrollArea = false,
  scrollAreaHeight = '300px',
  showSeparator = false,

  variant = 'default',
  checkIcon = 'default',
  customCheckIcon,
  displayFormat,

  //   name,
  //   required,
  disabled = false,
  readOnly = false,
}: TComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)

  const isGrouped = React.useMemo(() => {
    return options.length > 0 && 'group' in options[0]
  }, [options])

  const flattenedOptions = React.useMemo(() => {
    if (isGrouped) {
      return (options as TComboboxGroup[]).flatMap((group) => group.options)
    }
    return options as TComboboxOption[]
  }, [options, isGrouped])

  const handleSingleSelect = (currentValue: string) => {
    const newValue = currentValue === value ? '' : currentValue
    onChange(newValue)
    setOpen(false)
  }

  const handleMultipleSelect = (currentValue: string) => {
    const currentValues = Array.isArray(value) ? value : []
    const newValues = currentValues.includes(currentValue)
      ? currentValues.filter((v) => v !== currentValue)
      : [...currentValues, currentValue]
    onChange(newValues)
  }

  const removeFromSelection = (valueToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const currentValues = Array.isArray(value) ? value : []
    const newValues = currentValues.filter((v) => v !== valueToRemove)
    onChange(newValues)
  }

  const getSelectedOption = () => {
    if (mode === 'single' && typeof value === 'string') {
      return flattenedOptions.find((opt) => opt.value === value)
    }
    return null
  }

  const getSelectedOptions = () => {
    if (mode === 'multiple' && Array.isArray(value)) {
      return flattenedOptions.filter((opt) => value.includes(opt.value))
    }
    return []
  }

  const renderTriggerContent = () => {
    if (mode === 'single') {
      const selectedOption = getSelectedOption()

      if (!selectedOption) {
        return <span className="truncate">{placeholder}</span>
      }

      if (displayFormat) {
        return displayFormat(selectedOption)
      }

      switch (variant) {
        case 'with-status':
          return (
            <span className="flex items-center gap-2.5">
              {selectedOption.state && (
                <span
                  className={cn('size-1.5 rounded-full', selectedOption.state)}
                />
              )}
              <span className="truncate">{selectedOption.label}</span>
            </span>
          )

        case 'with-avatars':
          return (
            <span className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarImage
                  src={selectedOption.avatar}
                  alt={selectedOption.label}
                />
                <AvatarFallback>{selectedOption.label[0]}</AvatarFallback>
                {selectedOption.status && (
                  <AvatarIndicator className="-end-2 -bottom-2">
                    <AvatarStatus
                      variant={selectedOption.status}
                      className="size-2.5"
                    />
                  </AvatarIndicator>
                )}
              </Avatar>
              <span className="truncate font-medium">
                {selectedOption.label}
              </span>
            </span>
          )

        case 'with-flags':
          return (
            <span className="flex items-center gap-2">
              {selectedOption.flag && (
                <img
                  src={selectedOption.flag}
                  alt={selectedOption.label}
                  className="h-5 w-5 rounded-full"
                />
              )}
              <span className="truncate">{selectedOption.label}</span>
            </span>
          )

        case 'with-icons':
          return (
            <span className="flex items-center gap-2.5 truncate">
              {selectedOption.icon && (
                <span className="opacity-60">{selectedOption.icon}</span>
              )}
              {selectedOption.label}
            </span>
          )

        default:
          return <span className="truncate">{selectedOption.label}</span>
      }
    } else {
      const selectedOptions = getSelectedOptions()

      if (selectedOptions.length === 0) {
        return <span className="truncate">{placeholder}</span>
      }

      if (multipleDisplayMode === 'count') {
        return (
          <span>
            <Badge variant="outline" size="sm">
              {selectedOptions.length}
            </Badge>{' '}
            selected
          </span>
        )
      }

      if (multipleDisplayMode === 'badges') {
        const visibleOptions = expanded
          ? selectedOptions
          : selectedOptions.slice(0, multipleExpandedLimit)
        const hiddenCount = selectedOptions.length - visibleOptions.length

        return (
          <div className="flex flex-wrap items-center gap-1">
            {visibleOptions.map((option) => (
              <Badge key={option.value} variant="outline">
                {option.label}
                <BadgeButton
                  onClick={(e) => removeFromSelection(option.value, e)}
                >
                  <X className="size-3" />
                </BadgeButton>
              </Badge>
            ))}
            {hiddenCount > 0 && !expanded && (
              <Badge
                className="cursor-pointer px-1.5 text-muted-foreground hover:bg-accent"
                appearance="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  setExpanded(true)
                }}
              >
                +{hiddenCount} more
              </Badge>
            )}
            {expanded && hiddenCount <= 0 && (
              <Badge
                className="cursor-pointer px-1.5 text-muted-foreground hover:bg-accent"
                appearance="ghost"
                onClick={(e) => {
                  e.stopPropagation()
                  setExpanded(false)
                }}
              >
                Show less
              </Badge>
            )}
          </div>
        )
      }

      return (
        <span className="truncate">
          {selectedOptions.map((opt) => opt.label).join(', ')}
        </span>
      )
    }
  }

  const renderCheckIcon = (isChecked: boolean) => {
    if (!isChecked || checkIcon === 'hidden') return null

    if (checkIcon === 'custom' && customCheckIcon) {
      return customCheckIcon
    }

    if (checkIcon === 'custom' && !customCheckIcon) {
      return <ChevronLeft className="size-4 ms-auto text-foreground" />
    }

    return <CommandCheck />
  }

  const renderOption = (option: TComboboxOption, groupIndex?: number) => {
    const isSingleSelected = mode === 'single' && value === option.value
    const isMultipleSelected =
      mode === 'multiple' &&
      Array.isArray(value) &&
      value.includes(option.value)
    const isSelected = isSingleSelected || isMultipleSelected

    const handleSelect = () => {
      if (option.disabled) return
      if (mode === 'single') {
        handleSingleSelect(option.value)
      } else {
        handleMultipleSelect(option.value)
      }
    }

    return (
      <CommandItem
        key={`${groupIndex || ''}-${option.value}`}
        value={option.value}
        onSelect={handleSelect}
        className={cn(
          option.disabled && 'cursor-not-allowed opacity-50',
          variant === 'with-icons' && 'px-2.5',
        )}
        disabled={option.disabled}
      >
        <span className="flex items-center gap-2.5 truncate">
          {variant === 'with-icons' && option.icon && (
            <span className="opacity-60">{option.icon}</span>
          )}

          {variant === 'with-flags' && option.flag && (
            <img
              src={option.flag}
              alt={option.label}
              className="h-5 w-5 rounded-full"
            />
          )}

          {variant === 'with-avatars' && (
            <Avatar className="size-7">
              <AvatarImage src={option.avatar} alt={option.label} />
              <AvatarFallback>{option.label[0]}</AvatarFallback>
              {option.status && (
                <AvatarIndicator className="-end-2 -bottom-2">
                  <AvatarStatus variant={option.status} className="size-2.5" />
                </AvatarIndicator>
              )}
            </Avatar>
          )}

          {variant === 'with-status' && option.state && (
            <span className={cn('size-1.5 rounded-full', option.state)} />
          )}

          <span className="truncate">{option.label}</span>

          {variant === 'phone-input' && option.dialCode && (
            <span className="text-sm text-muted-foreground ms-auto">
              {option.dialCode}
            </span>
          )}
        </span>

        {isSelected && !option.disabled && renderCheckIcon(isSelected)}
      </CommandItem>
    )
  }

  const renderPopoverContent = () => {
    const content = (
      <Command>
        {showSearch && <CommandInput placeholder={searchPlaceholder} />}
        <CommandList>
          {showScrollArea ? (
            <ScrollArea
              viewportClassName={`max-h-[${scrollAreaHeight}] [&>div]:block!`}
            >
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              {isGrouped ? (
                (options as TComboboxGroup[]).map((group, groupIndex) => (
                  <CommandGroup key={group.group} heading={group.group}>
                    {group.options.map((option) =>
                      renderOption(option, groupIndex),
                    )}
                  </CommandGroup>
                ))
              ) : (
                <CommandGroup>
                  {(options as TComboboxOption[]).map((option) =>
                    renderOption(option),
                  )}
                </CommandGroup>
              )}
              <ScrollBar />
            </ScrollArea>
          ) : (
            <>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              {isGrouped ? (
                (options as TComboboxGroup[]).map((group, groupIndex) => (
                  <CommandGroup key={group.group} heading={group.group}>
                    {group.options.map((option) =>
                      renderOption(option, groupIndex),
                    )}
                  </CommandGroup>
                ))
              ) : (
                <CommandGroup>
                  {(options as TComboboxOption[]).map((option) =>
                    renderOption(option),
                  )}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>

        {showSeparator && <CommandSeparator />}

        {allowAddNew && onAddNew && (
          <CommandGroup>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start font-normal px-2.5"
              onClick={onAddNew}
            >
              <Plus className="size-4" aria-hidden="true" />
              {addNewLabel}
            </Button>
          </CommandGroup>
        )}
      </Command>
    )

    return content
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          size={'lg'}
          variant="outline"
          role="combobox"
          mode="input"
          placeholder={!value || (Array.isArray(value) && value.length === 0)}
          aria-expanded={open}
          className={cn(
            className,
            mode === 'multiple' &&
              multipleDisplayMode === 'badges' &&
              'p-1 relative',
            'justify-between rounded-lg w-full text-foreground',
          )}
          disabled={disabled || readOnly}
        >
          {renderTriggerContent()}
          <ButtonArrow
            className={cn(
              mode === 'multiple' &&
                multipleDisplayMode === 'badges' &&
                'absolute top-2 end-3',
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          'p-0',
          variant === 'with-icons' && 'w-64',
          variant === 'with-avatars' && 'w-72',
          variant === 'phone-input' && 'w-72',
        )}
        align="start"
      >
        {renderPopoverContent()}
      </PopoverContent>
    </Popover>
  )
}

export function SingleCombobox(
  props: Omit<TComboboxProps, 'mode' | 'multipleDisplayMode'>,
) {
  return <Combobox {...props} mode="single" />
}
export function MultipleCombobox(
  props: Omit<TComboboxProps, 'mode'> & {
    displayMode?: 'badges' | 'count' | 'text'
  },
) {
  return (
    <Combobox
      {...props}
      mode="multiple"
      multipleDisplayMode={props.displayMode || 'badges'}
    />
  )
}

export function IconCombobox(props: Omit<TComboboxProps, 'variant'>) {
  return <Combobox {...props} variant="with-icons" />
}

export function AvatarCombobox(props: Omit<TComboboxProps, 'variant'>) {
  return <Combobox {...props} variant="with-avatars" />
}

export function StatusCombobox(props: Omit<TComboboxProps, 'variant'>) {
  return <Combobox {...props} variant="with-status" />
}

export function FlagCombobox(props: Omit<TComboboxProps, 'variant'>) {
  return <Combobox {...props} variant="with-flags" />
}

export function PhoneCombobox() {
  const countries = [
    { code: 'US', name: 'United States', dialCode: '+1', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', dialCode: '+44', flag: '🇬🇧' },
  ]

  const [selectedCountry, setSelectedCountry] = React.useState(countries[0])
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [open, setOpen] = React.useState(false)

  const handleCountrySelect = (countryCode: string) => {
    const country = countries.find((c) => c.code === countryCode)
    if (country) {
      setSelectedCountry(country)
      setOpen(false)
    }
  }

  return (
    <div className="flex items-center w-72">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-24 items-center justify-between rounded-e-none border-e-0 bg-transparent"
          >
            <span className="flex items-center gap-1.5">
              <span className="text-sm leading-none">
                {selectedCountry.flag}
              </span>
              <span className="text-xs leading-none">
                {selectedCountry.dialCode}
              </span>
            </span>
            <ButtonArrow />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0" align="start">
          <Command>
            <CommandInput placeholder="Search country..." />
            <CommandList>
              <ScrollArea className="h-72">
                <CommandEmpty>No country found.</CommandEmpty>
                <CommandGroup>
                  {countries.map((country) => (
                    <CommandItem
                      key={country.code}
                      value={`${country.name} ${country.dialCode}`}
                      onSelect={() => handleCountrySelect(country.code)}
                    >
                      <span className="flex items-center gap-1.5 leading-none">
                        <span className="text-sm">{country.flag}</span>
                        <span className="text-sm text-foreground truncate">
                          {country.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {country.dialCode}
                        </span>
                      </span>
                      {selectedCountry.code === country.code && (
                        <CommandCheck />
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </ScrollArea>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Input
        type="tel"
        placeholder="Enter phone number"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="rounded-l-none flex-1"
      />
    </div>
  )
}

export function TimezoneCombobox() {
  const [value, setValue] = React.useState<string>('Europe/London')

  const timezones = React.useMemo(() => {
    const zones = Intl.supportedValuesOf('timeZone')
    return zones
      .map((timezone) => {
        const formatter = new Intl.DateTimeFormat('en', {
          timeZone: timezone,
          timeZoneName: 'shortOffset',
        })
        const parts = formatter.formatToParts(new Date())
        const offset =
          parts.find((part) => part.type === 'timeZoneName')?.value || ''
        const formattedOffset = offset === 'GMT' ? 'GMT+0' : offset

        return {
          value: timezone,
          label: `(${formattedOffset}) ${timezone.replace(/_/g, ' ')}`,
          numericOffset: parseInt(
            formattedOffset.replace('GMT', '').replace('+', '') || '0',
          ),
        }
      })
      .sort((a, b) => a.numericOffset - b.numericOffset)
  }, [])

  return (
    <Combobox
      options={timezones.map((tz) => ({
        value: tz.value,
        label: tz.label,
      }))}
      value={value}
      onChange={(newValue) =>
        setValue(typeof newValue === 'string' ? newValue : '')
      }
      placeholder="Select a timezone"
      searchPlaceholder="Search timezone..."
      showScrollArea
      scrollAreaHeight="300px"
      className="w-72"
    />
  )
}
/**
@example
Basic single selection
<SingleCombobox
  options={topCities}
  value={selectedCity}
  onChange={setSelectedCity}
  placeholder="Select city..."
/>

@example
Multiple selection with badges
<MultipleCombobox
  options={topCities}
  value={selectedCities}
  onChange={setSelectedCities}
  displayMode="badges"
  placeholder="Select cities..."
/>

@example
With icons
<IconCombobox
  options={serviceCategories}
  value={selectedCategory}
  onChange={setSelectedCategory}
  placeholder="Select category..."
/>

// With avatars and status
<AvatarCombobox
  options={users}
  value={selectedUser}
  onChange={setSelectedUser}
  placeholder="Select user..."
/>

// With status dots
<StatusCombobox
  options={statusOptions}
  value={selectedStatus}
  onChange={setSelectedStatus}
  placeholder="Select status..."
/>

// With flags
<FlagCombobox
  options={countries}
  value={selectedCountry}
  onChange={setSelectedCountry}
  placeholder="Select country..."
/>

// Grouped options
<Combobox
  options={groupedCountries}
  value={selectedCountry}
  onChange={setSelectedCountry}
  placeholder="Select country..."
  showScrollArea
/>

// Timezone selector
<TimezoneCombobox />

// Phone input
<PhoneCombobox />
 */
