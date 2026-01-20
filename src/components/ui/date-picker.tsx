'use client'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  addDays,
  endOfMonth,
  endOfYear,
  format,
  isEqual,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
} from 'date-fns'
import { CalendarIcon, Clock, X } from 'lucide-react'
import * as React from 'react'
import type { DateRange } from 'react-day-picker'

export type DatePickerMode = 'single' | 'range' | 'date-time' | 'preset-range'
export type TimeSlot = { time: string; available: boolean }

export type DatePickerProps = {
  mode?: DatePickerMode
  value?: Date | DateRange
  onChange?: (value: Date | DateRange | undefined) => void
  placeholder?: string
  className?: string

  minDate?: Date
  maxDate?: Date

  showTimePicker?: boolean
  timeSlots?: TimeSlot[]
  selectedTime?: string
  onTimeChange?: (time: string) => void

  showPresets?: boolean
  presets?: Array<{
    label: string
    range: DateRange
  }>

  showClearButton?: boolean
  showApplyButton?: boolean
  showResetButton?: boolean

  calendarProps?: React.ComponentProps<typeof Calendar>
  numberOfMonths?: number

  disabled?: boolean
  required?: boolean
  name?: string

  formatter?: (date: Date) => string
}

const DEFAULT_PRESETS = [
  { label: 'Today', range: { from: new Date(), to: new Date() } },
  {
    label: 'Yesterday',
    range: { from: subDays(new Date(), 1), to: subDays(new Date(), 1) },
  },
  {
    label: 'Last 7 days',
    range: { from: subDays(new Date(), 6), to: new Date() },
  },
  {
    label: 'Last 30 days',
    range: { from: subDays(new Date(), 29), to: new Date() },
  },
  {
    label: 'Month to date',
    range: { from: startOfMonth(new Date()), to: new Date() },
  },
  {
    label: 'Last month',
    range: {
      from: startOfMonth(subMonths(new Date(), 1)),
      to: endOfMonth(subMonths(new Date(), 1)),
    },
  },
  {
    label: 'Year to date',
    range: { from: startOfYear(new Date()), to: new Date() },
  },
  {
    label: 'Last year',
    range: {
      from: startOfYear(subYears(new Date(), 1)),
      to: endOfYear(subYears(new Date(), 1)),
    },
  },
]

const DEFAULT_TIME_SLOTS = [
  { time: '09:00', available: false },
  { time: '09:30', available: false },
  { time: '10:00', available: true },
  { time: '10:30', available: true },
  { time: '11:00', available: true },
  { time: '11:30', available: true },
  { time: '12:00', available: false },
  { time: '12:30', available: true },
  { time: '13:00', available: true },
  { time: '13:30', available: true },
  { time: '14:00', available: true },
  { time: '14:30', available: false },
  { time: '15:00', available: false },
  { time: '15:30', available: true },
  { time: '16:00', available: true },
  { time: '16:30', available: true },
  { time: '17:00', available: true },
  { time: '17:30', available: true },
  { time: '18:00', available: true },
  { time: '18:30', available: true },
  { time: '19:00', available: true },
  { time: '19:30', available: true },
  { time: '20:00', available: true },
  { time: '20:30', available: true },
  { time: '21:00', available: true },
  { time: '21:30', available: true },
  { time: '22:00', available: true },
  { time: '22:30', available: true },
  { time: '23:00', available: true },
  { time: '23:30', available: true },
  { time: '24:00', available: true },
]

