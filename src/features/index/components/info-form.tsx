import { SingleCombobox, type TComboboxOption } from '@/components/combobox'
import { Button } from '@/components/ui/button'
import DatePicker from '@/components/ui/date-picker'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, LoaderCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useInfo } from '../hooks'
import { infoSchema, type companyInfo } from '../schema'
import { EBuisnessType } from '../types'

const businessTypeOptions: TComboboxOption[] = [
  {
    value: EBuisnessType.LIMITED_COMPANY,
    label: 'Limited Company',
  },
  {
    value: EBuisnessType.SOLE_PROPRIETORSHIP,
    label: 'Sole Proprietorship',
  },
  {
    value: EBuisnessType.PUBLIC_LIMITED_COMPANY,
    label: 'Public Limited Company',
  },
]

type FormStep = 'business-info' | 'organization-details'

export default function InfoForm() {
  const { mutate: addInformation, isPending } = useInfo()
  const [step, setStep] = useState<FormStep>('business-info')

  const form = useForm<companyInfo>({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      name: '',
      type: EBuisnessType.LIMITED_COMPANY,
      registration_number: '01234567891234',
      tin: '',
      trade_license_number: '',
      vat_number: '',
      date_of_incorporation: undefined,
      registered_address: '',
      mailing_address: '',
      email_address: '',
      website: '',
    },
    mode: 'onSubmit',
  })

  const handleBusinessInfoNext = async () => {
    const isValid = await form.trigger([
      'name',
      'type',
      'registration_number',
      'tin',
      'trade_license_number',
      'vat_number',
    ])

    if (isValid) {
      setStep('organization-details')
    }
  }

  const handleBackToBusinessInfo = () => {
    setStep('business-info')
  }

  function onSubmit(data: companyInfo) {
    addInformation(data)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full sm:w-xl space-y-6"
      >
        {/* STEP 1: BUSINESS INFO */}
        {step === 'business-info' && (
          <div className="space-y-4 p-6">
            <article>
              <h2 className="md:text-2xl text-lg font-semibold">
                Add Company Information
              </h2>
              <p className="text-muted-foreground md:text-base text-sm">
                Fill out all the requirements to continue this application.
              </p>
            </article>
            <Separator className="my-4" />
            <ScrollArea className="max-h-[75vh] overflow-auto">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          Company Name{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter company name"
                            aria-invalid={!!fieldState.error}
                          />
                        </FormControl>
                        <FormDescription>
                          Enter your company registered name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Business Type{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <SingleCombobox
                            options={businessTypeOptions}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select business type..."
                            disabled={isPending}
                          />
                        </FormControl>
                        <FormDescription>
                          Select your company's business type.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="tin"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        TIN Number <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter 12-digit TIN"
                          aria-invalid={!!fieldState.error}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="trade_license_number"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Trade License Number{' '}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter trade license number"
                          aria-invalid={!!fieldState.error}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vat_number"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        VAT Number <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter 9-digit VAT number"
                          aria-invalid={!!fieldState.error}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('type') !== EBuisnessType.SOLE_PROPRIETORSHIP && (
                  <FormField
                    control={form.control}
                    name="registration_number"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel>
                          Registration Number{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter registration number"
                            aria-invalid={!!fieldState.error}
                          />
                        </FormControl>
                        <FormDescription>
                          Required for limited/public companies.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </ScrollArea>
            <Separator className="my-4" />
            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                onClick={handleBusinessInfoNext}
                className="w-full gradient-btn"
                disabled={isPending}
              >
                Next Step
              </Button>
            </div>
          </div>
        )}

        {/* STEP 2: ORGANIZATION DETAILS */}
        {step === 'organization-details' && (
          <div className="space-y-4 p-6">
            <article>
              <h2 className="md:text-2xl text-lg font-semibold">
                Add Company Information
              </h2>
              <p className="text-muted-foreground md:text-base text-sm">
                Fill out all the requirements to continue this application.
              </p>
            </article>
            <Separator className="my-4" />
            <ScrollArea className="max-h-[75vh] overflow-auto">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="date_of_incorporation"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>
                          Date of Incorporation{' '}
                          <span className="text-destructive">*</span>
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            mode="single"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select date of incorporation"
                            required
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )
                  }}
                />

                <FormField
                  control={form.control}
                  name="registered_address"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Registered Address{' '}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter registered address"
                          aria-invalid={!!fieldState.error}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mailing_address"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Mailing Address{' '}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter mailing address"
                          aria-invalid={!!fieldState.error}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email_address"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Email Address{' '}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter email address"
                          aria-invalid={!!fieldState.error}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>
                        Company Website{' '}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="url"
                          placeholder="Enter website URL"
                          aria-invalid={!!fieldState.error}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>
            <Separator className="my-4" />
            <div className="flex items-center gap-2.5">
              <Button
                size={'lg'}
                type="button"
                variant="outline"
                onClick={handleBackToBusinessInfo}
                disabled={isPending}
                className="w-14 h-11 px-0"
              >
                <ChevronLeft className="size-7 text-foreground/90" />
              </Button>
              <Button
                disabled={isPending}
                type="submit"
                className="flex-1 gradient-btn"
              >
                {isPending ? (
                  <LoaderCircleIcon className="animate-spin size-4" />
                ) : null}
                {isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  )
}
