export enum EScope {
  LOGIN = 'login',
  REGISTER = 'register',
  VERIFY = 'verify',
}
export enum ERole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
  COMPANY = 'company',
}
export type TVerificationStatus = 'pending' | 'verified' | 'rejected'

export interface ICompanyInfo {
  name: string
  type: string
  tin: string
  logo: string
  website: string
  vat_number: string
  email_address: string
  mailing_address: string
  registered_address: string
  registration_number: string
  trade_license_number: string
  date_of_incorporation: string
  verification_status: TVerificationStatus
}

export interface IUser {
  id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  role: string
  full_name: string | null
  profile_picture: string | null
  phone_number: string
  email_address: string | null
  otp: string | null
  is_company: boolean
  is_verified: boolean
  company_info: ICompanyInfo | null
  employee_info: any | null
}

export interface IUserResponse {
  status_code: number
  message: string
  edge: {
    node: string
    data: IUser
  }
}
export interface IAuthResponse {
  status_code: number
  message: string
  access_token: string
}
