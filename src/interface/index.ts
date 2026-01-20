export interface IApiResponse<T> {
  status_code: number
  message: string
  data: IPaginatedData<T>
}

export interface IPaginatedData<T> {
  metadata: IMetadata
  edges: IEdge<T>[]
}

export interface IMetadata {
  offset: number
  limit: number
  total_items: number
  total_pages: number
  has_next: boolean
  has_previous: boolean
}

export interface IEdge<T> {
  node: string
  data: T
}
export interface IApiResponseSingle<T> {
  status_code: number
  message: string
  edge: IEdge<T>
}
