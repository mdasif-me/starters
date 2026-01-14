export enum EBuisnessType {
  PUBLIC_LIMITED_COMPANY = 'public_limited_company',
  SOLE_PROPRIETORSHIP = 'sole_proprietorship',
  LIMITED_COMPANY = 'limited_company',
}

export interface IInfoResponse {
  status_code: number
  message: string
  access_token: string
}
