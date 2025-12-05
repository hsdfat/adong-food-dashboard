'use client'

import Cookies from 'js-cookie'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  NavLink,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLanguage } from '@fortawesome/free-solid-svg-icons'
import { getLocale } from '@/locales/dictionary'

export default function HeaderLocale({
  currentLocale,
}: {
  currentLocale?: string;
} = {}) {
  const initialLocale = currentLocale || getLocale(Cookies.get('locale'))
  const [locale, setLocale] = useState(initialLocale)
  const router = useRouter()

  // Sync state with prop when it changes (after page refresh)
  useEffect(() => {
    if (currentLocale) {
      setLocale(currentLocale)
    }
  }, [currentLocale])

  const changeLocale = (loc: string) => {
    Cookies.set('locale', loc)
    setLocale(loc)
    router.refresh()
  }

  return (
    <Dropdown>
      <DropdownToggle
        className="px-2 mx-1 px-sm-3 mx-sm-0"
        as={NavLink}
        bsPrefix="hide-caret"
        id="dropdown-locale"
      >
        <FontAwesomeIcon icon={faLanguage} size="lg" />
      </DropdownToggle>
      <DropdownMenu className="pt-0" align="end">
        <DropdownItem
          active={locale === 'en'}
          onClick={() => changeLocale('en')}
        >
          English
        </DropdownItem>
        <DropdownItem
          active={locale === 'vi'}
          onClick={() => changeLocale('vi')}
        >
          Tiếng Việt
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
