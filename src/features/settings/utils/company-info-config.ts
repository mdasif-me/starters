export type IFieldConfig = {
  label: string
  order: number
  isVisible: boolean
}

export const companyInfoConfig: Record<string, IFieldConfig> = {
  name: { label: 'Company Name', order: 1, isVisible: true },
  type: { label: 'Business Type', order: 2, isVisible: true },
  registration_number: {
    label: 'Registration Number',
    order: 3,
    isVisible: true,
  },
  tin: { label: 'TIN Number', order: 4, isVisible: true },
  trade_license_number: {
    label: 'Tr. License Number',
    order: 5,
    isVisible: true,
  },
  vat_number: { label: 'VAT Reg. Number', order: 6, isVisible: true },
  date_of_incorporation: {
    label: 'Date of Incor.',
    order: 7,
    isVisible: true,
  },
  registered_address: {
    label: 'Registered Address',
    order: 8,
    isVisible: true,
  },
  email_address: { label: 'Email Address', order: 9, isVisible: false },
  mailing_address: { label: 'Mailing Address', order: 10, isVisible: true },
  website: { label: 'Company Website', order: 11, isVisible: true },
  verification_status: {
    label: 'Verification Status',
    order: 12,
    isVisible: false,
  },
  logo: { label: 'Company Logo', order: 13, isVisible: false },
}
