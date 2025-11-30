import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import UserForm from '@/components/Page/User/UserForm'
import { authOptions } from '@/app/api/auth/option'
import { getDictionary } from '@/locales/dictionary'
import { getServerLocale } from '@/locales/server-utils'
import { userApi } from '@/services'

export default async function Page({
  params,
}: {
  params: { userId: string }
}) {
  const session = await getServerSession(authOptions)
  const locale = await getServerLocale()
  const dict = await getDictionary(locale)

  // Protect: Only Admin can access
  if (session?.user.role !== 'Admin') {
    redirect('/')
  }

  // Fetch user data server-side
  const user = await userApi.getById(params.userId)

  return (
    <Card>
      <CardHeader>{dict.users?.edit || 'Edit User'}</CardHeader>
      <CardBody>
        <UserForm user={user} isEdit={true} />
      </CardBody>
    </Card>
  )
}
