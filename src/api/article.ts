import { useAxios } from '@/composable/useAxios'
import { ResutGetArticles } from '@/type/article'
import { apiEndpoint } from '@/type/endpoint'
import { axiosFetch } from '@/utils/axios'

export const getArticle = (params?): Promise<ResutGetArticles> => {
  return axiosFetch.get<ResutGetArticles>(apiEndpoint.GET_ARTICLE, {
    params,
  })
}


export const editArticle = async (body?, query?) => {
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