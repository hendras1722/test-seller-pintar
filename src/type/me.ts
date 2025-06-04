 
export interface GetMe {
  id: string,
  username: string,
  role: 'Admin' | 'User' | '',
  createdAt: Date,
  updatedAt: Date
}