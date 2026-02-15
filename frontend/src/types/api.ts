export interface ApiError {
  status: number
  code: string
  message: string
  details?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  page: number
  size: number
}

export interface PaginationParams {
  page?: number
  size?: number
  sort?: string
}
