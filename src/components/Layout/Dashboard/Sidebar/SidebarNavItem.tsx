'use client'

import { IconDefinition } from '@fortawesome/free-regular-svg-icons'
import React, { PropsWithChildren } from 'react'
import { useSidebar } from '@/components/Layout/Dashboard/SidebarProvider'
import { NavItem, NavLink } from 'react-bootstrap'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname } from 'next/navigation'

type Props = {
  href: string;
  icon?: IconDefinition;
} & PropsWithChildren;

export default function SidebarNavItem(props: Props) {
  const { icon, children, href } = props

  const pathname = usePathname()
  const {
    showSidebarState: [, setIsShowSidebar],
  } = useSidebar()

  const isActive = pathname === href

  return (
    <NavItem>
      <Link href={href} passHref legacyBehavior>
        <NavLink
          className={`px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`}
          onClick={() => setIsShowSidebar(false)}
        >
          {icon ? (
            <FontAwesomeIcon className="nav-icon ms-n3" icon={icon} />
          ) : (
            <span className="nav-icon ms-n3" />
          )}
          {children}
        </NavLink>
      </Link>
    </NavItem>
  )
}
