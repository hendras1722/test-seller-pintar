import { useAxios } from '@/composable/useAxios'
import { ListArticles, ResutGetArticles } from '@/type/article'
import { apiEndpoint } from '@/type/endpoint'
import { axiosFetch } from '@/utils/axios'

export const getArticle = async (params?): Promise<ResutGetArticles> => {
  return await axiosFetch.get<ResutGetArticles>(apiEndpoint.GET_ARTICLE, {
    params,
  })
}
export const getArticleDetail = async (query?): Promise<ListArticles> => {
  return await axiosFetch.get<ListArticles>(apiEndpoint.GET_ARTICLE + '/' + query)
}


export const editArticle = async (body?, query?) => {
   const axios = useAxios<{ token: string; role: string }>()
   const { error ,data} = await axios('/articles/' + query, {
     method: 'PUT',
     body: body,
   })

   return {
     error,
     data,
   }
}