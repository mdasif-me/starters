'use client'

import { Badge, BadgeButton } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { ChevronDown, X } from 'lucide-react'
import * as React from 'react'
import {
  type ControllerRenderProps,
  type FieldValues,
  type Path,
} from 'react-hook-form'

export type ComboboxOption<TValue extends string = string> = {
  value: TValue
  label: string
  disabled?: boolean
  [key: string]: unknown
}

export type ComboboxGroup<TValue extends string = string> = {
  group: string
  options: ComboboxOption<TValue>[]
}

export type ComboboxData<TValue extends string = string> =
  | ComboboxOption<TValue>[]
  | ComboboxGroup<TValue>[]

export type ComboboxMode = 'single' | 'multiple'

export type ComboboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
  TValue extends string = string,
> = {
  field: ControllerRenderProps<TFieldValues, TName>
  options: ComboboxData<TValue>
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  mode?: ComboboxMode
  className?: string
  popoverClassName?: string
  triggerClassName?: string
  renderOption?: (option: ComboboxOption<TValue>) => React.ReactNode
  renderSelected?: (option: ComboboxOption<TValue>) => React.ReactNode
  renderTrigger?: (selected: ComboboxOption<TValue>[] | null) => React.ReactNode
  maxHeight?: string
  showCheck?: boolean
  footer?: React.ReactNode
  maxVisibleBadges?: number
  disabled?: boolean
  onValueChange?: (value: string | string[]) => void
}

function isGroupedOptions<TValue extends string>(
  options: ComboboxData<TValue>,
): options is ComboboxGroup<TValue>[] {
  return options.length > 0 && 'group' in options[0]
}

function flattenOptions<TValue extends string>(
  options: ComboboxData<TValue>,
): ComboboxOption<TValue>[] {
  if (isGroupedOptions(options)) {
    return options.flatMap((group) => group.options)
  }
  return options
}

export function Combobox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
  TValue extends string = string,
