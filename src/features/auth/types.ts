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

export interface IUser {
  id: string
  role: ERole
  full_name: string | null
  profile_picture: string | null
  phone_number: string
  email_address: string | null
  otp: string | null
  is_company: boolean
  is_verified: boolean
  company_info: any | null
  employee_info: any | null
  created_at: string
  updated_at: string
  deleted_at: string | null
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
