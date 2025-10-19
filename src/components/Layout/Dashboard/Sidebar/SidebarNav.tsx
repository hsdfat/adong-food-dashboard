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

      <SidebarNavTitle>Food Management</SidebarNavTitle>

      <SidebarNavGroup toggleIcon={faPuzzlePiece} toggleText="Master Data">
        <SidebarNavItem href="/ingredients">
          Ingredients
        </SidebarNavItem>
        <SidebarNavItem href="/kitchens">
          Kitchens
        </SidebarNavItem>
        <SidebarNavItem href="/dishes">
          Dishes
        </SidebarNavItem>
        <SidebarNavItem href="/suppliers">
          Suppliers
        </SidebarNavItem>
        <SidebarNavItem href="/users">
          Users
        </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faUtensils} toggleText="Recipes">
        <SidebarNavItem href="/recipe-standards">
          Recipe Standards
        </SidebarNavItem>
        <SidebarNavItem href="/recipe-standards/by-dish">
          By Dish
        </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup toggleIcon={faBoxes} toggleText="Inventory">
        <SidebarNavItem href="/supplier-prices">
          Supplier Prices
        </SidebarNavItem>
        <SidebarNavItem href="/orders">
          Orders
        </SidebarNavItem>
        <SidebarNavItem href="/receiving">
          Receiving
        </SidebarNavItem>
        <SidebarNavItem href="/inventory">
          Stock Levels
        </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavItem icon={faClipboardList} href="/reports">
        Reports
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