>({
  field,
  options,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  mode = 'single',
  popoverClassName,
  triggerClassName,
  renderOption,
  renderSelected,
  renderTrigger,
  showCheck = true,
  footer,
  maxVisibleBadges = 2,
  disabled = false,
  onValueChange,
}: ComboboxProps<TFieldValues, TName, TValue>) {
  const [open, setOpen] = React.useState(false)
  const [expanded, setExpanded] = React.useState(false)

  const flatOptions = React.useMemo(() => flattenOptions(options), [options])

  const selectedValues = React.useMemo(() => {
    if (mode === 'multiple') {
      return Array.isArray(field.value) ? field.value : ([] as TValue[])
    }
    return field.value ? [field.value as TValue] : ([] as TValue[])
  }, [field.value, mode])

  const selectedOptions = React.useMemo(() => {
    return selectedValues
      .map((val) => flatOptions.find((opt) => opt.value === val))
      .filter(Boolean) as ComboboxOption<TValue>[]
  }, [selectedValues, flatOptions])

  const handleSelect = React.useCallback(
    (optionValue: string) => {
      const option = flatOptions.find((opt) => opt.value === optionValue)
      if (option?.disabled) return

      if (mode === 'single') {
        const newValue = field.value === optionValue ? '' : optionValue
        field.onChange(newValue)
        onValueChange?.(newValue)
        setOpen(false)
      } else {
        const currentValues = Array.isArray(field.value)
          ? field.value
          : ([] as string[])
        const newValues = currentValues.includes(optionValue)
          ? currentValues.filter((v) => v !== optionValue)
          : [...currentValues, optionValue]
        field.onChange(newValues)
        onValueChange?.(newValues)
      }
    },
    [field, mode, flatOptions, onValueChange],
  )

  const handleRemove = React.useCallback(
    (optionValue: string, e?: React.MouseEvent) => {
      e?.stopPropagation()
      if (mode === 'single') {
        field.onChange('')
        onValueChange?.('')
      } else {
        const currentValues = Array.isArray(field.value) ? field.value : []
        const newValues = currentValues.filter((v) => v !== optionValue)
        field.onChange(newValues)
        onValueChange?.(newValues)
      }
    },
    [field, mode, onValueChange],
  )

  const renderTriggerContent = React.useCallback(() => {
    if (renderTrigger) {
      return renderTrigger(selectedOptions.length > 0 ? selectedOptions : null)
    }

    if (mode === 'single') {
      if (selectedOptions.length === 0) {
        return <span>{placeholder}</span>
      }
      const selected = selectedOptions[0]
      return renderSelected ? (
        renderSelected(selected)
      ) : (
        <span className="truncate">{selected.label}</span>
      )
    }

    if (selectedOptions.length === 0) {
      return <span className="px-2.5">{placeholder}</span>
    }

    const visibleOptions = expanded
      ? selectedOptions
      : selectedOptions.slice(0, maxVisibleBadges)
    const hiddenCount = selectedOptions.length - visibleOptions.length

    return (
      <div className="flex flex-wrap items-center gap-1 pe-2.5">
        {visibleOptions.map((option) => (
          <Badge key={option.value} variant="outline">
            {renderSelected ? renderSelected(option) : option.label}
            <BadgeButton onClick={(e) => handleRemove(option.value, e)}>
              <X />
            </BadgeButton>
          </Badge>
        ))}
        {(hiddenCount > 0 || expanded) &&
          selectedOptions.length > maxVisibleBadges && (
            <Badge
              className="cursor-pointer px-1.5 text-muted-foreground hover:bg-accent"
              appearance="ghost"
              onClick={(e) => {
                e.stopPropagation()
                setExpanded((prev) => !prev)
              }}
            >
              {expanded ? 'Show Less' : `+${hiddenCount} more`}
            </Badge>
          )}
      </div>
    )
  }, [
    renderTrigger,
    selectedOptions,
    mode,
    placeholder,
    renderSelected,
    expanded,
    maxVisibleBadges,
    handleRemove,
  ])

  const renderOptionContent = React.useCallback(
    (option: ComboboxOption<TValue>) => {
      if (renderOption) {
        return renderOption(option)
      }
      return <span className="truncate">{option.label}</span>
    },
    [renderOption],
  )

  const renderCommandItems = React.useCallback(() => {
    if (isGroupedOptions(options)) {
      return options.map((group) => (
        <CommandGroup key={group.group} heading={group.group}>
          {group.options.map((option) => (
            <CommandItem
              key={option.value}
              value={option.value}
              onSelect={handleSelect}
              disabled={option.disabled}
              className={cn(option.disabled && 'cursor-not-allowed opacity-50')}
            >
              {renderOptionContent(option)}
              {showCheck &&
                selectedValues.includes(option.value) &&
                !option.disabled && <CommandCheck />}
            </CommandItem>
          ))}
        </CommandGroup>
      ))
    }

    return (
      <CommandGroup>
        {flatOptions.map((option) => (
          <CommandItem
            key={option.value}
            value={option.value}
            onSelect={handleSelect}
            disabled={option.disabled}
            className={cn(option.disabled && 'cursor-not-allowed opacity-50')}
          >
            {renderOptionContent(option)}
            {showCheck &&
              selectedValues.includes(option.value) &&
              !option.disabled && <CommandCheck />}
          </CommandItem>
        ))}
      </CommandGroup>
    )
  }, [
    options,
    flatOptions,
    handleSelect,
    renderOptionContent,
    showCheck,
    selectedValues,
  ])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            'w-full justify-between',
            mode === 'multiple' && 'h-auto min-h-10 p-1 relative',
            triggerClassName,
          )}
        >
          {renderTriggerContent()}
          <ChevronDown
            className={cn(
              'size-4 shrink-0 opacity-50',
              mode === 'multiple' && 'absolute top-2 end-3',
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('w-(--radix-popper-anchor-width) p-0', popoverClassName)}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <ScrollArea
              viewportClassName={cn('max-h-[300px]', '[&>div]:block!')}
            >
              <CommandEmpty>{emptyText}</CommandEmpty>
              {renderCommandItems()}
            </ScrollArea>
          </CommandList>
          {footer && (
            <>
              <CommandSeparator />
              {footer}
            </>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
/**
 * Usage @example:
const topCities = [
  { value: 'amsterdam', label: 'Amsterdam, Netherlands' },
  { value: 'london', label: 'London, UK' },
  { value: 'paris', label: 'Paris, France' },
  { value: 'tokyo', label: 'Tokyo, Japan' },
  { value: 'new_york', label: 'New York, USA' },
  { value: 'dubai', label: 'Dubai, UAE' },
];

const groupedCountries = [
  {
    group: 'Europe',
    options: [
      { value: 'netherlands', label: 'Netherlands', flag: '🇳🇱' },
      { value: 'united_kingdom', label: 'United Kingdom', flag: '🇬🇧' },
      { value: 'france', label: 'France', flag: '🇫🇷' },
      { value: 'germany', label: 'Germany', flag: '🇩🇪' },
    ],
  },
  {
    group: 'Asia',
    options: [
      { value: 'japan', label: 'Japan', flag: '🇯🇵' },
      { value: 'china', label: 'China', flag: '🇨🇳' },
      { value: 'india', label: 'India', flag: '🇮🇳' },
    ],
  },
];

const programmingLanguages = [
  { value: 'javascript', label: 'JavaScript', disabled: false },
  { value: 'python', label: 'Python', disabled: false },
  { value: 'java', label: 'Java', disabled: true },
  { value: 'csharp', label: 'C#', disabled: false },
];

const statusOptions = [
  { value: 'active', label: 'Active', state: 'bg-green-500' },
  {
    value: 'inactive',
    label: 'Inactive',
    state: 'bg-zinc-600 dark:bg-zinc-300',
  },
  { value: 'pending', label: 'Pending', state: 'bg-yellow-500' },
];

const categories = [
  { value: 'publishing', label: 'Digital Publishing', variant: 'primary' },
  { value: 'finance', label: 'Finance Tools', variant: 'destructive' },
  { value: 'b2b', label: 'B2B Solutions', variant: 'primary' },
  { value: 'enterprise', label: 'Enterprise Apps', variant: 'secondary' },
];

const users = [
  {
    value: 'alice-johnson',
    label: 'Alice Johnson',
    email: 'alice.johnson@gmail.com',
    avatar: '/media/avatars/1.png',
    status: 'online',
  },
  {
    value: 'bob-smith',
    label: 'Bob Smith',
    email: 'bob.smith@yahoo.com',
    avatar: '/media/avatars/2.png',
    status: 'offline',
  },
  {
    value: 'carol-davis',
    label: 'Carol Davis',
    email: 'carol.davis@hotmail.com',
    avatar: '/media/avatars/3.png',
    status: 'away',
  },
];

const FormSchema = z.object({
  city: z.string().min(1, 'City is required'),
  country: z.string().min(1, 'Country is required'),
  language: z.string().optional(),
  status: z.string().min(1, 'Status is required'),
  category: z.string().optional(),
  user: z.string().optional(),
  multipleCities: z.array(z.string()).min(1, 'Select at least one city'),
  multipleUsers: z.array(z.string()).optional(),
});

export default function ComboboxExamples() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      city: '',
      country: '',
      language: '',
      status: '',
      category: '',
      user: '',
      multipleCities: [],
      multipleUsers: [],
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };

  return (
    <div className='max-w-4xl mx-auto p-8 space-y-8'>
      <div>
        <h1 className='text-3xl font-bold mb-2'>Combobox Examples</h1>
        <p className='text-muted-foreground'>
          Complete reusable combobox component with React Hook Form integration
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='city'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Basic Single Select</FormLabel>
                <FormControl>
                  <Combobox
                    field={field}
                    options={topCities}
                    placeholder='Select city...'
                    searchPlaceholder='Search city...'
                    emptyText='No city found.'
                    triggerClassName='w-[300px]'
                  />
                </FormControl>
                <FormDescription>Select your preferred city</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='country'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grouped Options with Flags</FormLabel>
                <FormControl>
                  <Combobox
                    field={field}
                    options={groupedCountries}
                    placeholder='Select country...'
                    searchPlaceholder='Search country...'
                    emptyText='No country found.'
                    triggerClassName='w-[300px]'
                    renderOption={(option) => (
                      <span className='flex items-center gap-2'>
                        <span className='text-sm'>{option.flag}</span>
                        {option.label}
                      </span>
                    )}
                    renderSelected={(option) => (
                      <span className='flex items-center gap-2 truncate'>
                        <span className='text-sm'>{option.flag}</span>
                        {option.label}
                      </span>
                    )}
                  />
                </FormControl>
                <FormDescription>
                  Countries grouped by continent
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='language'
            render={({ field }) => (
              <FormItem>
                <FormLabel>With Disabled Options</FormLabel>
                <FormControl>
                  <Combobox
                    field={field}
                    options={programmingLanguages}
                    placeholder='Select language...'
                    searchPlaceholder='Search language...'
                    emptyText='No language found.'
                    triggerClassName='w-[300px]'
                  />
                </FormControl>
                <FormDescription>Some options are disabled</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='status'
            render={({ field }) => (
              <FormItem>
                <FormLabel>With Status Indicators</FormLabel>
                <FormControl>
                  <Combobox
                    field={field}
                    options={statusOptions}
                    placeholder='Select status...'
                    searchPlaceholder='Search status...'
                    emptyText='No status found.'
                    triggerClassName='w-[300px]'
                    renderOption={(option) => (
                      <span className='flex items-center gap-2.5'>
                        <span
                          className={`ms-1 size-1.5 rounded-full ${option.state}`}
                        ></span>
                        <span className='truncate'>{option.label}</span>
                      </span>
                    )}
                    renderSelected={(option) => (
                      <span className='flex items-center gap-2.5'>
                        <span
                          className={`ms-0.5 size-1.5 rounded-full ${option.state}`}
                        ></span>
                        <span className='truncate'>{option.label}</span>
                      </span>
                    )}
                  />
                </FormControl>
                <FormDescription>
                  Status with colored indicators
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem>
                <FormLabel>With Badge Variants</FormLabel>
                <FormControl>
                  <Combobox
                    field={field}
                    options={categories}
                    placeholder='Select category...'
                    searchPlaceholder='Search category...'
                    emptyText='No category found.'
                    triggerClassName='w-[300px]'
                    renderOption={(option) => (
                      <Badge
                        variant={option.variant as keyof BadgeProps['variant']}
                        appearance='outline'
                      >
                        {option.label}
                      </Badge>
                    )}
                    renderSelected={(option) => (
                      <Badge
                        variant={option.variant as keyof BadgeProps['variant']}
                        appearance='outline'
                      >
                        {option.label}
                      </Badge>
                    )}
                  />
                </FormControl>
                <FormDescription>Options displayed as badges</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='user'
            render={({ field }) => (
              <FormItem>
                <FormLabel>With Avatar and Status</FormLabel>
                <FormControl>
                  <Combobox
                    field={field}
                    options={users}
                    placeholder='Select user...'
                    searchPlaceholder='Search user...'
                    emptyText='No users found.'
                    triggerClassName='w-[350px]'
                    renderOption={(option) => (
                      <span className='flex items-center gap-2'>
                        <Avatar className='size-7'>
                          <AvatarImage src={option.avatar} alt={option.label} />
                          <AvatarFallback>{option.label[0]}</AvatarFallback>
                          <AvatarIndicator className='-end-2 -bottom-2'>
                            <AvatarStatus
                              variant={option.status as any}
                              className='size-2.5'
                            />
                          </AvatarIndicator>
                        </Avatar>
                        <span className='flex flex-col'>
                          <span className='font-medium'>{option.label}</span>
                          <span className='text-muted-foreground text-sm'>
                            {option.email}
                          </span>
                        </span>
                      </span>
                    )}
                    renderSelected={(option) => (
                      <span className='flex items-center gap-2'>
                        <Avatar className='size-6'>
                          <AvatarImage src={option.avatar} alt={option.label} />
                          <AvatarFallback>{option.label[0]}</AvatarFallback>
                          <AvatarIndicator className='-end-2 -bottom-2'>
                            <AvatarStatus
                              variant={option.status as any}
                              className='size-2.5'
                            />
                          </AvatarIndicator>
                        </Avatar>
                        <span className='font-medium'>{option.label}</span>
                      </span>
                    )}
                  />
                </FormControl>
                <FormDescription>User selector with avatars</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='multipleCities'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Multiple Select</FormLabel>
                <FormControl>
                  <Combobox
                    field={field}
                    options={topCities}
                    mode='multiple'
                    placeholder='Select cities...'
                    searchPlaceholder='Search city...'
                    emptyText='No city found.'
                    triggerClassName='w-[350px]'
                    maxVisibleBadges={3}
                  />
                </FormControl>
                <FormDescription>
                  Select multiple cities with expandable badges
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='multipleUsers'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Multiple Select with Avatars</FormLabel>
                <FormControl>
                  <Combobox
                    field={field}
                    options={users}
                    mode='multiple'
                    placeholder='Select users...'
                    searchPlaceholder='Search user...'
                    emptyText='No users found.'
                    triggerClassName='w-[400px]'
                    maxVisibleBadges={2}
                    renderOption={(option) => (
                      <span className='flex items-center gap-2'>
                        <Avatar className='size-7'>
                          <AvatarImage src={option.avatar} alt={option.label} />
                          <AvatarFallback>{option.label[0]}</AvatarFallback>
                        </Avatar>
                        <span className='flex flex-col'>
                          <span className='font-medium'>{option.label}</span>
                          <span className='text-muted-foreground text-sm'>
                            {option.email}
                          </span>
                        </span>
                      </span>
                    )}
                    renderSelected={(option) => (
                      <span className='flex items-center gap-1.5'>
                        <Avatar className='size-4'>
                          <AvatarImage src={option.avatar} alt={option.label} />
                          <AvatarFallback className='text-xs'>
                            {option.label[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className='font-medium'>{option.label}</span>
                      </span>
                    )}
                  />
                </FormControl>
                <FormDescription>Select multiple users</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='flex items-center justify-end gap-2.5 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => form.reset()}
            >
              Reset
            </Button>
            <Button type='submit'>Submit</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

 */
