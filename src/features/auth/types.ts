export enum EScope {
  LOGIN = 'login',
  REGISTER = 'register',
}
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'manager'
  permissions?: string[]
  avatar?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export type Role = User['role']
