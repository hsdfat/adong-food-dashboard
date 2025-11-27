'use client'

import { IconDefinition } from '@fortawesome/free-regular-svg-icons'
import React, { PropsWithChildren } from 'react'
import { useSidebar } from '@/components/Layout/Dashboard/SidebarProvider'
import { NavItem, NavLink } from 'react-bootstrap'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname, useRouter } from 'next/navigation'
import { useLoadingOverlay } from '@/components/Common/LoadingOverlay'

type Props = {
  href: string;
  icon?: IconDefinition;
} & PropsWithChildren;

export default function SidebarNavItem(props: Props) {
  const { icon, children, href } = props

  const pathname = usePathname()
  const router = useRouter()
  const {
    showSidebarState: [, setIsShowSidebar],
  } = useSidebar()
  const { showLoading } = useLoadingOverlay()

  const isActive = pathname === href

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (pathname !== href) {
      showLoading()
      setIsShowSidebar(false)
      router.push(href)
    } else {
      setIsShowSidebar(false)
    }
  }

  return (
    <NavItem>
      <NavLink
        className={`px-3 py-2 d-flex align-items-center ${isActive ? 'active' : ''}`}
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      >
        {icon ? (
          <FontAwesomeIcon className="nav-icon ms-n3" icon={icon} />
        ) : (
          <span className="nav-icon ms-n3" />
        )}
        {children}
      </NavLink>
    </NavItem>
  )
}
