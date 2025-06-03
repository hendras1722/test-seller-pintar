import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
// import { cookies } from 'next/headers'
import Cookies from 'js-cookie'

const baseURL =
  typeof window !== 'undefined' // Cek apakah di browser (client)
    ? '/seller-pintar/api/' // Atau window.location.origin + '/seller-pintar/api/' Jika perlu domain lengkap
    : 'http://localhost:3000' + '/seller-pintar/api/' ||
      '/seller-pintar/api/'

axios.defaults.baseURL = baseURL

const getToken = async () => {
  if (typeof window === 'undefined') {
    const cookies = await import('next/headers')
    console.log(cookies)
    // Server-side
    const cookieStore = await cookies.cookies()
    return cookieStore.get('token')?.value
  } else {
    // Client-side
    return Cookies.get('token') // Gunakan js-cookie
  }
}

axios.interceptors.request.use(async(config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axios.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    console.log(error)
    // if (!error?.response || !error?.response?.status || !error?.response?.data) return
    // const { data, status } = error.response!
    // switch (status) {
    //   case 400:
    //     console.error(data)
    //     break

    //   case 401:
    //     console.error('unauthorised')
    //     break

    //   case 404:
    //     console.error('/not-found')
    //     break

    //   case 500:
    //     console.error('/server-error')
    //     break
    // }
    return Promise.reject(error)
  }
)

const responseBody = <T>(response: AxiosResponse<T>) => response.data

export const axiosFetch = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axios.get<T>(url, config).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.post<T>(url).then(responseBody),
}