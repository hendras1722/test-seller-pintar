// import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
// import Cookies from 'js-cookie'

// const baseURL =
//   typeof window !== 'undefined' 
//     ? '/seller-pintar/api/' 
//     : 'http://localhost:3000' + '/seller-pintar/api/' ||
//       '/seller-pintar/api/'

// axios.defaults.baseURL = baseURL

// const getToken = async () => {
//   if (typeof window === 'undefined') {
//     const cookies = await import('next/headers')
//     const cookieStore = await cookies.cookies()
//     return cookieStore.get('token')?.value
//   } else {
//     return Cookies.get('token') // Gunakan js-cookie
//   }
// }

// axios.interceptors.request.use(async(config) => {
//   const token = await getToken()
//   console.log(token)
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`
//   }
//   return config
// })

// axios.interceptors.response.use(
//   (res) => res,
//   (error: AxiosError) => {
//     if (!error?.response || !error?.response?.status || !error?.response?.data) return

//     const { data, status } = error.response!
    
//     switch (status) {
//       case 400:
//         console.error(data)
//         break

//       case 401:
//         console.error('unauthorised')
//         break

//       case 404:
//         console.error('/not-found')
//         break

//       case 500:
//         console.error('/server-error')
//         break
//     }
//     return Promise.reject(error)
//   }
// )

// const responseBody = <T>(response: AxiosResponse<T>) => response.data

// export const axiosFetch = {
//   get: <T>(url: string, config?: AxiosRequestConfig) =>
//     axios.get<T>(url, config).then(responseBody),
//   post: <T>(url: string, body: {}) =>
//     axios.post<T>(url, body).then(responseBody),
//   put: <T>(url: string, body: {}) =>
//     axios.put<T>(url, body).then(responseBody),
//   delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
// }


import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'

const baseURL =
  typeof window !== 'undefined'
    ? '/seller-pintar/api/'
    : 'http://localhost:3000/seller-pintar/api/'

axios.defaults.baseURL = baseURL

// Improved token getter with better error handling
const getToken = async (): Promise<string | undefined> => {
  try {
    if (typeof window === 'undefined') {
      // Server-side
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      const token = cookieStore.get('token')?.value
      console.log('Server token:', token ? 'exists' : 'not found')
      return token
    } else {
      // Client-side
      const token = Cookies.get('token')
      console.log('Client token:', token ? 'exists' : 'not found')
      return token
    }
  } catch (error) {
    console.error('Error getting token:', error)
    return undefined
  }
}

// Request interceptor with better error handling
axios.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken()

      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
        console.log(
          'Token set in headers:',
          `Bearer ${token.substring(0, 10)}...`
        )
      } else {
        console.log('No token found, proceeding without authorization')
      }

      return config
    } catch (error) {
      console.error('Error in request interceptor:', error)
      return config
    }
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor remains the same
axios.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (!error?.response) return Promise.reject(error)

    const { data, status } = error.response

    switch (status) {
      case 400:
        console.error('Bad Request:', data)
        break

      case 401:
        console.error('Unauthorized - Invalid or expired token')
        // Optionally clear invalid token
        if (typeof window !== 'undefined') {
          Cookies.remove('token')
        }
        break

      case 404:
        console.error('Not Found:', data)
        break

      case 500:
        console.error('Server Error:', data)
        break

      default:
        console.error(`HTTP ${status}:`, data)
    }

    return Promise.reject(error)
  }
)

const responseBody = <T>(response: AxiosResponse<T>) => response.data

export const axiosFetch = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axios.get<T>(url, config).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

// Helper function to manually set token (useful after login)
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    Cookies.set('token', token, {
      expires: 7, // 7 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
  }
}

// Helper function to clear token (useful for logout)
export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    Cookies.remove('token')
  }
}