export default function DatePicker({
  mode = 'single',
  value,
  onChange,
  placeholder = 'Pick a date',
  className = 'w-full',
  minDate,
  maxDate,
  showTimePicker = false,
  timeSlots = DEFAULT_TIME_SLOTS,
  selectedTime,
  onTimeChange,
  showPresets = false,
  presets = DEFAULT_PRESETS,
  showClearButton = true,
  showApplyButton = false,
  showResetButton = false,
  calendarProps,
  numberOfMonths = 1,
  disabled = false,
  required = false,
  name,
  formatter = (date) => format(date, 'PPP'),
}: DatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<
    Date | DateRange | undefined
  >(
    mode === 'range' && !value
      ? { from: new Date(), to: addDays(new Date(), 5) }
      : value,
  )
  const [internalTime, setInternalTime] = React.useState<string | undefined>(
    selectedTime,
  )
  const [selectedPreset, setSelectedPreset] = React.useState<string | null>(
    showPresets ? presets[2]?.label : null,
  )
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false)
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(new Date())

  const currentValue = value !== undefined ? value : internalDate
  const currentTime = selectedTime !== undefined ? selectedTime : internalTime

  const isRangeMode = mode === 'range' || mode === 'preset-range'
  const isSingleMode = mode === 'single' || mode === 'date-time'
  const isDateTimeMode = mode === 'date-time'
  const isPresetMode = mode === 'preset-range'

  const handleDateChange = (newValue: Date | DateRange | undefined) => {
    if (isRangeMode) {
      const rangeValue = newValue as DateRange | undefined
      setInternalDate(rangeValue)
      onChange?.(rangeValue)

      if (isPresetMode && rangeValue?.from && rangeValue?.to) {
        const matchedPreset = presets.find(
          (preset) =>
            isEqual(
              startOfDay(preset.range.from!),
              startOfDay(rangeValue.from!),
            ) &&
            isEqual(startOfDay(preset.range.to!), startOfDay(rangeValue.to!)),
        )
        setSelectedPreset(matchedPreset?.label || null)
      }
    } else {
      const singleValue = newValue as Date | undefined
      setInternalDate(singleValue)
      onChange?.(singleValue)
    }

    if (isDateTimeMode && newValue) {
      setInternalTime(undefined)
    }
  }

  const handleTimeChange = (time: string) => {
    setInternalTime(time)
    onTimeChange?.(time)
  }

  const handlePresetSelect = (preset: (typeof presets)[0]) => {
    const rangeValue = preset.range
    setInternalDate(rangeValue)
    onChange?.(rangeValue)
    setSelectedPreset(preset.label)
    setCalendarMonth(rangeValue.from || new Date())
  }

  const handleClear = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (isRangeMode) {
      handleDateChange({ from: undefined, to: undefined })
    } else {
      handleDateChange(undefined)
    }

    if (isDateTimeMode) {
      handleTimeChange(undefined!)
    }

    setSelectedPreset(null)
  }

  const handleApply = () => {
    if (currentValue) {
      onChange?.(currentValue)
    }
    setIsPopoverOpen(false)
  }

  const handleReset = () => {
    const defaultValue =
      isPresetMode && presets[2] ? presets[2].range : undefined
    handleDateChange(defaultValue)
    setSelectedPreset(isPresetMode && presets[2] ? presets[2].label : null)
    setIsPopoverOpen(false)
  }

  const renderTriggerContent = () => {
    if (!currentValue) {
      return <span>{placeholder}</span>
    }

    if (isRangeMode && 'from' in currentValue) {
      const rangeValue = currentValue as DateRange
      if (rangeValue.from) {
        const fromDate = formatter(rangeValue.from)
        const toDate = rangeValue.to ? formatter(rangeValue.to) : ''
        return (
          <>
            {fromDate}
            {toDate && ` - ${toDate}`}
            {isDateTimeMode && currentTime && ` - ${currentTime}`}
          </>
        )
      }
    } else if (isSingleMode && currentValue instanceof Date) {
      return (
        <>
          {formatter(currentValue)}
          {isDateTimeMode && currentTime && ` - ${currentTime}`}
        </>
      )
    }

    return <span>{placeholder}</span>
  }

  const renderCalendar = () => {
    const commonProps = {
      ...calendarProps,
      month: calendarMonth,
      onMonthChange: setCalendarMonth,
      disabled:
        minDate || maxDate ? [{ before: minDate, after: maxDate }] : undefined,
      showOutsideDays: false,
      autoFocus: true,
    }

    if (isRangeMode) {
      return (
        <Calendar
          {...({
            mode: 'range',
            selected:
              isRangeMode && currentValue && 'from' in currentValue
                ? currentValue
                : undefined,
            onSelect: (date: any) => handleDateChange(date),
            numberOfMonths: numberOfMonths > 1 ? numberOfMonths : 2,
            ...commonProps,
          } as any)}
        />
      )
    }

    return (
      <Calendar
        {...({
          mode: 'single',
          selected:
            isSingleMode && currentValue instanceof Date
              ? currentValue
              : undefined,
          onSelect: (date: any) => handleDateChange(date),
          numberOfMonths: numberOfMonths,
          ...commonProps,
        } as any)}
      />
    )
  }

  const renderTimePicker = () => {
    if (!isDateTimeMode || !showTimePicker) return null

    const currentDate =
      isSingleMode && currentValue instanceof Date ? currentValue : new Date()

    return (
      <div className="relative w-full max-sm:h-48 sm:w-40">
        <div className="absolute inset-0 py-4 max-sm:border-t">
          <ScrollArea className="h-full sm:border-s">
            <div className="space-y-3">
              <div className="flex h-5 shrink-0 items-center px-5">
                <p className="text-sm font-medium">
                  {currentValue
                    ? format(currentDate, 'EEEE, d')
                    : 'Pick a date'}
                </p>
              </div>
              <div className="grid gap-1.5 px-5 max-sm:grid-cols-2">
                {timeSlots.map(({ time: timeSlot, available }) => (
                  <Button
                    key={timeSlot}
                    variant={currentTime === timeSlot ? 'primary' : 'outline'}
                    size="sm"
                    className="w-full"
                    onClick={() => handleTimeChange(timeSlot)}
                    disabled={!available}
                  >
                    {timeSlot}
                  </Button>
                ))}
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    )
  }

  const renderPresets = () => {
    if (!showPresets || !isPresetMode) return null

    return (
      <div className="relative border-border max-sm:order-1 max-sm:border-t sm:w-32">
        <div className="h-full border-border sm:border-e py-2">
          <div className="flex flex-col px-2 gap-0.5">
            {presets.map((preset, index) => (
              <Button
                key={index}
                type="button"
                variant="ghost"
                className={cn(
                  'h-8 w-full justify-start',
                  selectedPreset === preset.label && 'bg-accent',
                )}
                onClick={() => handlePresetSelect(preset)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderActionButtons = () => {
    if (!showApplyButton && !showResetButton) return null

    return (
      <div className="flex items-center justify-end gap-1.5 border-t border-border p-3">
        {showResetButton && (
          <Button variant="outline" onClick={handleReset}>
            Reset
          </Button>
        )}
        {showApplyButton && <Button onClick={handleApply}>Apply</Button>}
      </div>
    )
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <div className={cn('relative', className)}>
          <Button
            size={'lg'}
            type="button"
            variant="outline"
            mode="input"
            placeholder={!currentValue}
            className="w-full text-foreground ring-0! focus-visible:border-primary!"
            disabled={disabled}
            aria-required={required}
          >
            {isDateTimeMode && <Clock className="size-4 mr-2" />}
            {!isDateTimeMode && <CalendarIcon className="size-4 mr-2" />}
            {renderTriggerContent()}
          </Button>

          {showClearButton && currentValue && (
            <Button
              type="button"
              variant="dim"
              size="sm"
              className="absolute top-1/2 end-0 -translate-y-1/2"
              onClick={handleClear}
            >
              <X />
            </Button>
          )}

          {name && currentValue && (
            <input
              type="hidden"
              name={name}
              value={
                isRangeMode && 'from' in currentValue
                  ? `${currentValue.from?.toISOString()}|${currentValue.to?.toISOString()}`
                  : (currentValue as Date)?.toISOString() || ''
              }
            />
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent
        className={cn(
          'w-auto p-0',
          (isDateTimeMode || isPresetMode) && 'max-sm:flex-col',
          isDateTimeMode && 'flex',
        )}
        align={isPresetMode ? 'center' : 'start'}
      >
        {(isDateTimeMode || isPresetMode) && (
          <div
            className={cn(
              'flex',
              isDateTimeMode && 'max-sm:flex-col',
              isPresetMode && 'max-sm:flex-col',
            )}
          >
            {renderPresets()}
            {renderCalendar()}
            {renderTimePicker()}
          </div>
        )}

        {!isDateTimeMode && !isPresetMode && renderCalendar()}

        {renderActionButtons()}
      </PopoverContent>
    </Popover>
  )
}

/*
'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/ui/date-picker';

const formSchema = z.object({
  checkIn: z.date({ required_error: 'Check-in date is required' }),
  checkOut: z.date({ required_error: 'Check-out date is required' }),
  bookingDate: z.date().optional(),
});

export function DatePickerFormExample() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bookingDate: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log('Form data:', data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-md">
        <FormField
          control={form.control}
          name="checkIn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check-in Date</FormLabel>
              <FormControl>
                <DatePicker
                  mode="single"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select check-in date"
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="checkOut"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Check-out Date</FormLabel>
              <FormControl>
                <DatePicker
                  mode="single"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select check-out date"
                  minDate={form.watch('checkIn')}
                  required
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bookingDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Booking Date & Time</FormLabel>
              <FormControl>
                <DatePicker
                  mode="date-time"
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Select booking time"
                  showTimePicker
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit Booking</Button>
      </form>
    </Form>
  );
}
*/
