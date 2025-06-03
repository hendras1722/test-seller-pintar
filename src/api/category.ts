import {  ResultGetCategory } from '@/type/category'
import { axiosFetch } from '@/utils/axios'

export const getCategory = (params?):Promise<ResultGetCategory> => {
  return axiosFetch.get<ResultGetCategory>('/categories', {
    params,
  })

}
