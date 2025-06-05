import { useAxios } from '@/composable/useAxios'
import {  ResultGetCategory } from '@/type/category'
import { apiEndpoint } from '@/type/endpoint'
import { axiosFetch } from '@/utils/axios'

export const getCategory = async (params?):Promise<ResultGetCategory> => {
  return await axiosFetch.get<ResultGetCategory>(apiEndpoint.GET_CATEGORY, {
    params,
  })
}


export const editCategory = async (body?, query?) => {
   const axios = useAxios<{ token: string; role: string }>()
   const { error ,data} = await axios('/categories/' + query, {
     method: 'PUT',
     body: body,
   })

   return {
     error,
     data,
   }
}