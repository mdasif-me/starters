export enum EScope {
  LOGIN = 'login',
  REGISTER = 'register',
  VERIFY = 'verify',
}
export interface User {
  id: string
  name: string
  phone_number: string
  role: 'admin' | 'user' | 'manager'
  permissions?: string[]
  avatar?: string
}

export interface AuthResponse {
  user: User
  token: string
  message?: string
}

export type Role = User['role']
