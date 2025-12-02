import {
  faGauge,
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
  faUsers,
  faStar,
  faPuzzlePiece,
  faUtensils,
  faBoxes,
} from '@fortawesome/free-solid-svg-icons'
import React, { PropsWithChildren } from 'react'
import SidebarNavItem from '@/components/Layout/Dashboard/Sidebar/SidebarNavItem'
import SidebarNavGroup from '@/components/Layout/Dashboard/Sidebar/SidebarNavGroup'
import { getDictionary } from '@/locales/dictionary'
import { getServerLocale } from '@/locales/server-utils'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/option'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const SidebarNavTitle = (props: PropsWithChildren) => {
  const { children } = props

  return (
    <li className="nav-title px-3 py-2 mt-3 text-uppercase fw-bold">
      {children}
    </li>
  )
}

const QuickActionItem = (
  props: PropsWithChildren<{
    icon: any
    href: string
    variant?: string
  }>,
) => {
  const { icon, children, href, variant = 'primary' } = props

  return (
    <li className="mb-2">
      <a
        href={href}
        className={`btn btn-${variant} btn-sm w-100 d-flex align-items-center justify-content-start text-start`}
        style={{ padding: '0.5rem 0.75rem' }}
      >
        <FontAwesomeIcon icon={icon} className="me-2" fixedWidth />
        <span className="flex-fill">{children}</span>
      </a>
    </li>
  )
}

export default async function SidebarNav() {
  const locale = await getServerLocale()
  const dict = await getDictionary(locale)
  const session = await getServerSession(authOptions)
  const isAdmin = session?.user.role === 'Admin'

  return (
    <ul className="list-unstyled">
      {/* Dashboard */}
      <SidebarNavItem icon={faGauge} href="/">
        {dict.sidebar.items.dashboard}
      </SidebarNavItem>

      {/* Favorites Section */}
      <SidebarNavTitle>
        <FontAwesomeIcon icon={faStar} className="me-2" />
        {dict.sidebar.items.favorites || 'Favorites'}
      </SidebarNavTitle>
      <li className="px-3">
        <ul className="list-unstyled">
          <QuickActionItem icon={faPlus} href="/orders/create" variant="primary">
            {dict.sidebar.items.order || 'Create Order'}
          </QuickActionItem>
          <QuickActionItem
            icon={faBoxOpen}
            href="/inventory/imports"
            variant="success"
          >
            {dict.sidebar.items.imports || 'Import Inventory'}
          </QuickActionItem>
          {/* <li className="mb-2">
            <a
              href="/orders"
              className="btn btn-link btn-sm w-100 d-flex align-items-center justify-content-start text-start text-decoration-none"
              style={{ padding: '0.25rem 0.5rem' }}
            >
              <FontAwesomeIcon icon={faClipboardList} className="me-2" fixedWidth />
              <span className="flex-fill">{dict.sidebar.items.orders}</span>
            </a>
          </li>
          <li className="mb-2">
            <a
              href="/inventory/stocks"
              className="btn btn-link btn-sm w-100 d-flex align-items-center justify-content-start text-start text-decoration-none"
              style={{ padding: '0.25rem 0.5rem' }}
            >
              <FontAwesomeIcon icon={faWarehouse} className="me-2" fixedWidth />
              <span className="flex-fill">{dict.sidebar.items.stocks}</span>
            </a>
          </li> */}
        </ul>
      </li>

      {/* Master Data Category */}
      <SidebarNavGroup
        toggleIcon={faPuzzlePiece}
        toggleText={dict.sidebar.items.master_data || 'Master Data'}
      >
        {isAdmin && (
          <SidebarNavItem icon={faUsers} href="/users">
            {dict.sidebar.items.users}
          </SidebarNavItem>
        )}
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
        <SidebarNavItem icon={faDollarSign} href="/supplier-prices">
          {dict.sidebar.items.supplier_prices || 'Supplier Prices'}
        </SidebarNavItem>
      </SidebarNavGroup>

      {/* Recipes & Orders Category */}
      <SidebarNavGroup
        toggleIcon={faUtensils}
        toggleText={dict.sidebar.items.recipes_orders || 'Recipes & Orders'}
      >
        <SidebarNavItem icon={faBook} href="/recipe-standards">
          {dict.sidebar.items.recipe_standards}
        </SidebarNavItem>
        <SidebarNavItem icon={faClipboardList} href="/orders">
          {dict.sidebar.items.orders}
        </SidebarNavItem>
      </SidebarNavGroup>

      {/* Inventory Management Category */}
      <SidebarNavGroup
        toggleIcon={faBoxes}
        toggleText={dict.sidebar.items.inventory_management || 'Inventory'}
      >
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
    </ul>
  )
}
