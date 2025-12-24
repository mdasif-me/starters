export enum EScope {
  LOGIN = 'login',
  REGISTER = 'register',
  VERIFY = 'verify',
}
export enum ERole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
}

export interface IUser {
  id: string
  name: string
  phone_number: string
  role: ERole
  permissions?: string[]
  avatar?: string
}

export interface IAuthResponse {
  status_code: number
  message: string
  access_token: string
}
