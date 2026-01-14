import { SingleCombobox, type TComboboxOption } from '@/components/combobox'
import { Button } from '@/components/ui/button'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronLeft, LoaderCircleIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useInfo } from '../hooks'
import { infoSchema, type companyInfo } from '../schema'
import { EBuisnessType } from '../types'

const businessTypeOptions: TComboboxOption[] = [
  {
    value: EBuisnessType.SOLE_PROPRIETORSHIP,
    label: 'Sole Proprietorship',
  },
  {
    value: EBuisnessType.LIMITED_COMPANY,
    label: 'Limited Company',
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
      type: EBuisnessType.SOLE_PROPRIETORSHIP,
      registration_number: '',
      tin: '',
      trade_license_number: '',
      vat_number: '',
      date_of_incorporation: '',
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
    addInformation({ data, phone_number: '' })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full sm:w-sm space-y-6"
      >
        {/* STEP 1: BUSINESS INFO */}
        {step === 'business-info' && (
          <>
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Business Information</h2>
                <p className="text-sm text-muted-foreground">
                  Step 1 of 2 - Enter your company details
                </p>
              </div>

              <FormField
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
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
                    <FormLabel>Business Type</FormLabel>
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

              <FormField
                control={form.control}
                name="trade_license_number"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Trade License Number</FormLabel>
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
                name="tin"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>TIN</FormLabel>
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
                name="vat_number"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>VAT Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter 13-digit VAT number"
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
                      <FormLabel>Registration Number</FormLabel>
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

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={handleBusinessInfoNext}
                className="w-full"
                disabled={isPending}
              >
                Next Step
              </Button>
            </div>
          </>
        )}

        {/* STEP 2: ORGANIZATION DETAILS */}
        {step === 'organization-details' && (
          <>
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold">Organization Details</h2>
                <p className="text-sm text-muted-foreground">
                  Step 2 of 2 - Enter your organization information
                </p>
              </div>

              <FormField
                control={form.control}
                name="date_of_incorporation"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Date of Incorporation</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        aria-invalid={!!fieldState.error}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="registered_address"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Registered Address</FormLabel>
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
                    <FormLabel>Mailing Address</FormLabel>
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
                    <FormLabel>Email Address</FormLabel>
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
                    <FormLabel>Website</FormLabel>
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

            <div className="flex items-center gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToBusinessInfo}
                disabled={isPending}
                className="w-10 px-0"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="primary"
                disabled={isPending}
                type="submit"
                className="flex-1"
              >
                {isPending ? (
                  <LoaderCircleIcon className="animate-spin size-4" />
                ) : null}
                {isPending ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  )
}
