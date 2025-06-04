export interface ResutGetArticles {
  data: ListArticles[]
  total: number
  page: number
  limit: number
}

export interface ListArticles {
  id: string
  userId: string
  categoryId: string
  title: string
  content: string
  imageUrl: string
  createdAt: Date
  updatedAt: Date
  category: Category
  user: User
}

export interface Category {
  id:        string;
  userId:    string;
  name:      string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id:       string;
  username: string;
}
