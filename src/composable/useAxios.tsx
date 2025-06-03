import { axiosFetch } from '@/utils/axios'

interface Opts {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
}

interface AxiosResult<T> {
  data: T | null
  error: Error | null
  pending: boolean
}

export function useAxios<T>() {
  const fetchData = async (
    url: string,
    opts?: Opts
  ): Promise<AxiosResult<T>> => {
    let data: T | null = null
    let error: Error | null = null
    let pending: boolean = true

    try {
      let result: any

      if (!opts || opts.method === 'GET') {
        result = await axiosFetch.get(url)
      } else if (opts.method === 'POST') {
        result = await axiosFetch.post(url, opts.body)
      } else if (opts.method === 'PUT') {
        result = await axiosFetch.put(url, opts.body)
      } else if (opts.method === 'DELETE') {
        result = await axiosFetch.delete(url)
      } else {
        throw new Error(`Unsupported method: ${opts.method}`)
      }

      data = result
    } catch (err) {
      if (err instanceof Error) {
        error = err
      }
      data = null
    } finally {
      pending = false
    }

    return { data, error, pending }
  }

  return fetchData
}
