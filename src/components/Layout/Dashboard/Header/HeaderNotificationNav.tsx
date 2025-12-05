'use client'

import { Nav, NavItem } from 'react-bootstrap'
import HeaderLocale from '@/components/Layout/Dashboard/Header/HeaderLocale'
import HeaderTheme from '@/components/Layout/Dashboard/Header/HeaderTheme'
import HeaderNotificationBell from '@/components/Layout/Dashboard/Header/HeaderNotificationBell'

export default function HeaderNotificationNav() {
  return (
    <Nav>
      <NavItem>
        <HeaderNotificationBell />
      </NavItem>
      <NavItem>
        <HeaderLocale />
      </NavItem>
      <NavItem>
        <HeaderTheme />
      </NavItem>
    </Nav>
  )
}
