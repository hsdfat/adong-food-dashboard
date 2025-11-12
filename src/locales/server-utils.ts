import { cookies } from 'next/headers'

export async function getServerLocale() {
  const cookieStore = cookies()
  return cookieStore.get('locale')?.value
}
