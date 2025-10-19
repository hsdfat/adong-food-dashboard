import {
  faAddressCard, faBell, faFileLines, faStar,
} from '@fortawesome/free-regular-svg-icons'
import {
  faBug,
  faCalculator,
  faChartPie,
  faCode,
  faDroplet,
  faGauge,
  faLayerGroup,
  faLocationArrow,
  faPencil,
  faPuzzlePiece,
  faRightToBracket,
  faUtensils,
  faBoxes,
  faTruck,
  faClipboardList,
  faUsers,
  faStore,
  faBook,
} from '@fortawesome/free-solid-svg-icons'
import React, { PropsWithChildren } from 'react'
import { Badge } from 'react-bootstrap'
import SidebarNavGroup from '@/components/Layout/Dashboard/Sidebar/SidebarNavGroup'
import SidebarNavItem from '@/components/Layout/Dashboard/Sidebar/SidebarNavItem'
import { getDictionary } from '@/locales/dictionary'

const SidebarNavTitle = (props: PropsWithChildren) => {
  const { children } = props

  return (
    <li className="nav-title px-3 py-2 mt-3 text-uppercase fw-bold">{children}</li>
  )
}

export default async function SidebarNav() {
  const dict = await getDictionary()

  return (
    <ul className="list-unstyled">
      <SidebarNavItem icon={faGauge} href="/">
        {dict.sidebar.items.dashboard}
      </SidebarNavItem>

      <SidebarNavTitle>{dict.sidebar.items.master_data || 'Master Data'}</SidebarNavTitle>

      <SidebarNavGroup toggleIcon={faPuzzlePiece} toggleText={dict.sidebar.items.master_data || 'Master Data'}>
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
        <SidebarNavItem href="/users">
          {dict.sidebar.items.users}
        </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faUtensils} toggleText={dict.sidebar.items.recipes || 'Recipes'}>
        <SidebarNavItem href="/recipe-standards">
          {dict.sidebar.items.recipe_standards}
        </SidebarNavItem>
        <SidebarNavItem href="/recipe-standards/by-dish">
          {dict.sidebar.items.by_dish || 'By Dish'}
        </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faBoxes} toggleText={dict.sidebar.items.inventory_management || 'Inventory'}>
        <SidebarNavItem href="/supplier-prices">
          {dict.sidebar.items.supplier_prices || 'Supplier Prices'}
        </SidebarNavItem>
        <SidebarNavItem href="/orders">
          {dict.sidebar.items.orders}
        </SidebarNavItem>
        <SidebarNavItem href="/receiving">
          {dict.sidebar.items.receiving}
        </SidebarNavItem>
        <SidebarNavItem href="/inventory">
          {dict.sidebar.items.inventory || 'Stock Levels'}
        </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavItem icon={faClipboardList} href="/reports">
        {dict.sidebar.items.reports}
      </SidebarNavItem>

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

      <SidebarNavItem icon={faFileLines} href="#">{dict.sidebar.items.docs}</SidebarNavItem>
    </ul>
  )
}