'use client'

import { Button } from '@/components/ui/button'
import { clearAuthToken } from '@/utils/axios'
import { useRouter } from 'next/navigation'

export default function Profile() {
  const router = useRouter()
  async function handleLogout() {
    clearAuthToken()
    router.push('/login')
  }
  return <Button onClick={handleLogout}>Logout</Button>
}
