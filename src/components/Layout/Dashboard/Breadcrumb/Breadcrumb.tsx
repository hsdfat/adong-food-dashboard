import { Breadcrumb as BSBreadcrumb, BreadcrumbItem } from 'react-bootstrap'
import { getDictionary } from '@/locales/dictionary'
import { getServerLocale } from '@/locales/server-utils'

export default async function Breadcrumb() {
  const locale = await getServerLocale()
  const dict = await getDictionary(locale)
  return (
    <BSBreadcrumb listProps={{ className: 'mb-0 align-items-center' }}>
      <BreadcrumbItem
        linkProps={{ className: 'text-decoration-none' }}
        href="/"
      >
        {dict.breadcrumb.home}
      </BreadcrumbItem>
      {/* <BreadcrumbItem
        linkProps={{ className: 'text-decoration-none' }}
        href="/"
      >
        {dict.breadcrumb.library}
      </BreadcrumbItem>
      <BreadcrumbItem active>{dict.breadcrumb.data}</BreadcrumbItem> */}
    </BSBreadcrumb>
  )
}
