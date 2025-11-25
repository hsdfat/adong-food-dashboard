import {
  faGauge,
  faPuzzlePiece,
  faUtensils,
  faBoxes,
} from '@fortawesome/free-solid-svg-icons'
import React, { PropsWithChildren } from 'react'
import SidebarNavGroup from '@/components/Layout/Dashboard/Sidebar/SidebarNavGroup'
import SidebarNavItem from '@/components/Layout/Dashboard/Sidebar/SidebarNavItem'
import { getDictionary } from '@/locales/dictionary'
import { getServerLocale } from '@/locales/server-utils'

const SidebarNavTitle = (props: PropsWithChildren) => {
  const { children } = props

  return (
    <li className="nav-title px-3 py-2 mt-3 text-uppercase fw-bold">
      {children}
    </li>
  )
}

export default async function SidebarNav() {
  const locale = await getServerLocale()
  const dict = await getDictionary(locale)

  return (
    <ul className="list-unstyled">
      <SidebarNavItem icon={faGauge} href="/">
        {dict.sidebar.items.dashboard}
      </SidebarNavItem>

      <SidebarNavTitle>
        {dict.sidebar.items.master_data || 'Master Data'}
      </SidebarNavTitle>

      <SidebarNavGroup
        toggleIcon={faPuzzlePiece}
        toggleText={dict.sidebar.items.master_data || 'Master Data'}
      >
        <SidebarNavItem href="/ingredients">
          {dict.sidebar.items.ingredients}
        </SidebarNavItem>
        <SidebarNavItem href="/kitchens">
          {dict.sidebar.items.kitchens}
        </SidebarNavItem>
        <SidebarNavItem href="/dishes">
          {dict.sidebar.items.dishes}
        </SidebarNavItem>
        <SidebarNavItem href="/suppliers">
          {dict.sidebar.items.suppliers}
        </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup
        toggleIcon={faUtensils}
        toggleText={dict.sidebar.items.recipes || 'Recipes'}
      >
        <SidebarNavItem href="/recipe-standards">
          {dict.sidebar.items.recipe_standards}
        </SidebarNavItem>
        <SidebarNavItem href="/orders/create">
          {dict.sidebar.items.order || 'Create Order'}
        </SidebarNavItem>

        <SidebarNavItem href="/orders">
          {dict.sidebar.items.orders}
        </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup
        toggleIcon={faBoxes}
        toggleText={dict.sidebar.items.inventory_management || 'Inventory'}
      >
        <SidebarNavItem href="/supplier-prices">
          {dict.sidebar.items.supplier_prices || 'Supplier Prices'}
        </SidebarNavItem>
        <SidebarNavItem href="/inventory/stocks">
          {dict.sidebar.items.stocks || 'Stocks'}
        </SidebarNavItem>
        <SidebarNavItem href="/inventory/imports">
          {dict.sidebar.items.imports || 'Imports'}
        </SidebarNavItem>
        <SidebarNavItem href="/inventory/exports">
          {dict.sidebar.items.exports || 'Exports'}
        </SidebarNavItem>
        {/* <SidebarNavItem href="/receiving">
          {dict.sidebar.items.receiving}
        </SidebarNavItem> */}
      </SidebarNavGroup>

      {/* <SidebarNavItem icon={faClipboardList} href="/reports">
        {dict.sidebar.items.reports}
      </SidebarNavItem> */}
      {/* 
      <SidebarNavTitle>{dict.sidebar.items.theme}</SidebarNavTitle>
      <SidebarNavItem icon={faDroplet} href="#">{dict.sidebar.items.colors}</SidebarNavItem>
      <SidebarNavItem icon={faPencil} href="#">{dict.sidebar.items.typography}</SidebarNavItem>

      <SidebarNavTitle>{dict.sidebar.items.extras}</SidebarNavTitle>

      <SidebarNavGroup toggleIcon={faStar} toggleText={dict.sidebar.items.pages}>
        <SidebarNavItem icon={faRightToBracket} href="login">{dict.sidebar.items.login}</SidebarNavItem>
        <SidebarNavItem icon={faAddressCard} href="register">{dict.sidebar.items.register}</SidebarNavItem>
        <SidebarNavItem icon={faBug} href="#">{dict.sidebar.items.error404}</SidebarNavItem>
        <SidebarNavItem icon={faBug} href="#">{dict.sidebar.items.error500}</SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavItem icon={faFileLines} href="#">{dict.sidebar.items.docs}</SidebarNavItem> */}
    </ul>
  )
}
