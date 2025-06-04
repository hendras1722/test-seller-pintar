import { useAxios } from "@/composable/useAxios"
import { GetMe } from "@/type/me"

export async function getMe(){
  const axios = useAxios<GetMe>()
  return await axios('/auth/profile', {
    method: 'GET',
  })
}