import { Nav, NavItem } from 'react-bootstrap'
import HeaderLocale from '@/components/Layout/Dashboard/Header/HeaderLocale'
import { getLocale } from '@/locales/dictionary'
import { getPreferredTheme } from '@/themes/theme'
import HeaderTheme from '@/components/Layout/Dashboard/Header/HeaderTheme'
import Cookies from 'js-cookie'

export default async function HeaderNotificationNav() {
  return (
    <Nav>
      <NavItem>
        <HeaderLocale currentLocale={getLocale(Cookies.get('locale'))} />
      </NavItem>
      <NavItem>
        <HeaderTheme currentPreferredTheme={getPreferredTheme()} />
      </NavItem>
    </Nav>
  )
}
