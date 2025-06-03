export interface ListCategory {
  id: string
  userId: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface ResultGetCategory {
  data: ListCategory[]
  totalData: number
  currentPage: number
  totalPages: number
}
