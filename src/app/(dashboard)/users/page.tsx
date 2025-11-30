import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import UserList from '@/components/Page/User/UserList'
import { authOptions } from '@/app/api/auth/option'
import { getDictionary } from '@/locales/dictionary'
import { getServerLocale } from '@/locales/server-utils'

export default async function Page() {
  const session = await getServerSession(authOptions)
  const locale = await getServerLocale()
  const dict = await getDictionary(locale)

  // Protect: Only Admin can access
  if (session?.user.role !== 'Admin') {
    redirect('/')
  }

  return (
    <Card>
      <CardHeader>
        {dict.users?.title || 'User Management'}
      </CardHeader>
      <CardBody>
        <UserList />
      </CardBody>
    </Card>
  )
}
