import {
  faGauge,
  faPuzzlePiece,
  faUtensils,
  faBoxes,
  faCarrot,
  faKitchenSet,
  faBowlFood,
  faTruck,
  faBook,
  faPlus,
  faClipboardList,
  faDollarSign,
  faWarehouse,
  faBoxOpen,
  faTruckRampBox,
  faBalanceScale,
  faFileInvoice,
  faChartLine,
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
        <SidebarNavItem icon={faCarrot} href="/ingredients">
          {dict.sidebar.items.ingredients}
        </SidebarNavItem>
        <SidebarNavItem icon={faKitchenSet} href="/kitchens">
          {dict.sidebar.items.kitchens}
        </SidebarNavItem>
        <SidebarNavItem icon={faBowlFood} href="/dishes">
          {dict.sidebar.items.dishes}
        </SidebarNavItem>
        <SidebarNavItem icon={faTruck} href="/suppliers">
          {dict.sidebar.items.suppliers}
        </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup
        toggleIcon={faUtensils}
        toggleText={dict.sidebar.items.recipes || 'Recipes'}
      >
        <SidebarNavItem icon={faBook} href="/recipe-standards">
          {dict.sidebar.items.recipe_standards}
        </SidebarNavItem>
        <SidebarNavItem icon={faPlus} href="/orders/create">
          {dict.sidebar.items.order || 'Create Order'}
        </SidebarNavItem>

        <SidebarNavItem icon={faClipboardList} href="/orders">
          {dict.sidebar.items.orders}
        </SidebarNavItem>
      </SidebarNavGroup>

      <SidebarNavGroup
        toggleIcon={faBoxes}
        toggleText={dict.sidebar.items.inventory_management || 'Inventory'}
      >
        <SidebarNavItem icon={faDollarSign} href="/supplier-prices">
          {dict.sidebar.items.supplier_prices || 'Supplier Prices'}
        </SidebarNavItem>
        <SidebarNavItem icon={faWarehouse} href="/inventory/stocks">
          {dict.sidebar.items.stocks || 'Stocks'}
        </SidebarNavItem>
        <SidebarNavItem icon={faFileInvoice} href="/inventory/requests">
          {dict.sidebar.items.ingredient_requests || 'Ingredient Requests'}
        </SidebarNavItem>
        <SidebarNavItem icon={faBoxOpen} href="/inventory/imports">
          {dict.sidebar.items.imports || 'Imports'}
        </SidebarNavItem>
        <SidebarNavItem icon={faTruckRampBox} href="/inventory/exports">
          {dict.sidebar.items.exports || 'Exports'}
        </SidebarNavItem>
        <SidebarNavItem icon={faBalanceScale} href="/inventory/adjustments">
          {dict.sidebar.items.adjustments || 'Adjustments'}
        </SidebarNavItem>
        <SidebarNavItem icon={faChartLine} href="/inventory/reports">
          {dict.sidebar.items.reports || 'Reports'}
        </SidebarNavItem>
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
