# ProjectDump Analysis

**Generated on:** 2025-10-22 21:57:01
**Project Path:** src/

## Project Summary

- **Primary Language:** TypeScript
- **Total Files:** 91
- **Processed Files:** 91
- **Project Size:** 214.30 KB

## Detected Technologies

### TypeScript (100.0% confidence)
*TypeScript - JavaScript with static typing*

**Related files:**
- app/(authentication)/layout.tsx
- app/(authentication)/login/login.tsx
- app/(authentication)/login/page.tsx
- app/(authentication)/register/page.tsx
- app/(authentication)/register/register.tsx
- ... and 77 more files

### Rust (100.0% confidence)
*Rust systems programming language*

**Related files:**
- app/(authentication)/login/login.tsx
- app/(authentication)/register/register.tsx
- app/(dashboard)/dishes/[id]/edit/page.tsx
- app/(dashboard)/dishes/create/page.tsx
- app/(dashboard)/ingredients/create/page.tsx
- ... and 34 more files

### Go (100.0% confidence)
*Go programming language*

**Related files:**
- app/(authentication)/layout.tsx
- app/(authentication)/login/login.tsx
- app/(authentication)/login/page.tsx
- app/(authentication)/register/page.tsx
- app/(authentication)/register/register.tsx
- ... and 68 more files

### Docker (100.0% confidence)
*Docker containerization platform*

**Related files:**
- app/(authentication)/layout.tsx
- app/(authentication)/login/login.tsx
- app/(authentication)/login/page.tsx
- app/(authentication)/register/page.tsx
- app/(authentication)/register/register.tsx
- ... and 64 more files

### PHP (100.0% confidence)
*PHP server-side scripting language*

**Related files:**
- app/(authentication)/layout.tsx
- app/(authentication)/login/login.tsx
- app/(authentication)/login/page.tsx
- app/(authentication)/register/page.tsx
- app/(authentication)/register/register.tsx
- ... and 57 more files

### Python (100.0% confidence)
*Python programming language*

**Related files:**
- app/(authentication)/layout.tsx
- app/(authentication)/login/login.tsx
- app/(authentication)/login/page.tsx
- app/(authentication)/register/page.tsx
- app/(authentication)/register/register.tsx
- ... and 66 more files

### CSS (100.0% confidence)
*Cascading Style Sheets*

**Related files:**
- app/(authentication)/layout.tsx
- app/(authentication)/login/login.tsx
- app/(authentication)/login/page.tsx
- app/(authentication)/register/page.tsx
- app/(authentication)/register/register.tsx
- ... and 85 more files

### HTML (100.0% confidence)
*HyperText Markup Language*

**Related files:**
- app/(authentication)/layout.tsx
- app/(authentication)/login/page.tsx
- app/(dashboard)/layout.tsx
- app/(dashboard)/page.tsx
- app/layout.tsx
- ... and 19 more files

### Ruby (100.0% confidence)
*Ruby programming language*

**Related files:**
- app/(authentication)/login/login.tsx
- app/(dashboard)/page.tsx
- components/Layout/Dashboard/Header/HeaderLocale.tsx
- components/Layout/Dashboard/Header/HeaderNotificationNav.tsx
- components/Layout/Dashboard/Header/HeaderTheme.tsx
- ... and 16 more files

### JavaScript (100.0% confidence)
*JavaScript runtime and ecosystem*

**Related files:**
- app/(authentication)/layout.tsx
- app/(authentication)/login/login.tsx
- app/(authentication)/login/page.tsx
- app/(authentication)/register/page.tsx
- app/(authentication)/register/register.tsx
- ... and 78 more files

### React (100.0% confidence)
*React JavaScript library for building user interfaces*

**Related files:**
- app/(authentication)/layout.tsx
- app/(authentication)/login/login.tsx
- app/(authentication)/login/page.tsx
- app/(authentication)/register/page.tsx
- app/(authentication)/register/register.tsx
- ... and 51 more files

### Node.js (15.0% confidence)
*Node.js JavaScript runtime*

**Related files:**
- app/api/auth/option.ts
- app/layout.tsx
- utils/api_client.ts

## Directory Structure

```
├── app
│   ├── (authentication)
│   │   ├── layout.tsx
│   │   ├── login
│   │   │   ├── login.tsx
│   │   │   └── page.tsx
│   │   └── register
│   │       ├── page.tsx
│   │       └── register.tsx
│   ├── (dashboard)
│   │   ├── dishes
│   │   │   ├── [id]
│   │   │   │   └── edit
│   │   │   │       └── page.tsx
│   │   │   ├── create
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── ingredients
│   │   │   ├── [id]
│   │   │   │   └── edit
│   │   │   │       └── page.tsx
│   │   │   ├── create
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── kitchens
│   │   │   ├── [id]
│   │   │   │   └── edit
│   │   │   │       └── page.tsx
│   │   │   ├── create
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api
│   │   ├── auth
│   │   │   ├── [...nextauth]
│   │   │   │   └── route.ts
│   │   │   └── option.ts
│   │   └── health
│   │       └── route.ts
│   └── layout.tsx
├── components
│   ├── Form
│   │   └── FormError.tsx
│   ├── Image
│   │   └── ImageFallback.tsx
│   ├── Layout
│   │   └── Dashboard
│   │       ├── Breadcrumb
│   │       │   └── Breadcrumb.tsx
│   │       ├── Footer
│   │       │   └── Footer.tsx
│   │       ├── Header
│   │       │   ├── Header.tsx
│   │       │   ├── HeaderFeaturedNav.tsx
│   │       │   ├── HeaderLocale.tsx
│   │       │   ├── HeaderLogout.tsx
│   │       │   ├── HeaderNotificationNav.tsx
│   │       │   ├── HeaderProfileNav.tsx
│   │       │   ├── HeaderSidebarToggler.tsx
│   │       │   └── HeaderTheme.tsx
│   │       ├── Sidebar
│   │       │   ├── Sidebar.tsx
│   │       │   ├── SidebarNav.tsx
│   │       │   ├── SidebarNavGroup.tsx
│   │       │   ├── SidebarNavItem.tsx
│   │       │   └── SidebarOverlay.tsx
│   │       └── SidebarProvider.tsx
│   ├── Page
│   │   ├── Dashboard
│   │   │   ├── ConversionChart.tsx
│   │   │   ├── IncomeChart.tsx
│   │   │   ├── SessionChart.tsx
│   │   │   ├── TrafficChart.tsx
│   │   │   └── UserChart.tsx
│   │   ├── Dish
│   │   │   ├── DishForm.tsx
│   │   │   └── DishesList.tsx
│   │   ├── Ingredient
│   │   │   ├── IngredientForm.tsx
│   │   │   └── IngredientList.tsx
│   │   ├── Kitchen
│   │   │   ├── KitchenForm.tsx
│   │   │   └── KitchensList.tsx
│   │   └── RecipeStandard
│   │       └── RecipeStandardsList.tsx
│   ├── Pagination
│   │   ├── Paginate.tsx
│   │   ├── Pagination.tsx
│   │   ├── RowsPerPage.tsx
│   │   ├── RowsPerPageSelect.tsx
│   │   └── Summary.tsx
│   ├── ProgressBar
│   │   └── ProgressBar.tsx
│   └── TableSort
│       └── THSort.tsx
├── hooks
│   └── use-computed-style.ts
├── locales
│   ├── DictionaryProvider.tsx
│   ├── config.ts
│   ├── dictionary-hook.ts
│   ├── dictionary.ts
│   ├── en
│   │   └── lang.json
│   └── vi
│       └── lang.json
├── middleware.ts
├── models
│   ├── dish.ts
│   ├── egg-group.ts
│   ├── index.ts
│   ├── ingredient.ts
│   ├── kitchen.ts
│   ├── pokemon.ts
│   ├── recipe_standard.ts
│   ├── resource.ts
│   ├── supplier.ts
│   └── type.ts
├── services
│   ├── dish-api.ts
│   ├── index.ts
│   └── ingredient-api.ts
├── styles
│   ├── _custom.scss
│   ├── globals.scss
│   └── layout
│       ├── _avatar.scss
│       ├── _footer.scss
│       ├── _header.scss
│       ├── _progress.scss
│       └── _sidebar.scss
├── themes
│   ├── enum.ts
│   └── theme.ts
├── types
│   └── next.d.ts
├── utils
│   ├── api_client.ts
│   └── server-fetch.ts
└── zod
    └── zod.ts
```

## Source Code

### app/

#### app/layout.tsx
*Language: TypeScript | Size: 1946 bytes*

```typescript
import '@/styles/globals.scss'
// Next.js allows you to import CSS directly in .js files.
// It handles optimization and all the necessary Webpack configuration to make this work.
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import ProgressBar from '@/components/ProgressBar/ProgressBar'
import DictionaryProvider from '@/locales/DictionaryProvider'
import { getDictionary } from '@/locales/dictionary'
import getTheme from '@/themes/theme'
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'

// You change this configuration value to false so that the Font Awesome core SVG library
// will not try and insert <style> elements into the <head> of the page.
// Next.js blocks this from happening anyway so you might as well not even try.
// See https://fontawesome.com/v6/docs/web/use-with/react/use-with#next-js
config.autoAddCss = false

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dictionary = await getDictionary()

  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ''
  const vercelAnalytics = process.env.NEXT_PUBLIC_VERCEL_ANALYTICS === 'true'
  const googleAdsenseId = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ID ?? ''

  return (
    <html lang="en" data-bs-theme={getTheme()}>
      <body>
        <ProgressBar />
        <DictionaryProvider dictionary={dictionary}>
          {children}
        </DictionaryProvider>
        {vercelAnalytics && <Analytics />}
      </body>
      {gaMeasurementId !== '' && <GoogleAnalytics gaId={gaMeasurementId} />}
      {googleAdsenseId !== '' && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${googleAdsenseId}`}
          crossOrigin="anonymous"
        />
      )}
    </html>
  )
}
```

### app/(authentication)/

#### app/(authentication)/layout.tsx
*Language: TypeScript | Size: 329 bytes*

```typescript
import { Container } from 'react-bootstrap'
import React from 'react'

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-light dark:bg-dark min-vh-100 d-flex flex-row align-items-center">
      <Container>
        {children}
      </Container>
    </div>
  )
}
```

### app/(authentication)/login/

#### app/(authentication)/login/login.tsx
*Language: TypeScript | Size: 3171 bytes*

```typescript
'use client'

import {
  Alert, Button, Col, Form, FormControl, InputGroup, Row,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-regular-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import Link from 'next/link'
import InputGroupText from 'react-bootstrap/InputGroupText'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import useDictionary from '@/locales/dictionary-hook'

export default function Login({ callbackUrl }: { callbackUrl: string }) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const dict = useDictionary()

  const login = async (formData: FormData) => {
    setSubmitting(true)

    try {
      const res = await signIn('credentials', {
        username: formData.get('username'),
        password: formData.get('password'),
        redirect: false,
        callbackUrl,
      })

      if (!res) {
        setError('Login failed')
        return
      }

      const { ok, url, error: err } = res

      if (!ok) {
        if (err) {
          setError(err)
          return
        }

        setError('Login failed')
        return
      }

      if (url) {
        router.push(url)
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Alert
        variant="danger"
        show={error !== ''}
        onClose={() => setError('')}
        dismissible
      >
        {error}
      </Alert>
      <Form action={login}>
        <InputGroup className="mb-3">
          <InputGroupText>
            <FontAwesomeIcon
              icon={faUser}
              fixedWidth
            />
          </InputGroupText>
          <FormControl
            name="username"
            required
            disabled={submitting}
            placeholder={dict.login.form.username}
            aria-label="Username"
            defaultValue="NV001"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroupText>
            <FontAwesomeIcon
              icon={faLock}
              fixedWidth
            />
          </InputGroupText>
          <FormControl
            type="password"
            name="password"
            required
            disabled={submitting}
            placeholder={dict.login.form.password}
            aria-label="Password"
            defaultValue="1234"
          />
        </InputGroup>

        <Row className="align-items-center">
          <Col xs={6}>
            <Button
              className="px-4"
              variant="primary"
              type="submit"
              disabled={submitting}
            >
              {dict.login.form.submit}
            </Button>
          </Col>
          <Col xs={6} className="text-end">
            <Link className="px-0" href="#">
              {dict.login.forgot_password}
            </Link>
          </Col>
        </Row>
      </Form>
    </>
  )
}
```

#### app/(authentication)/login/page.tsx
*Language: TypeScript | Size: 1493 bytes*

```typescript
import { Col, Row } from 'react-bootstrap'
import Link from 'next/link'
import LoginForm from '@/app/(authentication)/login/login'
import { SearchParams } from '@/types/next'
import { getDictionary } from '@/locales/dictionary'

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const { callbackUrl } = searchParams
  const dict = await getDictionary()

  const getCallbackUrl = () => {
    if (!callbackUrl) {
      return '/' // Default redirect to home page
    }

    return callbackUrl.toString()
  }

  return (
    <Row className="justify-content-center align-items-center px-3">
      <Col lg={8}>
        <Row>
          <Col md={7} className="bg-white dark:bg-dark border p-5">
            <div>
              <h1>{dict.login.title}</h1>
              <p className="text-black-50 dark:text-gray-500">{dict.login.description}</p>

              <LoginForm callbackUrl={getCallbackUrl()} />
            </div>
          </Col>
          <Col
            md={5}
            className="bg-primary text-white d-flex align-items-center justify-content-center p-5"
          >
            <div className="text-center">
              <h2>{dict.login.signup.title}</h2>
              <p>{dict.login.signup.description}</p>
              <Link className="btn btn-lg btn-outline-light mt-3" href="/register">
                {dict.signup.register_now}
              </Link>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  )
}
```

### app/(authentication)/register/

#### app/(authentication)/register/page.tsx
*Language: TypeScript | Size: 635 bytes*

```typescript
import {
  Card, CardBody, Col, Row,
} from 'react-bootstrap'
import Register from '@/app/(authentication)/register/register'
import { getDictionary } from '@/locales/dictionary'

export default async function Page() {
  const dict = await getDictionary()

  return (
    <Row className="justify-content-center">
      <Col md={6}>
        <Card className="mb-4 rounded-0">
          <CardBody className="p-4">
            <h1>{dict.signup.title}</h1>
            <p className="text-black-50 dark:text-gray-500">{dict.signup.description}</p>
            <Register />
          </CardBody>
        </Card>
      </Col>
    </Row>
  )
}
```

#### app/(authentication)/register/register.tsx
*Language: TypeScript | Size: 3297 bytes*

```typescript
'use client'

import {
  Alert, Button, Form, FormControl, InputGroup,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faUser } from '@fortawesome/free-regular-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import InputGroupText from 'react-bootstrap/InputGroupText'
import { signIn } from 'next-auth/react'
import useDictionary from '@/locales/dictionary-hook'

export default function Register() {
  const router = useRouter()
  const dict = useDictionary()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const register = async () => {
    setSubmitting(true)

    try {
      const res = await signIn('credentials', {
        username: 'Username',
        password: 'Password',
        redirect: false,
        callbackUrl: '/',
      })

      if (!res) {
        setError('Register failed')
        return
      }

      const { ok, url, error: err } = res

      if (!ok) {
        if (err) {
          setError(err)
          return
        }

        setError('Register failed')
        return
      }

      if (url) {
        router.push(url)
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Alert variant="danger" show={error !== ''} onClose={() => setError('')} dismissible>{error}</Alert>
      <Form onSubmit={register}>
        <InputGroup className="mb-3">
          <InputGroupText><FontAwesomeIcon icon={faUser} fixedWidth /></InputGroupText>
          <FormControl
            name="username"
            required
            disabled={submitting}
            placeholder={dict.signup.form.username}
            aria-label="Username"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroupText>
            <FontAwesomeIcon icon={faEnvelope} fixedWidth />
          </InputGroupText>
          <FormControl
            type="email"
            name="email"
            required
            disabled={submitting}
            placeholder={dict.signup.form.email}
            aria-label="Email"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroupText><FontAwesomeIcon icon={faLock} fixedWidth /></InputGroupText>
          <FormControl
            type="password"
            name="password"
            required
            disabled={submitting}
            placeholder={dict.signup.form.password}
            aria-label="Password"
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <InputGroupText><FontAwesomeIcon icon={faLock} fixedWidth /></InputGroupText>
          <FormControl
            type="password"
            name="password_repeat"
            required
            disabled={submitting}
            placeholder={dict.signup.form.confirm_password}
            aria-label="Confirm password"
          />
        </InputGroup>

        <Button type="submit" className="d-block w-100" disabled={submitting} variant="success">
          {dict.signup.form.submit}
        </Button>
      </Form>
    </>
  )
}
```

### app/(dashboard)/

#### app/(dashboard)/layout.tsx
*Language: TypeScript | Size: 1020 bytes*

```typescript
import { Container } from 'react-bootstrap'
import React from 'react'
import SidebarProvider from '@/components/Layout/Dashboard/SidebarProvider'
import SidebarOverlay from '@/components/Layout/Dashboard/Sidebar/SidebarOverlay'
import Sidebar from '@/components/Layout/Dashboard/Sidebar/Sidebar'
import SidebarNav from '@/components/Layout/Dashboard/Sidebar/SidebarNav'
import Header from '@/components/Layout/Dashboard/Header/Header'
import Footer from '@/components/Layout/Dashboard/Footer/Footer'

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SidebarOverlay />
      <Sidebar>
        <SidebarNav />
      </Sidebar>

      <div className="wrapper d-flex flex-column min-vh-100">
        <Header />

        <div className="body flex-grow-1 px-sm-2 mb-4">
          <Container fluid="lg">
            {children}
          </Container>
        </div>

        <Footer />
      </div>

      <SidebarOverlay />
    </SidebarProvider>
  )
}
```

#### app/(dashboard)/page.tsx
*Language: TypeScript | Size: 50348 bytes*

```typescript
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowDown,
  faArrowUp,
  faDownload,
  faEllipsisVertical,
  faMars,
  faSearch,
  faUsers,
  faVenus,
} from '@fortawesome/free-solid-svg-icons'
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  ProgressBar,
} from 'react-bootstrap'
import {
  faCcAmex,
  faCcApplePay,
  faCcPaypal,
  faCcStripe,
  faCcVisa,
  faFacebookF,
  faLinkedinIn,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import React from 'react'
import UserChart from '@/components/Page/Dashboard/UserChart'
import IncomeChart from '@/components/Page/Dashboard/IncomeChart'
import ConversionChart from '@/components/Page/Dashboard/ConversionChart'
import SessionChart from '@/components/Page/Dashboard/SessionChart'
import TrafficChart from '@/components/Page/Dashboard/TrafficChart'
import { getDictionary } from '@/locales/dictionary'

export default async function Page() {
  const dict = await getDictionary()

  return (
    <div>
      <div className="row">
        <div className="col-sm-6 col-lg-3">
          <Card bg="primary" text="white" className="mb-4">
            <CardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">
                  26K
                  <span className="fs-6 ms-2 fw-normal">
                    (-12.4%
                    <FontAwesomeIcon icon={faArrowDown} fixedWidth />
                    )
                  </span>
                </div>
                <div>{dict.dashboard.featured.user}</div>
              </div>
              <Dropdown align="end">
                <DropdownToggle
                  as="button"
                  bsPrefix="btn"
                  className="btn-link rounded-0 text-white shadow-none p-0"
                  id="dropdown-chart1"
                >
                  <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                </DropdownToggle>

                <DropdownMenu>
                  <DropdownItem href="#/action-1">{dict.dashboard.featured.action.action1}</DropdownItem>
                  <DropdownItem href="#/action-2">{dict.dashboard.featured.action.action2}</DropdownItem>
                  <DropdownItem href="#/action-3">{dict.dashboard.featured.action.action3}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardBody>
            <div className="mt-3 mx-3" style={{ height: '70px' }}>
              <UserChart />
            </div>
          </Card>
        </div>

        <div className="col-sm-6 col-lg-3">
          <Card bg="info" text="white" className="mb-4">
            <CardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">
                  $6.200
                  <span className="fs-6 ms-2 fw-normal">
                    (40.9%
                    <FontAwesomeIcon icon={faArrowUp} fixedWidth />
                    )
                  </span>
                </div>
                <div>{dict.dashboard.featured.income}</div>
              </div>
              <Dropdown align="end">
                <DropdownToggle
                  as="button"
                  bsPrefix="btn"
                  className="btn-link rounded-0 text-white shadow-none p-0"
                  id="dropdown-chart2"
                >
                  <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                </DropdownToggle>

                <DropdownMenu>
                  <DropdownItem href="#/action-1">{dict.dashboard.featured.action.action1}</DropdownItem>
                  <DropdownItem href="#/action-2">{dict.dashboard.featured.action.action2}</DropdownItem>
                  <DropdownItem href="#/action-3">{dict.dashboard.featured.action.action3}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardBody>
            <div className="mt-3 mx-3" style={{ height: '70px' }}>
              <IncomeChart />
            </div>
          </Card>
        </div>

        <div className="col-sm-6 col-lg-3">
          <Card bg="warning" text="white" className="mb-4">
            <CardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">
                  2.49%
                  <span className="fs-6 ms-2 fw-normal">
                    (84.7%
                    <FontAwesomeIcon icon={faArrowUp} fixedWidth />
                    )
                  </span>
                </div>
                <div>{dict.dashboard.featured.conversion_rate}</div>
              </div>
              <Dropdown align="end">
                <DropdownToggle
                  as="button"
                  bsPrefix="btn"
                  className="btn-link rounded-0 text-white shadow-none p-0"
                  id="dropdown-chart3"
                >
                  <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                </DropdownToggle>

                <DropdownMenu>
                  <DropdownItem href="#/action-1">{dict.dashboard.featured.action.action1}</DropdownItem>
                  <DropdownItem href="#/action-2">{dict.dashboard.featured.action.action2}</DropdownItem>
                  <DropdownItem href="#/action-3">{dict.dashboard.featured.action.action3}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardBody>
            <div className="mt-3 mx-3" style={{ height: '70px' }}>
              <ConversionChart />
            </div>
          </Card>
        </div>

        <div className="col-sm-6 col-lg-3">
          <Card bg="danger" text="white" className="mb-4">
            <CardBody className="pb-0 d-flex justify-content-between align-items-start">
              <div>
                <div className="fs-4 fw-semibold">
                  44K
                  <span className="fs-6 ms-2 fw-normal">
                    (-23.6%
                    <FontAwesomeIcon icon={faArrowDown} fixedWidth />
                    )
                  </span>
                </div>
                <div>{dict.dashboard.featured.sessions}</div>
              </div>
              <Dropdown align="end">
                <DropdownToggle
                  as="button"
                  bsPrefix="btn"
                  className="btn-link rounded-0 text-white shadow-none p-0"
                  id="dropdown-chart4"
                >
                  <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                </DropdownToggle>

                <DropdownMenu>
                  <DropdownItem href="#/action-1">{dict.dashboard.featured.action.action1}</DropdownItem>
                  <DropdownItem href="#/action-2">{dict.dashboard.featured.action.action2}</DropdownItem>
                  <DropdownItem href="#/action-3">{dict.dashboard.featured.action.action3}</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </CardBody>
            <div className="mt-3 mx-3" style={{ height: '70px' }}>
              <SessionChart />
            </div>
          </Card>
        </div>
      </div>

      <Card className="mb-4">
        <CardBody>
          <div className="d-flex justify-content-between">
            <div>
              <h4 className="mb-0">{dict.dashboard.traffic.title}</h4>
              <div className="small text-black-50 dark:text-gray-500">{dict.dashboard.traffic.duration}</div>
            </div>
            <div className="d-none d-md-block">
              <ButtonGroup aria-label="Toolbar with buttons" className="mx-3">
                <input
                  className="btn-check"
                  id="option1"
                  type="radio"
                  name="options"
                  autoComplete="off"
                />
                <label
                  className="btn btn-outline-secondary"
                  htmlFor="option1"
                >
                  {dict.dashboard.traffic.option.day}
                </label>
                <input
                  className="btn-check"
                  id="option2"
                  type="radio"
                  name="options"
                  autoComplete="off"
                  defaultChecked
                />
                <label
                  className="btn btn-outline-secondary active"
                  htmlFor="option2"
                >
                  {dict.dashboard.traffic.option.month}
                </label>
                <input
                  className="btn-check"
                  id="option3"
                  type="radio"
                  name="options"
                  autoComplete="off"
                />
                <label
                  className="btn btn-outline-secondary"
                  htmlFor="option3"
                >
                  {dict.dashboard.traffic.option.year}
                </label>
              </ButtonGroup>
              <Button variant="primary">
                <FontAwesomeIcon icon={faDownload} fixedWidth />
              </Button>
            </div>
          </div>
          <div
            style={{
              height: '300px',
              marginTop: '40px',
            }}
          >
            <TrafficChart />
          </div>
        </CardBody>
        <CardFooter>
          <div className="row row-cols-1 row-cols-md-5 text-center">
            <div className="col mb-sm-2 mb-0">
              <div className="text-black-50 dark:text-gray-500">{dict.dashboard.traffic.category1}</div>
              <div className="fw-semibold">
                29.703
                {dict.dashboard.traffic.users}
                {' '}
                (40%)
              </div>
              <ProgressBar
                className="progress-thin mt-2"
                variant="success"
                now={40}
              />
            </div>
            <div className="col mb-sm-2 mb-0">
              <div className="text-black-50 dark:text-gray-500">{dict.dashboard.traffic.category2}</div>
              <div className="fw-semibold">
                24.093
                {dict.dashboard.traffic.users}
                {' '}
                (20%)
              </div>
              <ProgressBar
                className="progress-thin mt-2"
                variant="info"
                now={20}
              />
            </div>
            <div className="col mb-sm-2 mb-0">
              <div className="text-black-50 dark:text-gray-500">{dict.dashboard.traffic.category3}</div>
              <div className="fw-semibold">
                78.706
                {dict.dashboard.traffic.views}
                {' '}
                (60%)
              </div>
              <ProgressBar
                className="progress-thin mt-2"
                variant="warning"
                now={60}
              />
            </div>
            <div className="col mb-sm-2 mb-0">
              <div className="text-black-50 dark:text-gray-500">{dict.dashboard.traffic.category4}</div>
              <div className="fw-semibold">
                22.123
                {dict.dashboard.traffic.users}
                {' '}
                (80%)
              </div>
              <ProgressBar
                className="progress-thin mt-2"
                variant="danger"
                now={80}
              />
            </div>
            <div className="col mb-sm-2 mb-0">
              <div className="text-black-50 dark:text-gray-500">{dict.dashboard.traffic.category5}</div>
              <div className="fw-semibold">40.15%</div>
              <ProgressBar
                className="progress-thin mt-2"
                variant="primary"
                now={40}
              />
            </div>
          </div>
        </CardFooter>
      </Card>

      <div className="row">
        <div className="col-sm-6 col-lg-4">
          <Card
            className="mb-4"
            style={{ '--bs-card-cap-bg': '#3b5998' } as React.CSSProperties}
          >
            <CardHeader className="d-flex justify-content-center align-items-center">
              <FontAwesomeIcon
                icon={faFacebookF}
                fixedWidth
                size="3x"
                className="my-4 text-white"
              />
            </CardHeader>
            <CardBody>
              <div className="row text-center">
                <div className="col">
                  <div className="fs-5 fw-semibold">89k</div>
                  <div className="text-uppercase text-black-50 dark:text-gray-500 small">
                    {dict.dashboard.social.facebook.label1}
                  </div>
                </div>
                <div className="vr p-0" />
                <div className="col">
                  <div className="fs-5 fw-semibold">459</div>
                  <div className="text-uppercase text-black-50 dark:text-gray-500 small">
                    {dict.dashboard.social.facebook.label2}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-sm-6 col-lg-4">
          <Card
            className="mb-4"
            style={{ '--bs-card-cap-bg': '#00aced' } as React.CSSProperties}
          >
            <CardHeader className="d-flex justify-content-center align-items-center">
              <FontAwesomeIcon
                icon={faTwitter}
                fixedWidth
                size="3x"
                className="my-4 text-white"
              />
            </CardHeader>
            <CardBody>
              <div className="row text-center">
                <div className="col">
                  <div className="fs-5 fw-semibold">973k</div>
                  <div className="text-uppercase text-black-50 dark:text-gray-500 small">
                    {dict.dashboard.social.twitter.label1}
                  </div>
                </div>
                <div className="vr p-0" />
                <div className="col">
                  <div className="fs-5 fw-semibold">1.792</div>
                  <div className="text-uppercase text-black-50 dark:text-gray-500 small">
                    {dict.dashboard.social.twitter.label2}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="col-sm-6 col-lg-4">
          <Card
            className="mb-4"
            style={{ '--bs-card-cap-bg': '#4875b4' } as React.CSSProperties}
          >
            <CardHeader className="d-flex justify-content-center align-items-center">
              <FontAwesomeIcon
                icon={faLinkedinIn}
                fixedWidth
                size="3x"
                className="my-4 text-white"
              />
            </CardHeader>
            <CardBody>
              <div className="row text-center">
                <div className="col">
                  <div className="fs-5 fw-semibold">500+</div>
                  <div className="text-uppercase text-black-50 dark:text-gray-500 small">
                    {dict.dashboard.social.instagram.label1}
                  </div>
                </div>
                <div className="vr p-0" />
                <div className="col">
                  <div className="fs-5 fw-semibold">292</div>
                  <div className="text-uppercase text-black-50 dark:text-gray-500 small">
                    {dict.dashboard.social.instagram.label2}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

      </div>

      <div className="row">
        <div className="col-md-12">
          <Card>
            <CardHeader>
              {dict.dashboard.sales.title}
            </CardHeader>
            <CardBody>
              <div className="row">
                <div className="col-sm-6">
                  <div className="row">
                    <div className="col-6">
                      <div className="border-start border-4 border-info px-3 mb-3">
                        <small className="text-black-50 dark:text-gray-500">
                          {dict.dashboard.sales.stats.stat1}
                        </small>
                        <div className="fs-5 fw-semibold">9,123</div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="border-start border-4 border-danger px-3 mb-3">
                        <small className="text-black-50 dark:text-gray-500">
                          {dict.dashboard.sales.stats.stat2}
                        </small>
                        <div className="fs-5 fw-semibold">22,643</div>
                      </div>
                    </div>

                  </div>

                  <hr className="mt-0" />

                  <div className="row mb-4 align-items-center">
                    <div className="col-3">
                      <span className="text-black-50 dark:text-gray-500 small">
                        {dict.dashboard.sales.monday}
                      </span>
                    </div>
                    <div className="col">
                      <ProgressBar
                        className="progress-thin mb-1"
                        variant="primary"
                        now={34}
                      />
                      <ProgressBar
                        className="progress-thin"
                        variant="danger"
                        now={78}
                      />
                    </div>
                  </div>

                  <div className="row mb-4 align-items-center">
                    <div className="col-3">
                      <span className="text-black-50 dark:text-gray-500 small">
                        {dict.dashboard.sales.tuesday}
                      </span>
                    </div>
                    <div className="col">
                      <ProgressBar
                        className="progress-thin mb-1"
                        variant="primary"
                        now={56}
                      />
                      <ProgressBar
                        className="progress-thin"
                        variant="danger"
                        now={94}
                      />
                    </div>
                  </div>

                  <div className="row mb-4 align-items-center">
                    <div className="col-3">
                      <span className="text-black-50 dark:text-gray-500 small">
                        {dict.dashboard.sales.wednesday}
                      </span>
                    </div>
                    <div className="col">
                      <ProgressBar
                        className="progress-thin mb-1"
                        variant="primary"
                        now={12}
                      />
                      <ProgressBar
                        className="progress-thin"
                        variant="danger"
                        now={67}
                      />
                    </div>
                  </div>

                  <div className="row mb-4 align-items-center">
                    <div className="col-3">
                      <span className="text-black-50 dark:text-gray-500 small">
                        {dict.dashboard.sales.thursday}
                      </span>
                    </div>
                    <div className="col">
                      <ProgressBar
                        className="progress-thin mb-1"
                        variant="primary"
                        now={43}
                      />
                      <ProgressBar
                        className="progress-thin"
                        variant="danger"
                        now={91}
                      />
                    </div>
                  </div>

                  <div className="row mb-4 align-items-center">
                    <div className="col-3">
                      <span className="text-black-50 dark:text-gray-500 small">
                        {dict.dashboard.sales.friday}
                      </span>
                    </div>
                    <div className="col">
                      <ProgressBar
                        className="progress-thin mb-1"
                        variant="primary"
                        now={22}
                      />
                      <ProgressBar
                        className="progress-thin"
                        variant="danger"
                        now={73}
                      />
                    </div>
                  </div>

                  <div className="row mb-4 align-items-center">
                    <div className="col-3">
                      <span className="text-black-50 dark:text-gray-500 small">
                        {dict.dashboard.sales.saturday}
                      </span>
                    </div>
                    <div className="col">
                      <ProgressBar
                        className="progress-thin mb-1"
                        variant="primary"
                        now={53}
                      />
                      <ProgressBar
                        className="progress-thin"
                        variant="danger"
                        now={82}
                      />
                    </div>
                  </div>

                  <div className="row mb-4 align-items-center">
                    <div className="col-3">
                      <span className="text-black-50 dark:text-gray-500 small">
                        {dict.dashboard.sales.sunday}
                      </span>
                    </div>
                    <div className="col">
                      <ProgressBar
                        className="progress-thin mb-1"
                        variant="primary"
                        now={9}
                      />
                      <ProgressBar
                        className="progress-thin"
                        variant="danger"
                        now={69}
                      />
                    </div>
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="row">
                    <div className="col-6">
                      <div className="border-start border-4 border-warning px-3 mb-3">
                        <small className="text-black-50 dark:text-gray-500">
                          {dict.dashboard.sales.stats.stat3}
                        </small>
                        <div className="fs-5 fw-semibold">78,623</div>
                      </div>
                    </div>

                    <div className="col-6">
                      <div className="border-start border-4 border-success px-3 mb-3">
                        <small className="text-black-50 dark:text-gray-500">
                          {dict.dashboard.sales.stats.stat4}
                        </small>
                        <div className="fs-5 fw-semibold">49,123</div>
                      </div>
                    </div>

                  </div>

                  <hr className="mt-0" />

                  <div className="mb-5">
                    <div className="mb-3">
                      <div className="d-flex mb-1">
                        <div>
                          <FontAwesomeIcon className="me-2" icon={faMars} fixedWidth />
                          {dict.dashboard.sales.male}
                        </div>
                        <div className="ms-auto fw-semibold">43%</div>
                      </div>
                      <ProgressBar
                        className="progress-thin"
                        variant="warning"
                        now={43}
                      />
                    </div>

                    <div className="mb-3">
                      <div className="d-flex mb-1">
                        <div>
                          <FontAwesomeIcon className="me-2" icon={faVenus} fixedWidth />
                          {dict.dashboard.sales.female}
                        </div>
                        <div className="ms-auto fw-semibold">37%</div>
                      </div>
                      <ProgressBar
                        className="progress-thin"
                        variant="warning"
                        now={37}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex mb-1">
                      <div>
                        <FontAwesomeIcon className="me-2" icon={faSearch} fixedWidth />
                        {dict.dashboard.sales.organic}
                      </div>
                      <div className="ms-auto fw-semibold me-2">191.235</div>
                      <div className="text-black-50 dark:text-gray-500 small">(56%)</div>
                    </div>
                    <ProgressBar
                      className="progress-thin"
                      variant="success"
                      now={56}
                    />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex mb-1">
                      <div>
                        <FontAwesomeIcon className="me-2" icon={faFacebookF} fixedWidth />
                        {dict.dashboard.sales.facebook}
                      </div>
                      <div className="ms-auto fw-semibold me-2">51.223</div>
                      <div className="text-black-50 dark:text-gray-500 small">(15%)</div>
                    </div>
                    <ProgressBar
                      className="progress-thin"
                      variant="success"
                      now={15}
                    />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex mb-1">
                      <div>
                        <FontAwesomeIcon className="me-2" icon={faTwitter} fixedWidth />
                        {dict.dashboard.sales.twitter}
                      </div>
                      <div className="ms-auto fw-semibold me-2">37.564</div>
                      <div className="text-black-50 dark:text-gray-500 small">(11%)</div>
                    </div>
                    <ProgressBar
                      className="progress-thin"
                      variant="success"
                      now={11}
                    />
                  </div>

                  <div className="mb-3">
                    <div className="d-flex mb-1">
                      <div>
                        <FontAwesomeIcon className="me-2" icon={faLinkedinIn} fixedWidth />
                        {dict.dashboard.sales.linkedin}
                      </div>
                      <div className="ms-auto fw-semibold me-2">27.319</div>
                      <div className="text-black-50 dark:text-gray-500 small">(8%)</div>
                    </div>
                    <ProgressBar
                      className="progress-thin"
                      variant="success"
                      now={8}
                    />
                  </div>
                </div>
              </div>

              <br />

              <div className="table-responsive">
                <table className="table border mb-0">
                  <thead className="fw-semibold">
                    <tr className="align-middle table-light dark:table-dark">
                      <th className="text-center" aria-label="icon">
                        <FontAwesomeIcon icon={faUsers} fixedWidth />
                      </th>
                      <th>{dict.dashboard.listing.headers.header1}</th>
                      <th>{dict.dashboard.listing.headers.header2}</th>
                      <th className="text-center">{dict.dashboard.listing.headers.header3}</th>
                      <th>{dict.dashboard.listing.headers.header4}</th>
                      <th aria-label="Action" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="align-middle">
                      <td className="text-center">
                        <div className="avatar avatar-md d-inline-flex position-relative">
                          <Image
                            fill
                            sizes="40px"
                            className="rounded-circle"
                            src="/assets/img/avatars/1.jpg"
                            alt="user@email.com"
                          />
                          <span
                            className="avatar-status position-absolute d-block bottom-0 end-0 bg-success rounded-circle border border-white"
                          />
                        </div>
                      </td>
                      <td>
                        <div>{dict.dashboard.listing.items.item1.name}</div>
                        <div className="small text-black-50 dark:text-gray-500">
                          <span>{dict.dashboard.listing.user_status.new}</span>
                          {' '}
                          |
                          {' '}
                          {dict.dashboard.listing.registered}
                          :
                          {' '}
                          {dict.dashboard.listing.registered_at}
                        </div>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-start">
                            <div className="fw-semibold">50%</div>
                          </div>
                          <div className="float-end">
                            <small className="text-black-50 dark:text-gray-500">
                              {dict.dashboard.listing.usage_duration}
                            </small>
                          </div>
                        </div>
                        <ProgressBar className="progress-thin" variant="success" now={50} />
                      </td>
                      <td className="text-center" aria-label="icon">
                        <FontAwesomeIcon icon={faCcAmex} size="lg" fixedWidth />
                      </td>
                      <td>
                        <div className="small text-black-50 dark:text-gray-500">{dict.dashboard.listing.last_login}</div>
                        <div className="fw-semibold">{dict.dashboard.listing.items.item1.login_at}</div>
                      </td>
                      <td>
                        <Dropdown align="end">
                          <DropdownToggle
                            as="button"
                            bsPrefix="btn"
                            className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                            id="action-user1"
                          >
                            <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                          </DropdownToggle>

                          <DropdownMenu>
                            <DropdownItem href="#/action-1">{dict.action.info}</DropdownItem>
                            <DropdownItem href="#/action-2">{dict.action.edit}</DropdownItem>
                            <DropdownItem
                              className="text-danger"
                              href="#/action-3"
                            >
                              {dict.action.delete}
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                    </tr>
                    <tr className="align-middle">
                      <td className="text-center">
                        <div className="avatar avatar-md d-inline-flex position-relative">
                          <Image
                            fill
                            sizes="40px"
                            className="rounded-circle"
                            src="/assets/img/avatars/2.jpg"
                            alt="user@email.com"
                          />
                          <span
                            className="avatar-status position-absolute d-block bottom-0 end-0 bg-danger rounded-circle border border-white"
                          />
                        </div>
                      </td>
                      <td>
                        <div>{dict.dashboard.listing.items.item2.name}</div>
                        <div className="small text-black-50 dark:text-gray-500">
                          <span>{dict.dashboard.listing.user_status.recurring}</span>
                          {' '}
                          |
                          {' '}
                          {dict.dashboard.listing.registered}
                          :
                          {' '}
                          {dict.dashboard.listing.registered_at}
                        </div>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-start">
                            <div className="fw-semibold">10%</div>
                          </div>
                          <div className="float-end">
                            <small className="text-black-50 dark:text-gray-500">
                              {dict.dashboard.listing.usage_duration}
                            </small>
                          </div>
                        </div>
                        <ProgressBar className="progress-thin" variant="info" now={10} />
                      </td>
                      <td className="text-center" aria-label="icon">
                        <FontAwesomeIcon icon={faCcVisa} size="lg" fixedWidth />
                      </td>
                      <td>
                        <div className="small text-black-50 dark:text-gray-500">{dict.dashboard.listing.last_login}</div>
                        <div className="fw-semibold">{dict.dashboard.listing.items.item2.login_at}</div>
                      </td>
                      <td>
                        <Dropdown align="end">
                          <DropdownToggle
                            as="button"
                            bsPrefix="btn"
                            className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                            id="action-user2"
                          >
                            <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                          </DropdownToggle>

                          <DropdownMenu>
                            <DropdownItem href="#/action-1">{dict.action.info}</DropdownItem>
                            <DropdownItem href="#/action-2">{dict.action.edit}</DropdownItem>
                            <DropdownItem
                              className="text-danger"
                              href="#/action-3"
                            >
                              {dict.action.delete}
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                    </tr>
                    <tr className="align-middle">
                      <td className="text-center">
                        <div className="avatar avatar-md d-inline-flex position-relative">
                          <Image
                            fill
                            sizes="40px"
                            className="rounded-circle"
                            src="/assets/img/avatars/3.jpg"
                            alt="user@email.com"
                          />
                          <span
                            className="avatar-status position-absolute d-block bottom-0 end-0 bg-warning rounded-circle border border-white"
                          />
                        </div>
                      </td>
                      <td>
                        <div>{dict.dashboard.listing.items.item3.name}</div>
                        <div className="small text-black-50 dark:text-gray-500">
                          <span>{dict.dashboard.listing.user_status.new}</span>
                          {' '}
                          |
                          {' '}
                          {dict.dashboard.listing.registered}
                          :
                          {' '}
                          {dict.dashboard.listing.registered_at}
                        </div>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-start">
                            <div className="fw-semibold">74%</div>
                          </div>
                          <div className="float-end">
                            <small className="text-black-50 dark:text-gray-500">
                              {dict.dashboard.listing.usage_duration}
                            </small>
                          </div>
                        </div>
                        <ProgressBar className="progress-thin" variant="warning" now={74} />
                      </td>
                      <td className="text-center" aria-label="icon">
                        <FontAwesomeIcon icon={faCcStripe} size="lg" fixedWidth />
                      </td>
                      <td>
                        <div className="small text-black-50 dark:text-gray-500">{dict.dashboard.listing.last_login}</div>
                        <div className="fw-semibold">{dict.dashboard.listing.items.item3.login_at}</div>
                      </td>
                      <td>
                        <Dropdown align="end">
                          <DropdownToggle
                            as="button"
                            bsPrefix="btn"
                            className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                            id="action-user3"
                          >
                            <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                          </DropdownToggle>

                          <DropdownMenu>
                            <DropdownItem href="#/action-1">{dict.action.info}</DropdownItem>
                            <DropdownItem href="#/action-2">{dict.action.edit}</DropdownItem>
                            <DropdownItem
                              className="text-danger"
                              href="#/action-3"
                            >
                              {dict.action.delete}
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                    </tr>
                    <tr className="align-middle">
                      <td className="text-center">
                        <div className="avatar avatar-md d-inline-flex position-relative">
                          <Image
                            fill
                            sizes="40px"
                            className="rounded-circle"
                            src="/assets/img/avatars/4.jpg"
                            alt="user@email.com"
                          />
                          <span
                            className="avatar-status position-absolute d-block bottom-0 end-0 bg-secondary rounded-circle border border-white"
                          />
                        </div>
                      </td>
                      <td>
                        <div>{dict.dashboard.listing.items.item4.name}</div>
                        <div className="small text-black-50 dark:text-gray-500">
                          <span>{dict.dashboard.listing.user_status.new}</span>
                          {' '}
                          |
                          {' '}
                          {dict.dashboard.listing.registered}
                          :
                          {' '}
                          {dict.dashboard.listing.registered_at}
                        </div>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-start">
                            <div className="fw-semibold">98%</div>
                          </div>
                          <div className="float-end">
                            <small className="text-black-50 dark:text-gray-500">
                              {dict.dashboard.listing.usage_duration}
                            </small>
                          </div>
                        </div>
                        <ProgressBar className="progress-thin" variant="danger" now={98} />
                      </td>
                      <td className="text-center" aria-label="icon">
                        <FontAwesomeIcon icon={faCcPaypal} size="lg" fixedWidth />
                      </td>
                      <td>
                        <div className="small text-black-50 dark:text-gray-500">{dict.dashboard.listing.last_login}</div>
                        <div className="fw-semibold">{dict.dashboard.listing.items.item4.login_at}</div>
                      </td>
                      <td>
                        <Dropdown align="end">
                          <DropdownToggle
                            as="button"
                            bsPrefix="btn"
                            className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                            id="action-user4"
                          >
                            <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                          </DropdownToggle>

                          <DropdownMenu>
                            <DropdownItem href="#/action-1">{dict.action.info}</DropdownItem>
                            <DropdownItem href="#/action-2">{dict.action.edit}</DropdownItem>
                            <DropdownItem
                              className="text-danger"
                              href="#/action-3"
                            >
                              {dict.action.delete}
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                    </tr>
                    <tr className="align-middle">
                      <td className="text-center">
                        <div className="avatar avatar-md d-inline-flex position-relative">
                          <Image
                            fill
                            sizes="40px"
                            className="rounded-circle"
                            src="/assets/img/avatars/5.jpg"
                            alt="user@email.com"
                          />
                          <span
                            className="avatar-status position-absolute d-block bottom-0 end-0 bg-success rounded-circle border border-white"
                          />
                        </div>
                      </td>
                      <td>
                        <div>{dict.dashboard.listing.items.item5.name}</div>
                        <div className="small text-black-50 dark:text-gray-500">
                          <span>{dict.dashboard.listing.user_status.new}</span>
                          {' '}
                          |
                          {' '}
                          {dict.dashboard.listing.registered}
                          :
                          {' '}
                          {dict.dashboard.listing.registered_at}
                        </div>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-start">
                            <div className="fw-semibold">22%</div>
                          </div>
                          <div className="float-end">
                            <small className="text-black-50 dark:text-gray-500">
                              {dict.dashboard.listing.usage_duration}
                            </small>
                          </div>
                        </div>
                        <ProgressBar className="progress-thin" variant="info" now={22} />
                      </td>
                      <td className="text-center" aria-label="icon">
                        <FontAwesomeIcon icon={faCcApplePay} size="lg" fixedWidth />
                      </td>
                      <td>
                        <div className="small text-black-50 dark:text-gray-500">{dict.dashboard.listing.last_login}</div>
                        <div className="fw-semibold">{dict.dashboard.listing.items.item5.login_at}</div>
                      </td>
                      <td>
                        <Dropdown align="end">
                          <DropdownToggle
                            as="button"
                            bsPrefix="btn"
                            className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                            id="action-user5"
                          >
                            <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                          </DropdownToggle>

                          <DropdownMenu>
                            <DropdownItem href="#/action-1">{dict.action.info}</DropdownItem>
                            <DropdownItem href="#/action-2">{dict.action.edit}</DropdownItem>
                            <DropdownItem
                              className="text-danger"
                              href="#/action-3"
                            >
                              {dict.action.delete}
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                    </tr>
                    <tr className="align-middle">
                      <td className="text-center">
                        <div className="avatar avatar-md d-inline-flex position-relative">
                          <Image
                            fill
                            sizes="40px"
                            className="rounded-circle"
                            src="/assets/img/avatars/6.jpg"
                            alt="user@email.com"
                          />
                          <span
                            className="avatar-status position-absolute d-block bottom-0 end-0 bg-danger rounded-circle border border-white"
                          />
                        </div>
                      </td>
                      <td>
                        <div>{dict.dashboard.listing.items.item6.name}</div>
                        <div className="small text-black-50 dark:text-gray-500">
                          <span>{dict.dashboard.listing.user_status.new}</span>
                          {' '}
                          |
                          {' '}
                          {dict.dashboard.listing.registered}
                          :
                          {' '}
                          {dict.dashboard.listing.registered_at}
                        </div>
                      </td>
                      <td>
                        <div className="clearfix">
                          <div className="float-start">
                            <div className="fw-semibold">43%</div>
                          </div>
                          <div className="float-end">
                            <small className="text-black-50 dark:text-gray-500">
                              {dict.dashboard.listing.usage_duration}
                            </small>
                          </div>
                        </div>
                        <ProgressBar className="progress-thin" variant="success" now={43} />
                      </td>
                      <td className="text-center" aria-label="icon">
                        <FontAwesomeIcon icon={faCcAmex} size="lg" fixedWidth />
                      </td>
                      <td>
                        <div className="small text-black-50 dark:text-gray-500">{dict.dashboard.listing.last_login}</div>
                        <div className="fw-semibold">{dict.dashboard.listing.items.item6.login_at}</div>
                      </td>
                      <td>
                        <Dropdown align="end">
                          <DropdownToggle
                            as="button"
                            bsPrefix="btn"
                            className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                            id="action-user6"
                          >
                            <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                          </DropdownToggle>

                          <DropdownMenu>
                            <DropdownItem href="#/action-1">{dict.action.info}</DropdownItem>
                            <DropdownItem href="#/action-2">{dict.action.edit}</DropdownItem>
                            <DropdownItem
                              className="text-danger"
                              href="#/action-3"
                            >
                              {dict.action.delete}
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  )
}
```

### app/(dashboard)/dishes/

#### app/(dashboard)/dishes/page.tsx
*Language: TypeScript | Size: 710 bytes*

```typescript
import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import DishesList from '@/components/Page/Dish/DishesList'
import { getDictionary } from '@/locales/dictionary'

export default async function Page() {
  // console.log('Fetching dictionary for dishes page')
  const dict = await getDictionary()
console.log('Fetching dictionary for dishes page')
  return (
    // <Card>
    //   {/* <CardHeader>
    //     {dict.sidebar.items?.dishes || 'Dishes'}
    //   </CardHeader> */}
     
    // </Card>
    <Card>
      {/* <CardHeader>{dict.pokemons.title}</CardHeader> */}
      <CardBody>
        {/* <DishesList /> */}
      </CardBody>
      <DishesList />
    </Card>
  )
}
```

### app/(dashboard)/dishes/[id]/edit/

#### app/(dashboard)/dishes/[id]/edit/page.tsx
*Language: TypeScript | Size: 1034 bytes*

```typescript
'use server'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import { notFound } from 'next/navigation'
import { dishApi } from '@/services'
import { Dish } from '@/models'
import DishForm from '@/components/Page/Dish/DishForm'
import { getDictionary } from '@/locales/dictionary'

const fetchDish = async (id: string): Promise<Dish | null> => {
  try {
    // Note: This is server-side fetch, need to handle authentication differently
    console.log('Fetching dish with id:', id)
    const response = await dishApi.getById(id)
    return response
  } catch (error) {
    console.error('Error fetching dish:', error)
    return null
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const dish = await fetchDish(params.id)
  const dict = await getDictionary()

  if (!dish) {
    return notFound()
  }

  return (
    <Card>
      <CardHeader>{dict.dishes.edit}: {dish.dishName}</CardHeader>
      <CardBody>
        <DishForm dish={dish} isEdit />
      </CardBody>
    </Card>
  )
}
```

### app/(dashboard)/dishes/create/

#### app/(dashboard)/dishes/create/page.tsx
*Language: TypeScript | Size: 396 bytes*

```typescript
'use client'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import DishForm from '@/components/Page/Dish/DishForm'
import useDictionary from '@/locales/dictionary-hook'

export default function Page() {
  const dict = useDictionary()
  return (
    <Card>
      <CardHeader>{dict.dishes.add_new}</CardHeader>
      <CardBody>
        <DishForm />
      </CardBody>
    </Card>
  )
}
```

### app/(dashboard)/ingredients/

#### app/(dashboard)/ingredients/page.tsx
*Language: TypeScript | Size: 492 bytes*

```typescript
import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import IngredientsList from '@/components/Page/Ingredient/IngredientList'
import { getDictionary } from '@/locales/dictionary'

export default async function Page() {
  const dict = await getDictionary()

  return (
    <Card>
      <CardHeader>
        {dict.sidebar.items?.ingredients || 'Ingredients'}
      </CardHeader>
      <CardBody>
        <IngredientsList />
      </CardBody>
    </Card>
  )
}
```

### app/(dashboard)/ingredients/[id]/edit/

#### app/(dashboard)/ingredients/[id]/edit/page.tsx
*Language: TypeScript | Size: 1213 bytes*

```typescript
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import IngredientForm from '@/components/Page/Ingredient/IngredientForm'
import { notFound } from 'next/navigation'
import { dishApi, ingredientApi } from '@/services'
import { Ingredient } from '@/models'
import { getDictionary } from '@/locales/dictionary'

const fetchIngredient = async (id: string): Promise<Ingredient | null> => {
 
  try {
    // Note: This is server-side fetch, need to handle authentication differently
    console.log('Fetching ingredient with id:', id)
    const response = await ingredientApi.getById(id)
    return response
  } catch (error) {
    console.error('Error fetching ingredient:', error)
    return null
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  const dict = await getDictionary()
  console.log('Fetching ingredient with id:', params.id)
  const ingredient = await fetchIngredient(params.id)

  if (!ingredient) {
    return notFound()
  }

  return (
    <Card>
      <CardHeader>{dict.ingredients?.edit || 'Edit'}: {ingredient.ingredientName}</CardHeader>
      <CardBody>
        <IngredientForm ingredient={ingredient} isEdit />
      </CardBody>
    </Card>
  )
}
```

### app/(dashboard)/ingredients/create/

#### app/(dashboard)/ingredients/create/page.tsx
*Language: TypeScript | Size: 440 bytes*

```typescript
'use client'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import IngredientForm from '@/components/Page/Ingredient/IngredientForm'
import useDictionary from '@/locales/dictionary-hook'

export default function Page() {
  const dict = useDictionary()

  return (
    <Card>
      <CardHeader>{dict.ingredients?.add_new || 'Add new'}</CardHeader>
      <CardBody>
        <IngredientForm />
      </CardBody>
    </Card>
  )
}
```

### app/(dashboard)/kitchens/

#### app/(dashboard)/kitchens/page.tsx
*Language: TypeScript | Size: 489 bytes*

```typescript
import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import { getDictionary } from '@/locales/dictionary'
import KitchensList from '@/components/Page/Kitchen/KitchensList'

export default async function Page() {
  const dict = await getDictionary()

  return (
    <Card>
      {/* <CardHeader>
        {dict.sidebar.items?.ingredients || 'Ingredients'}
      </CardHeader> */}
      <CardBody>
        <KitchensList />
      </CardBody>
    </Card>
  )
}
```

### app/(dashboard)/kitchens/[id]/edit/

#### app/(dashboard)/kitchens/[id]/edit/page.tsx
*Language: TypeScript | Size: 1046 bytes*

```typescript
'use server'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import KitchenForm from '@/components/Page/Kitchen/KitchenForm'
import { notFound } from 'next/navigation'
import { kitchenApi } from '@/services'
import { Kitchen } from '@/models'

const fetchKitchen = async (id: string): Promise<Kitchen | null> => {
  try {
    // Note: This is server-side fetch, need to handle authentication differently
    console.log('Fetching kitchen with id:', id)
    const response = await kitchenApi.getById(id)
    return response
  } catch (error) {
    console.error('Error fetching kitchen:', error)
    return null
  }
}

export default async function Page({ params }: { params: { id: string } }) {
  console.log('Fetching kitchen with id:', params.id)
  const kitchen = await fetchKitchen(params.id)

  if (!kitchen) {
    return notFound()
  }

  return (
    <Card>
      <CardHeader>Edit Kitchen: {kitchen.kitchenName}</CardHeader>
      <CardBody>
        <KitchenForm kitchen={kitchen} isEdit />
      </CardBody>
    </Card>
  )
}
```

### app/(dashboard)/kitchens/create/

#### app/(dashboard)/kitchens/create/page.tsx
*Language: TypeScript | Size: 304 bytes*

```typescript
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import KitchenForm from '@/components/Page/Kitchen/KitchenForm'

export default function Page() {
  return (
    <Card>
      <CardHeader>Add New Kitchen</CardHeader>
      <CardBody>
        <KitchenForm />
      </CardBody>
    </Card>
  )
}
```

### app/api/auth/

#### app/api/auth/option.ts
*Language: TypeScript | Size: 3513 bytes*

```typescript
import { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { getDictionary } from '@/locales/dictionary'
import Cookies from 'js-cookie'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:18080'

export const authOptions: NextAuthOptions = {
  callbacks: {
    async jwt({ user, token }) {
      if (user) {
        return { 
          ...token, 
          user: { ...user as User },
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken
        }
      }

      return token
    },
    async session({ session, token }) {
      return { 
        ...session, 
        user: token.user,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
      }
    },
  },
  providers: [
    CredentialsProvider({
      credentials: {
        username: { type: 'string' },
        password: { type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null
        }
        const { username, password } = credentials

        const dict = await getDictionary()

        try {
          const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              password,
            }),
          })
          console.log('Credentials login request sent', `${API_BASE_URL}/auth/login`, JSON.stringify({
              username,
              password,
            }))
          console.log('Login response:', response)
          if (!response.ok) {
            throw new Error(dict.login.message.auth_failed)
          }

          const data = await response.json()

          // Store tokens in cookies fr client-side access
          console.log('Running in browser:', typeof window !== 'undefined')
          
          if (typeof window !== 'undefined') {
            Cookies.set('name', 'value')
            Cookies.set('access_token', data.data.access_token)
            console.log('Storing tokens in cookies1', data.data.access_token)

            if (data.data.refresh_token) {
              Cookies.set('refresh_token', data.data.refresh_token)
            }
            if (data.data.access_token_expires_at) {
              Cookies.set('token_expire', data.data.access_token_expires_at)
            }
          } 

          return {
            id: data.user?.id || 1,
            name: data.user?.name || username,
            username: username,
            email: data.user?.email || `${username}@email.com`,
            avatar: data.user?.avatar || '/assets/img/avatars/8.jpg',
            accessToken: data.data.access_token,
            refreshToken: data.data.refresh_token,
          }
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message)
          }
          throw new Error(dict.login.message.auth_failed)
        }
      },
    }),
  ],
}

declare module 'next-auth' {
  interface User {
    id: number
    username: string
    name: string
    email: string
    avatar: string
    accessToken?: string
    refreshToken?: string
  }

  interface Session {
    user: User
    accessToken?: string
    refreshToken?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User
    accessToken?: string
    refreshToken?: string
  }
}
```

### app/api/auth/[...nextauth]/

#### app/api/auth/[...nextauth]/route.ts
*Language: TypeScript | Size: 445 bytes*

```typescript
import NextAuth, { User } from 'next-auth'
import { authOptions } from '@/app/api/auth/option'

declare module 'next-auth' {
  interface User {
    id: number;
    username: string;
    name: string;
    email: string;
    avatar: string;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user: User;
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

### app/api/health/

#### app/api/health/route.ts
*Language: TypeScript | Size: 73 bytes*

```typescript
export async function GET() {
  return Response.json({ health: true })
}
```

### components/Form/

#### components/Form/FormError.tsx
*Language: TypeScript | Size: 253 bytes*

```typescript
import React from 'react'
import Feedback from 'react-bootstrap/Feedback'

export default function FormError(props: { messages?: string[] }) {
  const { messages } = props

  return messages && <Feedback type="invalid">{messages.join(' ')}</Feedback>
}
```

### components/Image/

#### components/Image/ImageFallback.tsx
*Language: TypeScript | Size: 724 bytes*

```typescript
'use client'

import Image, { ImageProps } from 'next/image'
import { useEffect, useState } from 'react'

type Props = {
  src: string;
  fallbackSrc: string;
} & ImageProps

// Source: https://stackoverflow.com/questions/66949606/what-is-the-best-way-to-have-a-fallback-image-in-nextjs
export default function ImageFallback(props: Props) {
  const {
    src,
    fallbackSrc,
    ...rest
  } = props

  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => {
    setImgSrc(src)
  }, [src])
  return (
    <Image
      /* eslint-disable-next-line react/jsx-props-no-spreading */
      {...rest}
      alt={rest.alt ?? ''}
      src={imgSrc}
      onError={() => {
        setImgSrc(fallbackSrc)
      }}
    />
  )
}
```

### components/Layout/Dashboard/

#### components/Layout/Dashboard/SidebarProvider.tsx
*Language: TypeScript | Size: 896 bytes*

```typescript
'use client'

import {
  createContext, Dispatch, SetStateAction, useContext, useMemo, useState,
} from 'react'

type SidebarContextType = {
  showSidebarState: [boolean, Dispatch<SetStateAction<boolean>>];
}

export const SidebarContext = createContext<SidebarContextType>({
  showSidebarState: [false, () => {}],
})

export default function SidebarProvider({ children }: {
  children: React.ReactNode;
}) {
  const [isShowSidebar, setIsShowSidebar] = useState(false)

  const value: SidebarContextType = useMemo(() => ({
    showSidebarState: [isShowSidebar, setIsShowSidebar],
  }), [isShowSidebar])

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
}

export const useSidebar = () => {
  const sidebar = useContext(SidebarContext)
  if (sidebar === null) {
    throw new Error('useSidebar hook must be used within SidebarProvider')
  }

  return sidebar
}
```

### components/Layout/Dashboard/Breadcrumb/

#### components/Layout/Dashboard/Breadcrumb/Breadcrumb.tsx
*Language: TypeScript | Size: 714 bytes*

```typescript
import { Breadcrumb as BSBreadcrumb, BreadcrumbItem } from 'react-bootstrap'
import { getDictionary } from '@/locales/dictionary'

export default async function Breadcrumb() {
  const dict = await getDictionary()
  return (
    <BSBreadcrumb listProps={{ className: 'mb-0 align-items-center' }}>
      <BreadcrumbItem
        linkProps={{ className: 'text-decoration-none' }}
        href="/"
      >
        {dict.breadcrumb.home}
      </BreadcrumbItem>
      <BreadcrumbItem
        linkProps={{ className: 'text-decoration-none' }}
        href="/"
      >
        {dict.breadcrumb.library}
      </BreadcrumbItem>
      <BreadcrumbItem active>{dict.breadcrumb.data}</BreadcrumbItem>
    </BSBreadcrumb>
  )
}
```

### components/Layout/Dashboard/Footer/

#### components/Layout/Dashboard/Footer/Footer.tsx
*Language: TypeScript | Size: 898 bytes*

```typescript
import React from 'react'
import { Container } from 'react-bootstrap'

export default function Footer() {
  return (
    <footer className="footer border-top px-sm-2 py-2">
      <Container fluid className="text-center align-items-center flex-column flex-md-row d-flex justify-content-between">
        <div>
          <a className="text-decoration-none" href="https://coreui.io">CoreUI </a>
          <a className="text-decoration-none" href="https://coreui.io">
            Bootstrap Admin
            Template
          </a>
          {' '}
          © 2021
          creativeLabs.
        </div>
        <div className="ms-md-auto">
          Powered by&nbsp;
          <a
            className="text-decoration-none"
            href="@app/ui/dashboard/AdminLayout"
          >
            CoreUI UI
            Components
          </a>
        </div>
      </Container>
    </footer>
  )
}
```

### components/Layout/Dashboard/Header/

#### components/Layout/Dashboard/Header/Header.tsx
*Language: TypeScript | Size: 1434 bytes*

```typescript
import Link from 'next/link'
import { Container } from 'react-bootstrap'
import HeaderSidebarToggler from '@/components/Layout/Dashboard/Header/HeaderSidebarToggler'
import HeaderFeaturedNav from '@/components/Layout/Dashboard/Header/HeaderFeaturedNav'
import HeaderNotificationNav from '@/components/Layout/Dashboard/Header/HeaderNotificationNav'
import HeaderProfileNav from '@/components/Layout/Dashboard/Header/HeaderProfileNav'
import Breadcrumb from '@/components/Layout/Dashboard/Breadcrumb/Breadcrumb'

export default function Header() {
  return (
    <header className="header sticky-top mb-4 py-2 px-sm-2 border-bottom">
      <Container fluid className="header-navbar d-flex align-items-center px-0">
        <HeaderSidebarToggler />
        <Link href="/" className="header-brand d-md-none">
          <svg width="80" height="46">
            <title>CoreUI Logo</title>
            <use xlinkHref="/assets/brand/coreui.svg#full" />
          </svg>
        </Link>
        <div className="header-nav d-none d-md-flex">
          <HeaderFeaturedNav />
        </div>
        <div className="header-nav ms-auto">
          <HeaderNotificationNav />
        </div>
        <div className="header-nav ms-2">
          <HeaderProfileNav />
        </div>
      </Container>
      <div className="header-divider border-top my-2 mx-sm-n2" />
      <Container fluid>
        <Breadcrumb />
      </Container>
    </header>
  )
}
```

#### components/Layout/Dashboard/Header/HeaderFeaturedNav.tsx
*Language: TypeScript | Size: 777 bytes*

```typescript
import Link from 'next/link'
import { Nav, NavItem, NavLink } from 'react-bootstrap'
import { getDictionary } from '@/locales/dictionary'

export default async function HeaderFeaturedNav() {
  const dict = await getDictionary()
  return (
    <Nav>
      <NavItem>
        <Link href="/" passHref legacyBehavior>
          <NavLink className="p-2">{dict.featured_nav.dashboard}</NavLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link href="#" passHref legacyBehavior>
          <NavLink className="p-2">{dict.featured_nav.users}</NavLink>
        </Link>
      </NavItem>
      <NavItem>
        <Link href="#" passHref legacyBehavior>
          <NavLink className="p-2">{dict.featured_nav.settings}</NavLink>
        </Link>
      </NavItem>
    </Nav>
  )
}
```

#### components/Layout/Dashboard/Header/HeaderLocale.tsx
*Language: TypeScript | Size: 1218 bytes*

```typescript
'use client'

import Cookies from 'js-cookie'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle, NavLink,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLanguage } from '@fortawesome/free-solid-svg-icons'

export default function HeaderLocale({ currentLocale }: { currentLocale: string }) {
  const [locale, setLocale] = useState(currentLocale)
  const router = useRouter()

  const changeLocale = (loc: string) => {
    Cookies.set('locale', loc)
    setLocale(loc)
    router.refresh()
  }

  return (
    <Dropdown>
      <DropdownToggle className="px-2 mx-1 px-sm-3 mx-sm-0" as={NavLink} bsPrefix="hide-caret" id="dropdown-locale">
        <FontAwesomeIcon icon={faLanguage} size="lg" />
      </DropdownToggle>
      <DropdownMenu className="pt-0" align="end">
        <DropdownItem active={locale === 'en'} onClick={() => changeLocale('en')}>
          English
        </DropdownItem>
        <DropdownItem active={locale === 'vi'} onClick={() => changeLocale('vi')}>
          Tiếng Việt
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
```

#### components/Layout/Dashboard/Header/HeaderLogout.tsx
*Language: TypeScript | Size: 340 bytes*

```typescript
'use client'

import { signOut } from 'next-auth/react'

export default function HeaderLogout({ children }: { children: React.ReactNode }) {
  const logout = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <div onClick={logout} onKeyDown={logout} role="button" tabIndex={0}>
      {children}
    </div>
  )
}
```

#### components/Layout/Dashboard/Header/HeaderNotificationNav.tsx
*Language: TypeScript | Size: 14615 bytes*

```typescript
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBell, faEnvelope, IconDefinition } from '@fortawesome/free-regular-svg-icons'
import {
  faBasketShopping,
  faChartBar,
  faGaugeHigh,
  faList,
  faUserMinus,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons'
import {
  Badge,
  Dropdown, DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  ProgressBar,
} from 'react-bootstrap'
import Link from 'next/link'
import React, { PropsWithChildren } from 'react'
import Image from 'next/image'
import HeaderLocale from '@/components/Layout/Dashboard/Header/HeaderLocale'
import { getDictionary, getLocale } from '@/locales/dictionary'
import HeaderTheme from '@/components/Layout/Dashboard/Header/HeaderTheme'
import { getPreferredTheme } from '@/themes/theme'

type ItemWithIconProps = {
  icon: IconDefinition;
} & PropsWithChildren

const ItemWithIcon = (props: ItemWithIconProps) => {
  const { icon, children } = props

  return (
    <>
      <FontAwesomeIcon className="me-2" icon={icon} fixedWidth />
      {children}
    </>
  )
}

export default async function HeaderNotificationNav() {
  const dict = await getDictionary()
  return (
    <Nav>
      <NavItem className="d-none d-sm-block">
        <Dropdown>
          <DropdownToggle className="px-2 mx-1 px-sm-3 mx-sm-0" as={NavLink} bsPrefix="hide-caret" id="dropdown-notification">
            <FontAwesomeIcon icon={faBell} size="lg" />
            <Badge pill bg="danger" className="position-absolute top-0 end-0 px-1 px-sm-2">
              5
            </Badge>
          </DropdownToggle>
          <DropdownMenu className="pt-0" align="end">
            <DropdownHeader className="fw-bold rounded-top">{dict.notification.message.replace('{{total}}', '5')}</DropdownHeader>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <ItemWithIcon icon={faUserPlus}>
                  {dict.notification.items.new_user}
                </ItemWithIcon>
              </DropdownItem>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <ItemWithIcon icon={faUserMinus}>
                  {dict.notification.items.deleted_user}
                </ItemWithIcon>
              </DropdownItem>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <ItemWithIcon icon={faChartBar}>
                  {dict.notification.items.sales_report}
                </ItemWithIcon>
              </DropdownItem>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <ItemWithIcon icon={faBasketShopping}>
                  {dict.notification.items.new_client}
                </ItemWithIcon>
              </DropdownItem>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <ItemWithIcon icon={faGaugeHigh}>
                  {dict.notification.items.server_overloaded}
                </ItemWithIcon>
              </DropdownItem>
            </Link>

            <DropdownHeader className="fw-bold">{dict.notification.server.title}</DropdownHeader>

            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <small><div className="text-uppercase"><b>{dict.notification.server.items.cpu}</b></div></small>
                <ProgressBar
                  className="progress-thin mt-2"
                  variant="primary"
                  now={25}
                />
                <small>
                  <div className="text-muted">
                    348
                    {dict.notification.server.processes}
                    . 1/4
                    {dict.notification.server.cores}
                    .
                  </div>
                </small>
              </DropdownItem>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <small><div className="text-uppercase"><b>{dict.notification.server.items.memory}</b></div></small>
                <ProgressBar
                  className="progress-thin mt-2"
                  variant="warning"
                  now={75}
                />
                <small>
                  <div className="text-muted">11,444GB / 16,384MB</div>
                </small>
              </DropdownItem>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <small><div className="text-uppercase"><b>{dict.notification.server.items.ssd1}</b></div></small>
                <ProgressBar
                  className="progress-thin mt-2"
                  variant="danger"
                  now={90}
                />
                <small>
                  <div className="text-muted">243GB / 256GB</div>
                </small>
              </DropdownItem>
            </Link>
          </DropdownMenu>
        </Dropdown>
      </NavItem>
      <NavItem className="d-none d-sm-block">
        <Dropdown>
          <DropdownToggle className="px-2 mx-1 px-sm-3 mx-sm-0" as={NavLink} bsPrefix="hide-caret" id="dropdown-task">
            <FontAwesomeIcon icon={faList} size="lg" />
            <Badge pill bg="warning" className="position-absolute top-0 end-0 px-1 px-sm-2">
              5
            </Badge>
          </DropdownToggle>
          <DropdownMenu className="pt-0" align="end">
            <DropdownHeader className="fw-bold rounded-top">{dict.task.message.replace('{{total}}', '5')}</DropdownHeader>

            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <small className="d-flex">
                  <div>{dict.task.items.task1}</div>
                  <div className="ms-auto">0%</div>
                </small>
                <ProgressBar
                  className="progress-thin mt-2"
                  variant="primary"
                  now={0}
                />
              </DropdownItem>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <small className="d-flex">
                  <div>{dict.task.items.task2}</div>
                  <div className="ms-auto">25%</div>
                </small>
                <ProgressBar
                  className="progress-thin mt-2"
                  variant="danger"
                  now={25}
                />
              </DropdownItem>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <small className="d-flex">
                  <div>{dict.task.items.task3}</div>
                  <div className="ms-auto">50%</div>
                </small>
                <ProgressBar
                  className="progress-thin mt-2"
                  variant="warning"
                  now={50}
                />
              </DropdownItem>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <small className="d-flex">
                  <div>{dict.task.items.task4}</div>
                  <div className="ms-auto">75%</div>
                </small>
                <ProgressBar
                  className="progress-thin mt-2"
                  variant="primary"
                  now={75}
                />
              </DropdownItem>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <small className="d-flex">
                  <div>{dict.task.items.task5}</div>
                  <div className="ms-auto">100%</div>
                </small>
                <ProgressBar
                  className="progress-thin mt-2"
                  variant="success"
                  now={100}
                />
              </DropdownItem>
            </Link>

            <DropdownDivider />

            <Link href="#" passHref legacyBehavior>
              <DropdownItem className="text-center fw-bold">{dict.task.view_all}</DropdownItem>
            </Link>

          </DropdownMenu>
        </Dropdown>
      </NavItem>
      <NavItem className="d-none d-sm-block">
        <Dropdown>
          <DropdownToggle className="px-2 mx-1 px-sm-3 mx-sm-0" as={NavLink} bsPrefix="hide-caret" id="dropdown-mail">
            <FontAwesomeIcon icon={faEnvelope} size="lg" />
            <Badge pill bg="primary" className="position-absolute top-0 end-0 px-1 px-sm-2">
              7
            </Badge>
          </DropdownToggle>
          <DropdownMenu className="pt-0" align="end">
            <DropdownHeader className="fw-bold rounded-top">{dict.messages.message.replace('{{total}}', '4')}</DropdownHeader>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <div className="message">
                  <div className="py-3 me-3 float-start">
                    <div className="avatar d-inline-flex position-relative">
                      <Image
                        fill
                        className="rounded-circle"
                        src="/assets/img/avatars/1.jpg"
                        alt="user@email.com"
                      />
                      <span
                        className="avatar-status position-absolute d-block bottom-0 end-0 bg-success rounded-circle border border-white"
                      />
                    </div>
                  </div>
                  <div>
                    <small className="text-muted">{dict.messages.items.item1.user}</small>
                    <small className="text-muted float-end mt-1">{dict.messages.items.item1.time}</small>
                  </div>
                  <div className="text-truncate font-weight-bold">
                    <span className="text-danger">!</span>
                    {' '}
                    {dict.messages.items.item1.title}
                  </div>
                  <div className="small text-truncate text-muted">
                    {dict.messages.items.item1.description}
                  </div>
                </div>
              </DropdownItem>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <div className="message">
                  <div className="py-3 me-3 float-start">
                    <div className="avatar d-inline-flex position-relative">
                      <Image
                        fill
                        className="rounded-circle"
                        src="/assets/img/avatars/2.jpg"
                        alt="user@email.com"
                      />
                      <span
                        className="avatar-status position-absolute d-block bottom-0 end-0 bg-warning rounded-circle border border-white"
                      />
                    </div>
                  </div>
                  <div>
                    <small className="text-muted">{dict.messages.items.item2.user}</small>
                    <small className="text-muted float-end mt-1">{dict.messages.items.item2.time}</small>
                  </div>
                  <div className="text-truncate font-weight-bold">
                    {dict.messages.items.item2.title}
                  </div>
                  <div className="small text-truncate text-muted">
                    {dict.messages.items.item2.description}
                  </div>
                </div>
              </DropdownItem>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <div className="message">
                  <div className="py-3 me-3 float-start">
                    <div className="avatar d-inline-flex position-relative">
                      <Image
                        fill
                        className="rounded-circle"
                        src="/assets/img/avatars/3.jpg"
                        alt="user@email.com"
                      />
                      <span
                        className="avatar-status position-absolute d-block bottom-0 end-0 bg-danger rounded-circle border border-white"
                      />
                    </div>
                  </div>
                  <div>
                    <small className="text-muted">{dict.messages.items.item3.user}</small>
                    <small className="text-muted float-end mt-1">{dict.messages.items.item3.time}</small>
                  </div>
                  <div className="text-truncate font-weight-bold">
                    {dict.messages.items.item3.title}
                  </div>
                  <div className="small text-truncate text-muted">
                    {dict.messages.items.item3.description}
                  </div>
                </div>
              </DropdownItem>
            </Link>
            <Link href="#" passHref legacyBehavior>
              <DropdownItem>
                <div className="message">
                  <div className="py-3 me-3 float-start">
                    <div className="avatar d-inline-flex position-relative">
                      <Image
                        fill
                        className="rounded-circle"
                        src="/assets/img/avatars/4.jpg"
                        alt="user@email.com"
                      />
                      <span
                        className="avatar-status position-absolute d-block bottom-0 end-0 bg-primary rounded-circle border border-white"
                      />
                    </div>
                  </div>
                  <div>
                    <small className="text-muted">{dict.messages.items.item4.user}</small>
                    <small className="text-muted float-end mt-1">{dict.messages.items.item4.time}</small>
                  </div>
                  <div className="text-truncate font-weight-bold">
                    {dict.messages.items.item4.title}
                  </div>
                  <div className="small text-truncate text-muted">
                    {dict.messages.items.item4.description}
                  </div>
                </div>
              </DropdownItem>
            </Link>
          </DropdownMenu>
        </Dropdown>
      </NavItem>
      <NavItem>
        <HeaderLocale currentLocale={getLocale()} />
      </NavItem>
      <NavItem>
        <HeaderTheme currentPreferredTheme={getPreferredTheme()} />
      </NavItem>
    </Nav>
  )
}
```

#### components/Layout/Dashboard/Header/HeaderProfileNav.tsx
*Language: TypeScript | Size: 4691 bytes*

```typescript
import {
  Badge,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
} from 'react-bootstrap'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBell,
  faCreditCard,
  faEnvelopeOpen,
  faFile,
  faMessage,
  faUser,
} from '@fortawesome/free-regular-svg-icons'
import { PropsWithChildren } from 'react'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import {
  faGear, faListCheck, faLock, faPowerOff,
} from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import HeaderLogout from '@/components/Layout/Dashboard/Header/HeaderLogout'
import { authOptions } from '@/app/api/auth/option'
import { getServerSession } from 'next-auth'
import { getDictionary } from '@/locales/dictionary'

type ItemWithIconProps = {
  icon: IconDefinition;
} & PropsWithChildren

const ItemWithIcon = (props: ItemWithIconProps) => {
  const { icon, children } = props

  return (
    <>
      <FontAwesomeIcon className="me-2" icon={icon} fixedWidth />
      {children}
    </>
  )
}

export default async function HeaderProfileNav() {
  const session = await getServerSession(authOptions)
  const dict = await getDictionary()

  return (
    <Nav>
      <Dropdown as={NavItem}>
        <DropdownToggle variant="link" bsPrefix="hide-caret" className="py-0 px-2 rounded-0" id="dropdown-profile">
          <div className="avatar position-relative">
            {session && (
              <Image
                fill
                sizes="32px"
                className="rounded-circle"
                src={session.user.avatar}
                alt={session.user.email}
              />
            )}
          </div>
        </DropdownToggle>
        <DropdownMenu className="pt-0">
          <DropdownHeader className="fw-bold rounded-top">{dict.profile.account.title}</DropdownHeader>
          <Link href="#" passHref legacyBehavior>
            <DropdownItem>
              <ItemWithIcon icon={faBell}>
                {dict.profile.account.items.updates}
                <Badge bg="info" className="ms-2">42</Badge>
              </ItemWithIcon>
            </DropdownItem>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <DropdownItem>
              <ItemWithIcon icon={faEnvelopeOpen}>
                {dict.profile.account.items.messages}
                <Badge bg="success" className="ms-2">42</Badge>
              </ItemWithIcon>
            </DropdownItem>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <DropdownItem>
              <ItemWithIcon icon={faListCheck}>
                {dict.profile.account.items.tasks}
                <Badge bg="danger" className="ms-2">42</Badge>
              </ItemWithIcon>
            </DropdownItem>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <DropdownItem>
              <ItemWithIcon icon={faMessage}>
                {dict.profile.account.items.comments}
                <Badge bg="warning" className="ms-2">42</Badge>
              </ItemWithIcon>
            </DropdownItem>
          </Link>

          <DropdownHeader className="fw-bold">{dict.profile.settings.title}</DropdownHeader>

          <Link href="#" passHref legacyBehavior>
            <DropdownItem>
              <ItemWithIcon icon={faUser}>{dict.profile.settings.items.profile}</ItemWithIcon>
            </DropdownItem>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <DropdownItem>
              <ItemWithIcon icon={faGear}>{dict.profile.settings.items.settings}</ItemWithIcon>
            </DropdownItem>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <DropdownItem>
              <ItemWithIcon icon={faCreditCard}>
                {dict.profile.settings.items.payments}
              </ItemWithIcon>
            </DropdownItem>
          </Link>
          <Link href="#" passHref legacyBehavior>
            <DropdownItem>
              <ItemWithIcon icon={faFile}>{dict.profile.settings.items.profile}</ItemWithIcon>
            </DropdownItem>
          </Link>

          <DropdownDivider />

          <Link href="#" passHref legacyBehavior>
            <DropdownItem>
              <ItemWithIcon icon={faLock}>{dict.profile.lock_account}</ItemWithIcon>
            </DropdownItem>
          </Link>
          <HeaderLogout>
            <DropdownItem>
              <ItemWithIcon icon={faPowerOff}>{dict.profile.logout}</ItemWithIcon>
            </DropdownItem>
          </HeaderLogout>
        </DropdownMenu>
      </Dropdown>
    </Nav>
  )
}
```

#### components/Layout/Dashboard/Header/HeaderSidebarToggler.tsx
*Language: TypeScript | Size: 680 bytes*

```typescript
'use client'

import { useSidebar } from '@/components/Layout/Dashboard/SidebarProvider'
import { Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

export default function HeaderSidebarToggler() {
  const {
    showSidebarState: [isShowSidebar, setIsShowSidebar],
  } = useSidebar()

  const toggleSidebar = () => {
    setIsShowSidebar(!isShowSidebar)
  }

  return (
    <Button
      variant="link"
      className="header-toggler rounded-0 shadow-none"
      type="button"
      onClick={toggleSidebar}
    >
      <FontAwesomeIcon icon={faBars} />
    </Button>
  )
}
```

#### components/Layout/Dashboard/Header/HeaderTheme.tsx
*Language: TypeScript | Size: 2979 bytes*

```typescript
'use client'

import Cookies from 'js-cookie'
import React, { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle, NavLink,
} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleHalfStroke, faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import { Theme } from '@/themes/enum'
import useDictionary from '@/locales/dictionary-hook'
import { useMediaQuery } from 'react-responsive'

const CurrentTheme = ({ theme }: { theme: string }) => (
  <>
    {theme === Theme.Light && <FontAwesomeIcon icon={faSun} size="lg" />}
    {theme === Theme.Dark && <FontAwesomeIcon icon={faMoon} size="lg" />}
    {theme === Theme.Auto && <FontAwesomeIcon icon={faCircleHalfStroke} size="lg" />}
  </>
)

export default function HeaderTheme({ currentPreferredTheme }: { currentPreferredTheme: Theme }) {
  const dict = useDictionary()
  const [preferredTheme, setPreferredTheme] = useState<Theme>(currentPreferredTheme)
  const router = useRouter()

  const changePreferredTheme = useCallback((t: Theme) => {
    setPreferredTheme(t)
    Cookies.set('preferred_theme', t)

    if (t === Theme.Auto) {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        Cookies.set('theme', Theme.Dark)
        router.refresh()
        return
      }

      Cookies.set('theme', Theme.Light)
      router.refresh()
      return
    }

    Cookies.set('theme', t)
    router.refresh()
  }, [router])

  const isDarkMode = useMediaQuery(
    {
      query: '(prefers-color-scheme: dark)',
    },
  )

  useEffect(() => {
    if (preferredTheme !== Theme.Auto) {
      return
    }

    Cookies.set('theme', isDarkMode ? Theme.Dark : Theme.Light)
    router.refresh()
  }, [isDarkMode, preferredTheme, router])

  return (
    <Dropdown>
      <DropdownToggle className="px-2 mx-1 px-sm-3 mx-sm-0" as={NavLink} bsPrefix="hide-caret" id="dropdown-theme">
        <CurrentTheme theme={preferredTheme} />
      </DropdownToggle>
      <DropdownMenu className="pt-0" align="end">
        <DropdownItem
          active={preferredTheme === Theme.Light}
          onClick={() => changePreferredTheme(Theme.Light)}
        >
          <FontAwesomeIcon className="me-2" icon={faSun} fixedWidth />
          {dict.theme.light}
        </DropdownItem>
        <DropdownItem
          active={preferredTheme === Theme.Dark}
          onClick={() => changePreferredTheme(Theme.Dark)}
        >
          <FontAwesomeIcon className="me-2" icon={faMoon} fixedWidth />
          {dict.theme.dark}
        </DropdownItem>
        <DropdownItem
          active={preferredTheme === Theme.Auto}
          onClick={() => changePreferredTheme(Theme.Auto)}
        >
          <FontAwesomeIcon className="me-2" icon={faCircleHalfStroke} fixedWidth />
          {dict.theme.auto}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
```

### components/Layout/Dashboard/Sidebar/

#### components/Layout/Dashboard/Sidebar/Sidebar.tsx
*Language: TypeScript | Size: 2129 bytes*

```typescript
'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'
import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { Button } from 'react-bootstrap'
import { useSidebar } from '@/components/Layout/Dashboard/SidebarProvider'

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [isNarrow, setIsNarrow] = useState(false)

  const { showSidebarState: [isShowSidebar] } = useSidebar()

  const toggleIsNarrow = () => {
    const newValue = !isNarrow
    localStorage.setItem('isNarrow', newValue ? 'true' : 'false')
    setIsNarrow(newValue)
  }

  // On first time load only
  useEffect(() => {
    if (localStorage.getItem('isNarrow')) {
      setIsNarrow(localStorage.getItem('isNarrow') === 'true')
    }
  }, [setIsNarrow])

  return (
    <div
      className={classNames('sidebar d-flex flex-column position-fixed h-100 border-end', {
        'sidebar-narrow': isNarrow,
        show: isShowSidebar,
      })}
      id="sidebar"
    >
      <div className="sidebar-brand d-none d-md-flex align-items-center justify-content-center">
        <svg
          className="sidebar-brand-full"
          width="118"
          height="46"
        >
          <title>CoreUI Logo</title>
          <use xlinkHref="/assets/brand/coreui.svg#full" />
        </svg>
        <svg
          className="sidebar-brand-narrow d-none"
          width="46"
          height="46"
        >
          <title>CoreUI Logo</title>
          <use xlinkHref="/assets/brand/coreui.svg#signet" />
        </svg>
      </div>

      <div className="sidebar-nav flex-fill border-top">
        {children}
      </div>

      <Button
        variant="link"
        className="sidebar-toggler d-none d-md-inline-block rounded-0 text-end pe-4 fw-bold shadow-none border-top"
        onClick={toggleIsNarrow}
        type="button"
        aria-label="sidebar toggler"
      >
        <FontAwesomeIcon className="sidebar-toggler-chevron" icon={faAngleLeft} fontSize={24} />
      </Button>
    </div>
  )
}
```

#### components/Layout/Dashboard/Sidebar/SidebarNav.tsx
*Language: TypeScript | Size: 3947 bytes*

```typescript
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
```

#### components/Layout/Dashboard/Sidebar/SidebarNavGroup.tsx
*Language: TypeScript | Size: 2268 bytes*

```typescript
'use client'

import { IconDefinition } from '@fortawesome/free-regular-svg-icons'
import React, {
  PropsWithChildren, useContext, useEffect, useState,
} from 'react'
import {
  Accordion, AccordionContext, Button, useAccordionButton,
} from 'react-bootstrap'
import classNames from 'classnames'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'

type SidebarNavGroupToggleProps = {
  eventKey: string;
  icon: IconDefinition;
  setIsShow: (isShow: boolean) => void;
} & PropsWithChildren

const SidebarNavGroupToggle = (props: SidebarNavGroupToggleProps) => {
  // https://react-bootstrap.github.io/components/accordion/#custom-toggle-with-expansion-awareness
  const { activeEventKey } = useContext(AccordionContext)
  const {
    eventKey, icon, children, setIsShow,
  } = props

  const decoratedOnClick = useAccordionButton(eventKey)

  const isCurrentEventKey = activeEventKey === eventKey

  useEffect(() => {
    setIsShow(activeEventKey === eventKey)
  }, [activeEventKey, eventKey, setIsShow])

  return (
    <Button
      variant="link"
      type="button"
      className={classNames('rounded-0 nav-link px-3 py-2 d-flex align-items-center flex-fill w-100 shadow-none', {
        collapsed: !isCurrentEventKey,
      })}
      onClick={decoratedOnClick}
    >
      <FontAwesomeIcon className="nav-icon ms-n3" icon={icon} />
      {children}
      <div className="nav-chevron ms-auto text-end">
        <FontAwesomeIcon size="xs" icon={faChevronUp} />
      </div>
    </Button>
  )
}

type SidebarNavGroupProps = {
  toggleIcon: IconDefinition;
  toggleText: string;
} & PropsWithChildren

export default function SidebarNavGroup(props: SidebarNavGroupProps) {
  const {
    toggleIcon,
    toggleText,
    children,
  } = props

  const [isShow, setIsShow] = useState(false)

  return (
    <Accordion as="li" bsPrefix="nav-group" className={classNames({ show: isShow })}>
      <SidebarNavGroupToggle icon={toggleIcon} eventKey="0" setIsShow={setIsShow}>{toggleText}</SidebarNavGroupToggle>
      <Accordion.Collapse eventKey="0">
        <ul className="nav-group-items list-unstyled">
          {children}
        </ul>
      </Accordion.Collapse>
    </Accordion>
  )
}
```

#### components/Layout/Dashboard/Sidebar/SidebarNavItem.tsx
*Language: TypeScript | Size: 1001 bytes*

```typescript
'use client'

import { IconDefinition } from '@fortawesome/free-regular-svg-icons'
import React, { PropsWithChildren } from 'react'
import { useSidebar } from '@/components/Layout/Dashboard/SidebarProvider'
import { NavItem, NavLink } from 'react-bootstrap'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
  href: string;
  icon?: IconDefinition;
} & PropsWithChildren

export default function SidebarNavItem(props: Props) {
  const {
    icon,
    children,
    href,
  } = props

  const {
    showSidebarState: [, setIsShowSidebar],
  } = useSidebar()

  return (
    <NavItem>
      <Link href={href} passHref legacyBehavior>
        <NavLink className="px-3 py-2 d-flex align-items-center" onClick={() => setIsShowSidebar(false)}>
          {icon ? <FontAwesomeIcon className="nav-icon ms-n3" icon={icon} />
            : <span className="nav-icon ms-n3" />}
          {children}
        </NavLink>
      </Link>
    </NavItem>
  )
}
```

#### components/Layout/Dashboard/Sidebar/SidebarOverlay.tsx
*Language: TypeScript | Size: 589 bytes*

```typescript
'use client'

import React from 'react'
import { useSidebar } from '@/components/Layout/Dashboard/SidebarProvider'
import classNames from 'classnames'

export default function SidebarOverlay() {
  const {
    showSidebarState: [isShowSidebar, setIsShowSidebar],
  } = useSidebar()

  const hideSidebar = () => {
    setIsShowSidebar(false)
  }

  return (
    <div
      tabIndex={-1}
      aria-hidden
      className={classNames('sidebar-overlay position-fixed top-0 bg-dark w-100 h-100 opacity-50', {
        'd-none': !isShowSidebar,
      })}
      onClick={hideSidebar}
    />
  )
}
```

### components/Page/Dashboard/

#### components/Page/Dashboard/ConversionChart.tsx
*Language: TypeScript | Size: 1254 bytes*

```typescript
'use client'

import { Line } from 'react-chartjs-2'
import React from 'react'
import {
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler)

export default function ConversionChart() {
  return (
    <Line
      options={{
        plugins: {
          legend: {
            display: false,
          },
        },
        maintainAspectRatio: false,
        scales: {
          x: {
            display: false,
          },
          y: {
            display: false,
          },
        },
        elements: {
          line: {
            borderWidth: 2,
            tension: 0.4,
          },
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
          },
        },
      }}
      data={{
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'My First dataset',
          backgroundColor: 'rgba(255,255,255,.2)',
          borderColor: 'rgba(255,255,255,.55)',
          data: [78, 81, 80, 45, 34, 12, 40],
          fill: true,
        }],
      }}
    />
  )
}
```

#### components/Page/Dashboard/IncomeChart.tsx
*Language: TypeScript | Size: 1533 bytes*

```typescript
'use client'

import { Line } from 'react-chartjs-2'
import React from 'react'
import {
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler)

export default function IncomeChart() {
  return (
    <Line
      options={{
        plugins: {
          legend: {
            display: false,
          },
        },
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
            border: {
              display: true,
            },
          },
          y: {
            min: -9,
            max: 39,
            display: false,
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        },
        elements: {
          line: {
            borderWidth: 1,
          },
          point: {
            radius: 4,
            hitRadius: 10,
            hoverRadius: 4,
          },
        },
      }}
      data={{
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'My First dataset',
          backgroundColor: 'transparent',
          borderColor: 'rgba(255,255,255,.55)',
          data: [1, 18, 9, 17, 34, 22, 11],
        }],
      }}
    />
  )
}
```

#### components/Page/Dashboard/SessionChart.tsx
*Language: TypeScript | Size: 1502 bytes*

```typescript
'use client'

import { Bar } from 'react-chartjs-2'
import React from 'react'
import {
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler)

export default function SessionChart() {
  return (
    <Bar
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
              drawTicks: false,
            },
            ticks: {
              display: false,
            },
          },
          y: {
            grid: {
              display: false,
              drawTicks: false,
            },
            ticks: {
              display: false,
            },
            border: {
              display: true,
            },
          },
        },
      }}
      data={{
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'January', 'February', 'March', 'April'],
        datasets: [{
          label: 'My First dataset',
          backgroundColor: 'rgba(255,255,255,.2)',
          borderColor: 'rgba(255,255,255,.55)',
          data: [78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84, 67, 82],
          barPercentage: 0.6,
        }],
      }}
    />
  )
}
```

#### components/Page/Dashboard/TrafficChart.tsx
*Language: TypeScript | Size: 3255 bytes*

```typescript
'use client'

import { Line } from 'react-chartjs-2'
import React from 'react'
import {
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import useDictionary from '@/locales/dictionary-hook'
import useComputedStyle from '@/hooks/use-computed-style'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler)

const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

export default function TrafficChart() {
  const dict = useDictionary()
  const borderColor = useComputedStyle('--bs-border-color')
  const bodyColor = useComputedStyle('--bs-body-color')

  return (
    <Line
      data={{
        labels: [
          dict.dashboard.traffic.chart.xlabel1,
          dict.dashboard.traffic.chart.xlabel2,
          dict.dashboard.traffic.chart.xlabel3,
          dict.dashboard.traffic.chart.xlabel4,
          dict.dashboard.traffic.chart.xlabel5,
          dict.dashboard.traffic.chart.xlabel6,
          dict.dashboard.traffic.chart.xlabel7,
        ],
        datasets: [{
          label: 'My First dataset',
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderColor: 'rgba(13, 202, 240, 1)',
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          data: [
            random(50, 200),
            random(50, 200),
            random(50, 200),
            random(50, 200),
            random(50, 200),
            random(50, 200),
            random(50, 200),
          ],
          fill: true,
        }, {
          label: 'My Second dataset',
          borderColor: 'rgba(25, 135, 84, 1)',
          pointHoverBackgroundColor: '#fff',
          borderWidth: 2,
          data: [
            random(50, 200),
            random(50, 200),
            random(50, 200),
            random(50, 200),
            random(50, 200),
            random(50, 200),
            random(50, 200),
          ],
        }, {
          label: 'My Third dataset',
          borderColor: 'rgba(220, 53, 69, 1)',
          pointHoverBackgroundColor: '#fff',
          borderWidth: 1,
          borderDash: [8, 5],
          data: [65, 65, 65, 65, 65, 65, 65],
        }],
      }}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          x: {
            grid: {
              color: borderColor,
              drawOnChartArea: false,
            },
            ticks: {
              color: bodyColor,
            },
          },
          y: {
            beginAtZero: true,
            border: {
              color: borderColor,
            },
            grid: {
              color: borderColor,
            },
            max: 250,
            ticks: {
              color: bodyColor,
              maxTicksLimit: 5,
              stepSize: Math.ceil(250 / 5),
            },
          },
        },
        elements: {
          line: {
            tension: 0.4,
          },
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3,
          },
        },
      }}
    />
  )
}
```

#### components/Page/Dashboard/UserChart.tsx
*Language: TypeScript | Size: 1559 bytes*

```typescript
'use client'

import { Line } from 'react-chartjs-2'
import React from 'react'
import {
  BarElement,
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler)

export default function UserChart() {
  return (
    <Line
      options={{
        plugins: {
          legend: {
            display: false,
          },
        },
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
            border: {
              display: true,
            },
          },
          y: {
            min: 30,
            max: 89,
            display: false,
            grid: {
              display: false,
            },
            ticks: {
              display: false,
            },
          },
        },
        elements: {
          line: {
            borderWidth: 1,
            tension: 0.4,
          },
          point: {
            radius: 4,
            hitRadius: 10,
            hoverRadius: 4,
          },
        },
      }}
      data={{
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'My First dataset',
          backgroundColor: 'transparent',
          borderColor: 'rgba(255,255,255,.55)',
          data: [65, 59, 84, 84, 51, 55, 40],
        }],
      }}
    />
  )
}
```

### components/Page/Dish/

#### components/Page/Dish/DishForm.tsx
*Language: TypeScript | Size: 5229 bytes*

```typescript
'use client'

import React, { useState } from 'react'
import { Form, Button, FormGroup, FormLabel, FormControl, Alert } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { dishApi } from '@/services'
import { Dish, CreateDishInput, UpdateDishInput } from '@/models/dish'
import useDictionary from '@/locales/dictionary-hook'
import { boolean } from 'zod'

interface DishFormProps {
  dish?: Dish
  isEdit?: boolean
}

export default function DishForm({ dish, isEdit = false }: DishFormProps) {
  const router = useRouter()
  const dict = useDictionary()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    dishId: dish?.dishId || '',
    dishName: dish?.dishName || '',
    cookingMethod: dish?.cookingMethod || '',
    group: dish?.group || '',
    description: dish?.description || '',
    active: dish?.active || true,
  })

  const handleChangeActive = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target
      setFormData(prev => ({
        ...prev,
        [name]: name === 'active' ? value === 'true' : value
      }))
    }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isEdit && dish) {
        const updateData: UpdateDishInput = {
          dishName: formData.dishName,
          cookingMethod: formData.cookingMethod,
          group: formData.group,
          description: formData.description,
          active: formData.active,
        }
        await dishApi.update(dish.dishId, updateData)
        setSuccess('Dish updated successfully')
      } else {
        const createData: CreateDishInput = {
          dishId: formData.dishId,
          dishName: formData.dishName,
          cookingMethod: formData.cookingMethod,
          group: formData.group,
          description: formData.description,
          active: formData.active,
        }
        await dishApi.create(createData)
        setSuccess('Dish created successfully')
      }

      setTimeout(() => {
        router.push('/dishs')
      }, 1500)
    } catch (err) {
      setError(isEdit ? 'Failed to update dish' : 'Failed to create dish')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-3">
          <FormLabel>Dish ID</FormLabel>
          <FormControl
            type="text"
            name="dishId"
            value={formData.dishId}
            onChange={handleChange}
            disabled={isEdit}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>Dish Name</FormLabel>
          <FormControl
            type="text"
            name="dishName"
            value={formData.dishName}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>Property</FormLabel>
          <FormControl
            type="text"
            name="cookingMethod"
            value={formData.cookingMethod}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>Material Group</FormLabel>
          <FormControl
            type="text"
            name="group"
            value={formData.group}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>Unit</FormLabel>
          <FormControl
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </FormGroup>
        <FormGroup className="mb-3">
          <FormLabel>{dict.kitchens?.status || 'Status'}</FormLabel>
          <Form.Select
            name="active"
            value={formData.active ? 'true' : 'false'}
            onChange={handleChangeActive}
          >
            <option value="true">{dict.common?.active || 'Active'}</option>
            <option value="false">{dict.common?.inactive || 'Inactive'}</option>
          </Form.Select>
        </FormGroup>
        <Button
          type="submit"
          variant="success"
          disabled={loading}
          className="me-3"
        >
          {loading ? dict.action.submitting : dict.action.submit}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/dishs')}
        >
          Cancel
        </Button>
      </Form>
    </>
  )
}
```

#### components/Page/Dish/DishesList.tsx
*Language: TypeScript | Size: 4689 bytes*

```typescript
'use client'

import React, { useEffect, useState } from 'react'
import { Button, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Alert, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { dishApi } from '@/services'
import { Dish } from '@/models'
import useDictionary from '@/locales/dictionary-hook'

export default function DishesList() {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  useEffect(() => {
    loadDishes()
  }, [])

  const loadDishes = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await dishApi.getAll()
      setDishes(data)
    } catch (err) {
      setError(dict.dishes?.error_load || 'Failed to load dishes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(dict.dishes?.confirm_delete || 'Are you sure you want to delete this dish?')) {
      return
    }

    try {
      await dishApi.delete(id)
      await loadDishes()
    } catch (err) {
      setError(dict.dishes?.error_delete || 'Failed to delete dish')
      console.error(err)
    }
  }

  if (loading) {
    return <div>{dict.dishes?.loading || 'Loading...'}</div>
  }

  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div className="mb-3 text-end">
        <Button variant="success" onClick={() => router.push('/dishes/create')}>
          <FontAwesomeIcon icon={faPlus} fixedWidth />
          {' '}{dict.dishes?.add_new || 'Add New Dish'}
        </Button>
      </div>

      <Table responsive bordered hover>
        <thead>
          <tr className="table-light dark:table-dark">
            <th>{dict.dishes?.id || 'ID'}</th>
            <th>{dict.dishes?.name || 'Dish Name'}</th>
            <th>{dict.dishes?.cooking_method || 'Cooking Method'}</th>
            <th>{dict.dishes?.group || 'Group'}</th>
            <th>{dict.dishes?.description || 'Description'}</th>
            <th>{dict.dishes?.status || 'Status'}</th>
            <th aria-label="Action" />
          </tr>
        </thead>
        <tbody>
          {dishes.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center">
                {dict.dishes?.no_data || 'No dishes found'}
              </td>
            </tr>
          ) : (
            dishes.map((dish) => (
              <tr key={dish.dishId}>
                <td>{dish.dishId}</td>
                <td>{dish.dishName}</td>
                <td>{dish.cookingMethod || '-'}</td>
                <td>{dish.group || '-'}</td>
                <td className="text-truncate" style={{ maxWidth: '200px' }}>
                  {dish.description || '-'}
                </td>
                <td>
                  <Badge bg={dish.active ? 'success' : 'secondary'}>
                    {dish.active ? (dict.common?.active || 'Active') : (dict.common?.inactive || 'Inactive')}
                  </Badge>
                </td>
                <td>
                  <Dropdown align="end">
                    <DropdownToggle
                      as="button"
                      bsPrefix="btn"
                      className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                      id={`action-${dish.dishId}`}
                    >
                      <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                    </DropdownToggle>

                    <DropdownMenu>
                      <DropdownItem onClick={() => router.push(`/dishes/${dish.dishId}/edit`)}>
                        {dict.action.edit}
                      </DropdownItem>
                      <DropdownItem onClick={() => router.push(`/recipe-standards/dish/${dish.dishId}`)}>
                        {dict.dishes?.view_recipe || 'View Recipe'}
                      </DropdownItem>
                      <DropdownItem
                        className="text-danger"
                        onClick={() => handleDelete(dish.dishId)}
                      >
                        {dict.action.delete}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  )
}
```

### components/Page/Ingredient/

#### components/Page/Ingredient/IngredientForm.tsx
*Language: TypeScript | Size: 4749 bytes*

```typescript
'use client'

import React, { useState } from 'react'
import { Form, Button, FormGroup, FormLabel, FormControl, Alert } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { ingredientApi } from '@/services'
import { Ingredient, CreateIngredientInput, UpdateIngredientInput } from '@/models/ingredient'
import useDictionary from '@/locales/dictionary-hook'

interface IngredientFormProps {
  ingredient?: Ingredient
  isEdit?: boolean
}

export default function IngredientForm({ ingredient, isEdit = false }: IngredientFormProps) {
  const router = useRouter()
  const dict = useDictionary()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    ingredientId: ingredient?.ingredientId || '',
    ingredientName: ingredient?.ingredientName || '',
    property: ingredient?.property || '',
    materialGroup: ingredient?.materialGroup || '',
    unit: ingredient?.unit || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isEdit && ingredient) {
        const updateData: UpdateIngredientInput = {
          ingredientName: formData.ingredientName,
          property: formData.property,
          materialGroup: formData.materialGroup,
          unit: formData.unit,
        }
        await ingredientApi.update(ingredient.ingredientId, updateData)
        setSuccess('Ingredient updated successfully')
      } else {
        const createData: CreateIngredientInput = {
          ingredientId: formData.ingredientId,
          ingredientName: formData.ingredientName,
          property: formData.property,
          materialGroup: formData.materialGroup,
          unit: formData.unit,
        }
        await ingredientApi.create(createData)
        setSuccess('Ingredient created successfully')
      }

      setTimeout(() => {
        router.push('/ingredients')
      }, 1500)
    } catch (err) {
      setError(isEdit ? 'Failed to update ingredient' : 'Failed to create ingredient')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-3">
          <FormLabel>{dict.ingredients?.id || 'ID'}</FormLabel>
          <FormControl
            type="text"
            name="ingredientId"
            value={formData.ingredientId}
            onChange={handleChange}
            disabled={isEdit}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.ingredients?.name || 'Name'}</FormLabel>
          <FormControl
            type="text"
            name="ingredientName"
            value={formData.ingredientName}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.ingredients?.property || 'Property'}</FormLabel>
          <FormControl
            type="text"
            name="property"
            value={formData.property}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.ingredients?.material_group || 'Material Group'}</FormLabel>
          <FormControl
            type="text"
            name="materialGroup"
            value={formData.materialGroup}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.ingredients?.unit || 'Unit'}</FormLabel>
          <FormControl
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <Button
          type="submit"
          variant="success"
          disabled={loading}
          className="me-3"
        >
          {loading ? dict.action.submitting : dict.action.submit}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/ingredients')}
        >
          Cancel
        </Button>
      </Form>
    </>
  )
}
```

#### components/Page/Ingredient/IngredientList.tsx
*Language: TypeScript | Size: 4482 bytes*

```typescript
'use client'

import React, { useEffect, useState } from 'react'
import { Button, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { ingredientApi } from '@/services/ingredient-api'
import { Ingredient } from '@/models/ingredient'
import useDictionary from '@/locales/dictionary-hook'

export default function IngredientsList() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  useEffect(() => {
    loadIngredients()
  }, [])

  const loadIngredients = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await ingredientApi.getAll()
      setIngredients(data)
    } catch (err) {
      setError(dict.ingredients?.error_load || 'Failed to load ingredients')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(dict.ingredients?.confirm_delete || 'Are you sure you want to delete this ingredient?')) {
      return
    }

    try {
      await ingredientApi.delete(id)
      await loadIngredients()
    } catch (err) {
      setError(dict.ingredients?.error_delete || 'Failed to delete ingredient')
      console.error(err)
    }
  }

  if (loading) {
    return <div>{dict.ingredients?.loading || 'Loading...'}</div>
  }

  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div className="mb-3 text-end">
        <Button variant="success" onClick={() => router.push('/ingredients/create')}>
          <FontAwesomeIcon icon={faPlus} fixedWidth />
          {' '}{dict.ingredients?.add_new || 'Add New'}
        </Button>
      </div>

      <Table responsive bordered hover>
        <thead>
          <tr className="table-light dark:table-dark">
            <th>{dict.ingredients?.id || 'ID'}</th>
            <th>{dict.ingredients?.name || 'Name'}</th>
            <th>{dict.ingredients?.property || 'Property'}</th>
            <th>{dict.ingredients?.material_group || 'Material Group'}</th>
            <th>{dict.ingredients?.unit || 'Unit'}</th>
            <th>{dict.ingredients?.created_date || 'Created Date'}</th>
            <th aria-label="Action" />
          </tr>
        </thead>
        <tbody>
          {ingredients.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center">
                {dict.ingredients?.no_data || 'No ingredients found'}
              </td>
            </tr>
          ) : (
            ingredients.map((ingredient) => (
              <tr key={ingredient.ingredientId}>
                <td>{ingredient.ingredientId}</td>
                <td>{ingredient.ingredientName}</td>
                <td>{ingredient.property || '-'}</td>
                <td>{ingredient.materialGroup || '-'}</td>
                <td>{ingredient.unit}</td>
                <td>{new Date(ingredient.createdDate).toLocaleDateString()}</td>
                <td>
                  <Dropdown align="end">
                    <DropdownToggle
                      as="button"
                      bsPrefix="btn"
                      className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                      id={`action-${ingredient.ingredientId}`}
                    >
                      <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                    </DropdownToggle>

                    <DropdownMenu>
                      <DropdownItem onClick={() => router.push(`/ingredients/${ingredient.ingredientId}/edit`)}>
                        {dict.action.edit}
                      </DropdownItem>
                      <DropdownItem
                        className="text-danger"
                        onClick={() => handleDelete(ingredient.ingredientId)}
                      >
                        {dict.action.delete}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  )
}
```

### components/Page/Kitchen/

#### components/Page/Kitchen/KitchenForm.tsx
*Language: TypeScript | Size: 5142 bytes*

```typescript
'use client'

import React, { useState } from 'react'
import { Form, Button, FormGroup, FormLabel, FormControl, Alert } from 'react-bootstrap'
import { useRouter } from 'next/navigation'
import { kitchenApi } from '@/services'
import { Kitchen, CreateKitchenInput, UpdateKitchenInput } from '@/models/kitchen'
import useDictionary from '@/locales/dictionary-hook'

interface KitchenFormProps {
  kitchen?: Kitchen
  isEdit?: boolean
}

export default function KitchenForm({ kitchen, isEdit = false }: KitchenFormProps) {
  const router = useRouter()
  const dict = useDictionary()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    kitchenId: kitchen?.kitchenId || '',
    kitchenName: kitchen?.kitchenName || '',
    address: kitchen?.address || '',
    phone: kitchen?.phone || '',
    active: kitchen?.active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      if (isEdit && kitchen) {
        const updateData: UpdateKitchenInput = {
          kitchenName: formData.kitchenName,
          address: formData.address,
          phone: formData.phone,
          active: formData.active,
        }
        await kitchenApi.update(kitchen.kitchenId, updateData)
        setSuccess(dict.kitchens?.success_update || 'Kitchen updated successfully')
      } else {
        const createData: CreateKitchenInput = {
          kitchenId: formData.kitchenId,
          kitchenName: formData.kitchenName,
          address: formData.address,
          phone: formData.phone,
          active: formData.active,
        }
        await kitchenApi.create(createData)
        setSuccess(dict.kitchens?.success_create || 'Kitchen created successfully')
      }

      setTimeout(() => {
        router.push('/kitchens')
      }, 1500)
    } catch (err) {
      setError(isEdit ? 
        (dict.kitchens?.error_update || 'Failed to update kitchen') : 
        (dict.kitchens?.error_create || 'Failed to create kitchen')
      )
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChangeActive = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'active' ? value === 'true' : value
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup className="mb-3">
          <FormLabel>{dict.kitchens?.id || 'Kitchen ID'}</FormLabel>
          <FormControl
            type="text"
            name="kitchenId"
            value={formData.kitchenId}
            onChange={handleChange}
            disabled={isEdit}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.kitchens?.name || 'Kitchen Name'}</FormLabel>
          <FormControl
            type="text"
            name="kitchenName"
            value={formData.kitchenName}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.kitchens?.address || 'Address'}</FormLabel>
          <FormControl
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.kitchens?.phone || 'Phone'}</FormLabel>
          <FormControl
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </FormGroup>

        <FormGroup className="mb-3">
          <FormLabel>{dict.kitchens?.status || 'Status'}</FormLabel>
          <Form.Select
            name="active"
            value={formData.active ? 'true' : 'false'}
            onChange={handleChangeActive}
          >
            <option value="true">{dict.common?.active || 'Active'}</option>
            <option value="false">{dict.common?.inactive || 'Inactive'}</option>
          </Form.Select>
        </FormGroup>

        <Button
          type="submit"
          variant="success"
          disabled={loading}
          className="me-3"
        >
          {loading ? dict.action.submitting : dict.action.submit}
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push('/kitchens')}
        >
          {dict.common?.cancel || 'Cancel'}
        </Button>
      </Form>
    </>
  )
}
```

#### components/Page/Kitchen/KitchensList.tsx
*Language: TypeScript | Size: 4525 bytes*

```typescript
'use client'

import React, { useEffect, useState } from 'react'
import { Button, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Alert, Badge } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { kitchenApi } from '@/services'
import { Kitchen } from '@/models'
import useDictionary from '@/locales/dictionary-hook'

export default function KitchensList() {
  const [kitchens, setKitchens] = useState<Kitchen[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  useEffect(() => {
    loadKitchens()
  }, [])

  const loadKitchens = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await kitchenApi.getAll()
      setKitchens(data)
    } catch (err) {
      setError(dict.kitchens?.error_load || 'Failed to load kitchens')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm(dict.kitchens?.confirm_delete || 'Are you sure you want to delete this kitchen?')) {
      return
    }

    try {
      await kitchenApi.delete(id)
      await loadKitchens()
    } catch (err) {
      setError(dict.kitchens?.error_delete || 'Failed to delete kitchen')
      console.error(err)
    }
  }

  if (loading) {
    return <div>{dict.kitchens?.loading || 'Loading...'}</div>
  }

  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div className="mb-3 text-end">
        <Button variant="success" onClick={() => router.push('/kitchens/create')}>
          <FontAwesomeIcon icon={faPlus} fixedWidth />
          {' '}{dict.kitchens?.add_new || 'Add New Kitchen'}
        </Button>
      </div>

      <Table responsive bordered hover>
        <thead>
          <tr className="table-light dark:table-dark">
            <th>{dict.kitchens?.id || 'ID'}</th>
            <th>{dict.kitchens?.name || 'Kitchen Name'}</th>
            <th>{dict.kitchens?.address || 'Address'}</th>
            <th>{dict.kitchens?.phone || 'Phone'}</th>
            <th>{dict.kitchens?.status || 'Status'}</th>
            <th>{dict.ingredients?.created_date || 'Created Date'}</th>
            <th aria-label="Action" />
          </tr>
        </thead>
        <tbody>
          {kitchens.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center">
                {dict.kitchens?.no_data || 'No kitchens found'}
              </td>
            </tr>
          ) : (
            kitchens.map((kitchen) => (
              <tr key={kitchen.kitchenId}>
                <td>{kitchen.kitchenId}</td>
                <td>{kitchen.kitchenName}</td>
                <td>{kitchen.address || '-'}</td>
                <td>{kitchen.phone || '-'}</td>
                <td>
                  <Badge bg={kitchen.active ? 'success' : 'secondary'}>
                    {kitchen.active ? (dict.common?.active || 'Active') : (dict.common?.inactive || 'Inactive')}
                  </Badge>
                </td>
                <td>{new Date(kitchen.createdDate).toLocaleDateString()}</td>
                <td>
                  <Dropdown align="end">
                    <DropdownToggle
                      as="button"
                      bsPrefix="btn"
                      className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                      id={`action-${kitchen.kitchenId}`}
                    >
                      <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                    </DropdownToggle>

                    <DropdownMenu>
                      <DropdownItem onClick={() => router.push(`/kitchens/${kitchen.kitchenId}/edit`)}>
                        {dict.action.edit}
                      </DropdownItem>
                      <DropdownItem
                        className="text-danger"
                        onClick={() => handleDelete(kitchen.kitchenId)}
                      >
                        {dict.action.delete}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  )
}
```

### components/Page/RecipeStandard/

#### components/Page/RecipeStandard/RecipeStandardsList.tsx
*Language: TypeScript | Size: 4549 bytes*

```typescript
'use client'

import React, { useEffect, useState } from 'react'
import { Button, Table, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Alert } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons'
import { useRouter } from 'next/navigation'
import { recipeStandardApi } from '@/services/'
import { RecipeStandard } from '@/models/recipe_standard'
import useDictionary from '@/locales/dictionary-hook'

interface RecipeStandardsListProps {
  dishId?: string
}

export default function RecipeStandardsList({ dishId }: RecipeStandardsListProps) {
  const [standards, setStandards] = useState<RecipeStandard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const dict = useDictionary()

  useEffect(() => {
    loadStandards()
  }, [dishId])

  const loadStandards = async () => {
    try {
      setLoading(true)
      setError('')
      const data = dishId 
        ? await recipeStandardApi.getByDish(dishId)
        : await recipeStandardApi.getAll()
      setStandards(data)
    } catch (err) {
      setError('Failed to load recipe standards')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this recipe standard?')) {
      return
    }

    try {
      await recipeStandardApi.delete(id)
      await loadStandards()
    } catch (err) {
      setError('Failed to delete recipe standard')
      console.error(err)
    }
  }

  if (loading) {
    return <div>"Loading..."</div>
  }

  return (
    <>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <div className="mb-3 text-end">
        <Button variant="success" onClick={() => router.push('/recipe-standards/create')}>
          <FontAwesomeIcon icon={faPlus} fixedWidth />
          {' Add Recipe Standard'}
        </Button>
      </div>

      <Table responsive bordered hover>
        <thead>
          <tr className="table-light dark:table-dark">
            <th>ID</th>
            <th>Dish</th>
            <th>Ingredient</th>
            <th>Standard Per Serving</th>
            <th>Unit</th>
            <th>Amount</th>
            <th>Note</th>
            <th aria-label="Action" />
          </tr>
        </thead>
        <tbody>
          {standards.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center">
                No recipe standards found
              </td>
            </tr>
          ) : (
            standards.map((standard) => (
              <tr key={standard.standardId}>
                <td>{standard.standardId}</td>
                <td>{standard.dish?.dishName || standard.dishId}</td>
                <td>{standard.ingredient?.ingredientName || standard.ingredientId}</td>
                <td className="text-end">{standard.standardPer1}</td>
                <td>{standard.unit}</td>
                <td className="text-end">
                  {standard.amount?.toLocaleString('vi-VN')} VNĐ
                </td>
                <td className="text-truncate" style={{ maxWidth: '150px' }}>
                  {standard.note || '-'}
                </td>
                <td>
                  <Dropdown align="end">
                    <DropdownToggle
                      as="button"
                      bsPrefix="btn"
                      className="btn-link rounded-0 text-black-50 dark:text-gray-500 shadow-none p-0"
                      id={`action-${standard.standardId}`}
                    >
                      <FontAwesomeIcon fixedWidth icon={faEllipsisVertical} />
                    </DropdownToggle>

                    <DropdownMenu>
                      <DropdownItem onClick={() => router.push(`/recipe-standards/${standard.standardId}/edit`)}>
                        {dict.action.edit}
                      </DropdownItem>
                      <DropdownItem
                        className="text-danger"
                        onClick={() => handleDelete(standard.standardId)}
                      >
                        {dict.action.delete}
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </>
  )
}
```

### components/Pagination/

#### components/Pagination/Paginate.tsx
*Language: TypeScript | Size: 1566 bytes*

```typescript
'use client'

import ReactPaginate from 'react-paginate'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Props = {
  currentPage: number;
  lastPage: number;
}

export default function Paginate(props: Props) {
  const { currentPage, lastPage } = props
  const [pageIndex, setPageIndex] = useState(currentPage - 1)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    setPageIndex(currentPage - 1)
  }, [currentPage])

  return (
    <div className="col-auto ms-sm-auto mb-3 overflow-auto">
      <ReactPaginate
        forcePage={pageIndex}
        pageCount={lastPage}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        containerClassName="pagination mb-0"
        previousClassName="page-item"
        pageClassName="page-item"
        breakClassName="page-item"
        nextClassName="page-item"
        previousLinkClassName="page-link"
        pageLinkClassName="page-link"
        breakLinkClassName="page-link"
        nextLinkClassName="page-link"
        previousLabel="‹"
        nextLabel="›"
        activeClassName="active"
        disabledClassName="disabled"
        onPageChange={(selectedItem) => {
          const page = selectedItem.selected + 1

          const newSearchParams = new URLSearchParams(searchParams)
          newSearchParams.set('page', page.toString())

          router.push(`${pathname}?${newSearchParams}`)
        }}
      />
    </div>
  )
}
```

#### components/Pagination/Pagination.tsx
*Language: TypeScript | Size: 783 bytes*

```typescript
import React from 'react'
import { ResourceCollection } from '@/models/resource'
import Paginate from '@/components/Pagination/Paginate'
import RowsPerPage from '@/components/Pagination/RowsPerPage'
import Summary from '@/components/Pagination/Summary'

type Props = {
  meta: ResourceCollection<unknown>['meta'];
}

export default function Pagination(props: Props) {
  const {
    meta: {
      from,
      to,
      total,
      per_page: perPage,
      last_page: lastPage,
      current_page: currentPage,
    },
  } = props

  return (
    <div className="row align-items-center justify-content-center">
      <Summary from={from} to={to} total={total} />
      <RowsPerPage perPage={perPage} />
      <Paginate currentPage={currentPage} lastPage={lastPage} />
    </div>
  )
}
```

#### components/Pagination/RowsPerPage.tsx
*Language: TypeScript | Size: 456 bytes*

```typescript
import RowPerPageSelect from '@/components/Pagination/RowsPerPageSelect'
import useDictionary from '@/locales/dictionary-hook'

type Props = {
  perPage: number;
}

export default function RowsPerPage(props: Props) {
  const { perPage } = props

  const dict = useDictionary()

  return (
    <div className="col-auto ms-sm-auto mb-3">
      {dict.pagination.rows_per_page}
      :
      {' '}
      <RowPerPageSelect perPage={perPage} />
    </div>
  )
}
```

#### components/Pagination/RowsPerPageSelect.tsx
*Language: TypeScript | Size: 982 bytes*

```typescript
'use client'

import { FormSelect } from 'react-bootstrap'
import React from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

type Props = {
  perPage: number;
}

export default function RowPerPageSelect(props: Props) {
  const { perPage } = props
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  return (
    <FormSelect
      defaultValue={perPage}
      className="d-inline-block w-auto"
      aria-label="Item per page"
      onChange={(event) => {
        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.set('page', '1') // Go back to first page
        newSearchParams.set('per_page', event.target.value)

        router.push(`${pathname}?${newSearchParams}`)
      }}
    >
      <option value={20}>20</option>
      <option value={50}>50</option>
      <option value={100}>100</option>
      <option value={250}>250</option>
    </FormSelect>
  )
}
```

#### components/Pagination/Summary.tsx
*Language: TypeScript | Size: 538 bytes*

```typescript
import React from 'react'
import useDictionary from '@/locales/dictionary-hook'

type Props = {
  total: number;
  from: number;
  to: number;
}

export default function Summary(props: Props) {
  const { total, from, to } = props

  const dict = useDictionary()

  return (
    <div className="col-12 text-center text-sm-start col-sm-auto col-lg mb-3">
      {dict.pagination.summary
        .replace('{{from}}', from.toString())
        .replace('{{to}}', to.toString())
        .replace('{{total}}', total.toString())}
    </div>
  )
}
```

### components/ProgressBar/

#### components/ProgressBar/ProgressBar.tsx
*Language: TypeScript | Size: 150 bytes*

```typescript
'use client'

import { AppProgressBar } from 'next-nprogress-bar'

export default function ProgressBar() {
  return <AppProgressBar color="#29d" />
}
```

### components/TableSort/

#### components/TableSort/THSort.tsx
*Language: TypeScript | Size: 1236 bytes*

```typescript
'use client'

import React, { PropsWithChildren } from 'react'
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
  name: string;
} & PropsWithChildren

export default function THSort(props: Props) {
  const {
    name, children,
  } = props
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const sort = searchParams.get('sort')
  const order = searchParams.get('order')

  const onClick = () => {
    const newSearchParams = new URLSearchParams(searchParams)
    newSearchParams.set('sort', name)
    newSearchParams.set('order', order === 'asc' ? 'desc' : 'asc')

    router.push(`${pathname}?${newSearchParams}`)
  }

  const getIcon = () => {
    if (sort !== name) {
      return faSort
    }

    if (order === 'asc') {
      return faSortUp
    }

    return faSortDown
  }

  return (
    <a className="text-decoration-none" role="button" tabIndex={0} onClick={onClick} onKeyDown={onClick}>
      {children}
      <FontAwesomeIcon icon={getIcon()} fixedWidth size="xs" />
    </a>
  )
}
```

### hooks/

#### hooks/use-computed-style.ts
*Language: TypeScript | Size: 540 bytes*

```typescript
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'

export default function useComputedStyle(property: string) {
  const [style, setStyle] = useState('')
  const theme = Cookies.get('theme')

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      const element = document.body
      const computedStyle = window.getComputedStyle(element, null).getPropertyValue(property).replace(/^\s/, '')
      setStyle(computedStyle)
    }
  }, [property, theme])

  return style
}
```

### locales/

#### locales/DictionaryProvider.tsx
*Language: TypeScript | Size: 604 bytes*

```typescript
'use client'

import { createContext } from 'react'
import { getDictionary } from '@/locales/dictionary'

// Reference https://github.com/vercel/next.js/discussions/57405

// Import `getDictionary` from `server-only` works for typehint
type Dictionary = Awaited<ReturnType<typeof getDictionary>>

export const DictionaryContext = createContext<Dictionary | null>(null)

export default function DictionaryProvider({
  dictionary,
  children,
}: {
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  return <DictionaryContext.Provider value={dictionary}>{children}</DictionaryContext.Provider>
}
```

#### locales/config.ts
*Language: TypeScript | Size: 34 bytes*

```typescript
export const defaultLocale = 'vi'
```

#### locales/dictionary-hook.ts
*Language: TypeScript | Size: 345 bytes*

```typescript
'use client'

import { useContext } from 'react'
import { DictionaryContext } from '@/locales/DictionaryProvider'

export default function useDictionary() {
  const dictionary = useContext(DictionaryContext)
  if (dictionary === null) {
    throw new Error('useDictionary hook must be used within DictionaryProvider')
  }

  return dictionary
}
```

#### locales/dictionary.ts
*Language: TypeScript | Size: 836 bytes*

```typescript
// import 'server-only'
import Cookies from 'js-cookie'
import { defaultLocale } from '@/locales/config'

const dictionaries = {
  en: () => import('./en/lang.json').then((module) => module.default),
  vi: () => import('./vi/lang.json').then((module) => module.default),
}

type Locale = keyof typeof dictionaries

export const getLocales = () => Object.keys(dictionaries) as Array<Locale>

export const getLocale = (): Locale => {
  // Check if running in browser
  if (typeof window !== 'undefined') {
    const localeCookie = Cookies.get('locale')
    
    if (localeCookie && getLocales().includes(localeCookie as Locale)) {
      return localeCookie as Locale
    }
  }

  // Server-side or fallback
  return defaultLocale
}

export const getDictionary = async () => {
  const locale = getLocale()
  return dictionaries[locale]()
}
```

### locales/en/

#### locales/en/lang.json
*Language: JSON | Size: 12284 bytes*

```json
{
  "login": {
    "title": "Login",
    "description": "Sign in to your account",
    "form": {
      "username": "Username",
      "password": "Password",
      "submit": "Login"
    },
    "forgot_password": "Forgot password?",
    "signup": {
      "title": "Sign up",
      "description": "This is a demo page for https://github.com/kitloong/nextjs-dashboard. Click \"Login\" to view the full dashboard preview."
    },
    "message": {
      "auth_failed": "Invalid username or password"
    }
  },
  "pagination": {
    "summary": "Showing {{from}} to {{to}} of {{total}} results",
    "rows_per_page": "Rows per page"
  },
  "signup": {
    "title": "Register",
    "description": "Create your account",
    "register_now": "Register Now!",
    "form": {
      "username": "Username",
      "email": "Email",
      "password": "Password",
      "confirm_password": "Confirm Password",
      "submit": "Create Account"
    }
  },
  "action": {
    "info": "Info",
    "edit": "Edit",
    "delete": "Delete",
    "submit": "Submit",
    "submitting": "Submitting...",
    "reset": "Reset"
  },
  "theme": {
    "light": "Light",
    "dark": "Dark",
    "auto": "Auto"
  },
  "dashboard": {
    "featured": {
      "user": "Users",
      "income": "Income",
      "conversion_rate": "Conversion Rate",
      "sessions": "Sessions",
      "action": {
        "action1": "Action",
        "action2": "Another action",
        "action3": "Something else"
      }
    },
    "traffic": {
      "title": "Traffic",
      "duration": "January - July 2021",
      "option": {
        "day": "Day",
        "month": "Month",
        "year": "Year"
      },
      "chart": {
        "xlabel1": "January",
        "xlabel2": "February",
        "xlabel3": "March",
        "xlabel4": "April",
        "xlabel5": "May",
        "xlabel6": "June",
        "xlabel7": "July"
      },
      "users": "Users",
      "views": "Views",
      "category1": "Visits",
      "category2": "Unique",
      "category3": "Page views",
      "category4": "New users",
      "category5": "Bounce rate"
    },
    "social": {
      "facebook": {
        "label1": "Friends",
        "label2": "Feeds"
      },
      "twitter": {
        "label1": "Followers",
        "label2": "Tweets"
      },
      "instagram": {
        "label1": "Contacts",
        "label2": "Feeds"
      }
    },
    "sales": {
      "title": "Traffic & Sales",
      "stats": {
        "stat1": "New Clients",
        "stat2": "Recurring Clients",
        "stat3": "Page Views",
        "stat4": "Organic"
      },
      "monday": "Monday",
      "tuesday": "Tuesday",
      "wednesday": "Wednesday",
      "thursday": "Thursday",
      "friday": "Friday",
      "saturday": "Saturday",
      "sunday": "Sunday",
      "male": "Male",
      "female": "Female",
      "organic": "Organic Search",
      "facebook": "Facebook",
      "twitter": "Twitter",
      "linkedin": "LinkedIn"
    },
    "listing": {
      "headers": {
        "header1": "User",
        "header2": "Usage",
        "header3": "Payment Method",
        "header4": "Activity"
      },
      "user_status": {
        "new": "New",
        "recurring": "Recurring"
      },
      "registered": "Registered",
      "last_login": "Last login",
      "usage_duration": "Jun 11, 2020 - Jul 10, 2020",
      "registered_at": "Jan 1, 2020",
      "items": {
        "item1": {
          "name": "Yiorgos Avraamu",
          "login_at": "10 sec ago"
        },
        "item2": {
          "name": "Avram Tarasios",
          "login_at": "5 minutes ago"
        },
        "item3": {
          "name": "Quintin Ed",
          "login_at": "1 hour ago"
        },
        "item4": {
          "name": "Enéas Kwadwo",
          "login_at": "Last month"
        },
        "item5": {
          "name": "Agapetus Tadeáš",
          "login_at": "Last week"
        },
        "item6": {
          "name": "Friderik Dávid",
          "login_at": "Yesterday"
        }
      }
    }
  },
  "featured_nav": {
    "dashboard": "Dashboard",
    "users": "Users",
    "settings": "Settings"
  },
  "notification": {
    "message": "You have {{total}} notifications",
    "items": {
      "new_user": "New user registered",
      "deleted_user": "User deleted",
      "sales_report": "Sales report is ready",
      "new_client": "New client",
      "server_overloaded": "Server overloaded"
    },
    "server": {
      "title": "server",
      "processes": "Processes",
      "cores": "Cores",
      "items": {
        "cpu": "CPU usage",
        "memory": "Memory usage",
        "ssd1": "SSD 1 usage"
      }
    }
  },
  "task": {
    "message": "You have {{total}} pending tasks",
    "items": {
      "task1": "Upgrade Next.JS",
      "task2": "Train Pokemons",
      "task3": "Complete Pokedex",
      "task4": "Catch all shiny",
      "task5": "Beat all gyms"
    },
    "view_all": "View all tasks"
  },
  "messages": {
    "message": "You have {{total}} messages",
    "items": {
      "item1": {
        "user": "John Doe",
        "time": "Just now",
        "title": "Pet Pikachu",
        "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt"
      },
      "item2": {
        "user": "John Doe",
        "time": "5 mins ago",
        "title": "Dress Eevee",
        "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt"
      },
      "item3": {
        "user": "John Doe",
        "time": "1:52 PM",
        "title": "Team up training",
        "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt"
      },
      "item4": {
        "user": "John Doe",
        "time": "4:03 PM",
        "title": "Go to Safari Zone",
        "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt"
      }
    }
  },
  "profile": {
    "account": {
      "title": "Account",
      "items": {
        "updates": "Updates",
        "messages": "Messages",
        "tasks": "Tasks",
        "comments": "Comments"
      }
    },
    "settings": {
      "title": "Settings",
      "items": {
        "profile": "Profile",
        "settings": "Settings",
        "payments": "Payments",
        "projects": "Projects"
      }
    },
    "lock_account": "Lock account",
    "logout": "Logout"
  },
  "breadcrumb": {
    "home": "Home",
    "library": "Library",
    "data": "Data"
  },
  "sidebar": {
    "items": {
      "dashboard": "Dashboard",
      "ingredients": "Ingredients",
      "kitchens": "Kitchens",
      "dishes": "Dishes",
      "suppliers": "Suppliers",
      "users": "Users",
      "recipe_standards": "Recipe Standards",
      "orders": "Orders",
      "receiving": "Receiving",
      "inventory": "Inventory",
      "reports": "Reports",
      "sample": "Sample",
      "theme": "Theme",
      "colors": "Colors",
      "typography": "Typography",
      "components": "Components",
      "accordion": "Accordion",
      "breadcrumb": "Breadcrumb",
      "cards": "Cards",
      "carousel": "Carousel",
      "collapse": "Collapse",
      "list_group": "List group",
      "navs": "Navs",
      "pagination": "Pagination",
      "popovers": "Popovers",
      "progress": "Progress",
      "scrollspy": "Scrollspy",
      "spinners": "Spinners",
      "tables": "Tables",
      "tabs": "Tabs",
      "tooltips": "Tooltips",
      "buttons": "Buttons",
      "buttons_group": "Buttons Group",
      "dropdowns": "Dropdowns",
      "charts": "Charts",
      "form_control": "Form Control",
      "select": "Select",
      "checks_and_radios": "Checks and radios",
      "range": "Range",
      "input_group": "Input group",
      "floating_labels": "Floating labels",
      "layout": "Layout",
      "validation": "Validation",
      "core_ui_icons": "CoreUI Icons",
      "core_ui_icons_brand": "CoreUI Icons - Brand",
      "core_ui_icons_flag": "CoreUI Icons - Flag",
      "alerts": "Alerts",
      "badge": "Badge",
      "modals": "Modals",
      "toasts": "Toasts",
      "widgets": "Widgets",
      "login": "Login",
      "register": "Register",
      "error404": "Error 404",
      "error500": "Error 500",
      "docs": "Docs",
      "try_core_ui_pro": "Try CoreUI PRO",
      "base": "Base",
      "forms": "Forms",
      "icons": "Icons",
      "notifications": "Notifications",
      "extras": "Extras",
      "pages": "Pages",
      "master_data": "Master Data",
      "supplier_prices": "Supplier Prices",
      "inventory_management": "Inventory Management",
      "order_management": "Order Management",
      "receiving_management": "Receiving Management",
      "recipes": "Recipes",
      "by_dish": "By Dish"
    }
  },
  "ingredients": {
    "title": "Ingredient Management",
    "add_new": "Add New Ingredient",
    "id": "Ingredient ID",
    "name": "Ingredient Name",
    "property": "Property",
    "material_group": "Material Group",
    "unit": "Unit",
    "created_date": "Created Date",
    "loading": "Loading...",
    "no_data": "No ingredients found",
    "confirm_delete": "Are you sure you want to delete this ingredient?",
    "error_load": "Failed to load ingredients",
    "error_delete": "Failed to delete ingredient",
    "error_create": "Failed to create ingredient",
    "error_update": "Failed to update ingredient",
    "success_create": "Ingredient created successfully",
    "success_update": "Ingredient updated successfully",
    "edit":"Edit"
  
  },
  "kitchens": {
    "title": "Kitchen Management",
    "add_new": "Add New Kitchen",
    "id": "Kitchen ID",
    "name": "Kitchen Name",
    "address": "Address",
    "phone": "Phone",
    "status": "Status",
    "loading": "Loading...",
    "no_data": "No kitchens found",
    "confirm_delete": "Are you sure you want to delete this kitchen?",
    "error_load": "Failed to load kitchens",
    "error_delete": "Failed to delete kitchen",
    "error_create": "Failed to create kitchen",
    "error_update": "Failed to update kitchen",
    "success_create": "Kitchen created successfully",
    "success_update": "Kitchen updated successfully"
  },
  "dishes": {
    "title": "Dish Management",
    "add_new": "Add New Dish",
    "id": "Dish ID",
    "name": "Dish Name",
    "cooking_method": "Cooking Method",
    "status": "Status",
    "loading": "Loading...",
    "no_data": "No dishes found",
    "confirm_delete": "Are you sure you want to delete this dish?",
    "error_load": "Failed to load dishes",
    "error_delete": "Failed to delete dish",
    "view_recipe": "View Recipe",
    "error_create": "Failed to create dish",
    "error_update": "Failed to update dish",
    "success_create": "Dish created successfully",
    "success_update": "Dish updated successfully",
    "dishId": "Dish Id",
    "dishName": "Dish Name",
    "cookingMethod": "Cooking Method",
    "group": "Group",
    "description": "Description",
    "active": "Active",
    "edit": "Edit"
  },
  "suppliers": {
    "title": "Supplier Management",
    "add_new": "Add New Supplier",
    "id": "Supplier ID",
    "name": "Supplier Name",
    "zalo_link": "Zalo Link",
    "address": "Address",
    "phone": "Phone",
    "email": "Email",
    "loading": "Loading...",
    "no_data": "No suppliers found",
    "confirm_delete": "Are you sure you want to delete this supplier?",
    "error_load": "Failed to load suppliers",
    "error_delete": "Failed to delete supplier"
  },
  "recipe_standards": {
    "title": "Recipe Standards",
    "add_new": "Add New Standard",
    "dish": "Dish",
    "ingredient": "Ingredient",
    "standard_per_serving": "Standard Per Serving",
    "unit": "Unit",
    "amount": "Amount",
    "note": "Note",
    "no_data": "No recipe standards found",
    "confirm_delete": "Are you sure you want to delete this recipe standard?",
    "error_load": "Failed to load recipe standards",
    "error_delete": "Failed to delete recipe standard"
  },
  "common": {
    "active": "Active",
    "inactive": "Inactive",
    "loading": "Loading...",
    "no_data": "No data available",
    "cancel": "Cancel",
    "save": "Save",
    "search": "Search",
    "filter": "Filter",
    "export": "Export",
    "import": "Import",
    "actions": "Actions"
  }
}
```

### locales/vi/

#### locales/vi/lang.json
*Language: JSON | Size: 14273 bytes*

```json
{
  "login": {
    "title": "Đăng nhập",
    "description": "Đăng nhập vào tài khoản của bạn",
    "form": {
      "username": "Tên đăng nhập",
      "password": "Mật khẩu",
      "submit": "Đăng nhập"
    },
    "forgot_password": "Quên mật khẩu?",
    "signup": {
      "title": "Đăng ký",
      "description": "Đây là trang demo cho https://github.com/kitloong/nextjs-dashboard. Nhấn 'Đăng nhập' để xem bảng điều khiển đầy đủ."
    },
    "message": {
      "auth_failed": "Tên đăng nhập hoặc mật khẩu không đúng"
    }
  },
  "signup": {
    "title": "Đăng ký",
    "description": "Tạo tài khoản mới",
    "register_now": "Đăng ký ngay!",
    "form": {
      "username": "Tên đăng nhập",
      "email": "Email",
      "password": "Mật khẩu",
      "confirm_password": "Xác nhận mật khẩu",
      "submit": "Tạo tài khoản"
    }
  },
  "pagination": {
    "summary": "Hiển thị {{from}} đến {{to}} trong tổng số {{total}} kết quả",
    "rows_per_page": "Số dòng mỗi trang"
  },
  "action": {
    "info": "Thông tin",
    "edit": "Sửa",
    "delete": "Xóa",
    "submit": "Gửi",
    "submitting": "Đang gửi...",
    "reset": "Đặt lại"
  },
  "theme": {
    "light": "Sáng",
    "dark": "Tối",
    "auto": "Tự động"
  },
  "dashboard": {
    "featured": {
      "user": "Người dùng",
      "income": "Thu nhập",
      "conversion_rate": "Tỷ lệ chuyển đổi",
      "sessions": "Phiên",
      "action": {
        "action1": "Hành động",
        "action2": "Hành động khác",
        "action3": "Hành động khác nữa"
      }
    },
    "traffic": {
      "title": "Lưu lượng truy cập",
      "duration": "Tháng 1 - Tháng 7 2021",
      "option": {
        "day": "Ngày",
        "month": "Tháng",
        "year": "Năm"
      },
      "chart": {
        "xlabel1": "Tháng 1",
        "xlabel2": "Tháng 2",
        "xlabel3": "Tháng 3",
        "xlabel4": "Tháng 4",
        "xlabel5": "Tháng 5",
        "xlabel6": "Tháng 6",
        "xlabel7": "Tháng 7"
      },
      "users": "Người dùng",
      "views": "Lượt xem",
      "category1": "Lượt truy cập",
      "category2": "Duy nhất",
      "category3": "Lượt xem trang",
      "category4": "Người dùng mới",
      "category5": "Tỷ lệ thoát"
    },
    "social": {
      "facebook": {
        "label1": "Bạn bè",
        "label2": "Tin tức"
      },
      "twitter": {
        "label1": "Người theo dõi",
        "label2": "Tweet"
      },
      "instagram": {
        "label1": "Liên hệ",
        "label2": "Tin tức"
      }
    },
    "sales": {
      "title": "Lưu lượng & Bán hàng",
      "stats": {
        "stat1": "Khách hàng mới",
        "stat2": "Khách hàng quay lại",
        "stat3": "Lượt xem trang",
        "stat4": "Lưu lượng tự nhiên"
      },
      "monday": "Thứ hai",
      "tuesday": "Thứ ba",
      "wednesday": "Thứ tư",
      "thursday": "Thứ năm",
      "friday": "Thứ sáu",
      "saturday": "Thứ bảy",
      "sunday": "Chủ nhật",
      "male": "Nam",
      "female": "Nữ",
      "organic": "Tìm kiếm tự nhiên",
      "facebook": "Facebook",
      "twitter": "Twitter",
      "linkedin": "LinkedIn"
    },
    "listing": {
      "headers": {
        "header1": "Người dùng",
        "header2": "Sử dụng",
        "header3": "Phương thức thanh toán",
        "header4": "Hoạt động"
      },
      "user_status": {
        "new": "Mới",
        "recurring": "Quay lại"
      },
      "registered": "Đã đăng ký",
      "last_login": "Đăng nhập lần cuối",
      "usage_duration": "11 Tháng 6, 2020 - 10 Tháng 7, 2020",
      "registered_at": "1 Tháng 1, 2020",
      "items": {
        "item1": {
          "name": "Nguyễn Văn A",
          "login_at": "10 giây trước"
        },
        "item2": {
          "name": "Trần Thị B",
          "login_at": "5 phút trước"
        },
        "item3": {
          "name": "Lê Văn C",
          "login_at": "1 giờ trước"
        },
        "item4": {
          "name": "Phạm Thị D",
          "login_at": "Tháng trước"
        },
        "item5": {
          "name": "Hoàng Văn E",
          "login_at": "Tuần trước"
        },
        "item6": {
          "name": "Đỗ Thị F",
          "login_at": "Hôm qua"
        }
      }
    }
  },
  "pokemons": {
    "title": "Pokemon",
    "add_new": "Thêm mới",
    "attribute": {
      "name": "Tên",
      "type": "Loại",
      "egg_group": "Nhóm trứng",
      "hp": "HP",
      "attack": "Tấn công",
      "defense": "Phòng thủ",
      "sp_attack": "Tấn công đặc biệt",
      "sp_defense": "Phòng thủ đặc biệt",
      "speed": "Tốc độ",
      "total": "Tổng"
    }
  },
  "featured_nav": {
    "dashboard": "Bảng điều khiển",
    "users": "Người dùng",
    "settings": "Cài đặt"
  },
  "notification": {
    "message": "Bạn có {{total}} thông báo",
    "items": {
      "new_user": "Người dùng mới đã đăng ký",
      "deleted_user": "Người dùng đã bị xóa",
      "sales_report": "Báo cáo bán hàng đã sẵn sàng",
      "new_client": "Khách hàng mới",
      "server_overloaded": "Máy chủ quá tải"
    },
    "server": {
      "title": "máy chủ",
      "processes": "Tiến trình",
      "cores": "Lõi",
      "items": {
        "cpu": "Sử dụng CPU",
        "memory": "Sử dụng bộ nhớ",
        "ssd1": "Sử dụng SSD 1"
      }
    }
  },
  "task": {
    "message": "Bạn có {{total}} nhiệm vụ đang chờ",
    "items": {
      "task1": "Nâng cấp Next.JS",
      "task2": "Huấn luyện Pokemon",
      "task3": "Hoàn thành Pokedex",
      "task4": "Bắt tất cả shiny",
      "task5": "Đánh bại tất cả phòng gym"
    },
    "view_all": "Xem tất cả nhiệm vụ"
  },
  "messages": {
    "message": "Bạn có {{total}} tin nhắn",
    "items": {
      "item1": {
        "user": "Nguyễn Văn A",
        "time": "Vừa xong",
        "title": "Thú cưng Pikachu",
        "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt"
      },
      "item2": {
        "user": "Trần Thị B",
        "time": "5 phút trước",
        "title": "Trang phục Eevee",
        "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt"
      },
      "item3": {
        "user": "Lê Văn C",
        "time": "1:52 CH",
        "title": "Huấn luyện theo nhóm",
        "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt"
      },
      "item4": {
        "user": "Phạm Thị D",
        "time": "4:03 CH",
        "title": "Đi đến Safari Zone",
        "description": "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt"
      }
    }
  },
  "profile": {
    "account": {
      "title": "Tài khoản",
      "items": {
        "updates": "Cập nhật",
        "messages": "Tin nhắn",
        "tasks": "Nhiệm vụ",
        "comments": "Bình luận"
      }
    },
    "settings": {
      "title": "Cài đặt",
      "items": {
        "profile": "Hồ sơ",
        "settings": "Cài đặt",
        "payments": "Thanh toán",
        "projects": "Dự án"
      }
    },
    "lock_account": "Khóa tài khoản",
    "logout": "Đăng xuất"
  },
  "breadcrumb": {
    "home": "Trang chủ",
    "library": "Thư viện",
    "data": "Dữ liệu"
  },
  "sidebar": {
    "items": {
      "dashboard": "Bảng điều khiển",
      "ingredients": "Nguyên liệu",
      "kitchens": "Bếp",
      "dishes": "Món ăn",
      "suppliers": "Nhà cung cấp",
      "users": "Người dùng",
      "recipe_standards": "Định mức công thức",
      "orders": "Đơn hàng",
      "receiving": "Nhận hàng",
      "inventory": "Tồn kho",
      "reports": "Báo cáo",
      "sample": "Mẫu",
      "theme": "Giao diện",
      "colors": "Màu sắc",
      "typography": "Kiểu chữ",
      "components": "Thành phần",
      "accordion": "Accordion",
      "breadcrumb": "Breadcrumb",
      "cards": "Thẻ",
      "carousel": "Carousel",
      "collapse": "Thu gọn",
      "list_group": "Danh sách nhóm",
      "navs": "Điều hướng",
      "pagination": "Phân trang",
      "popovers": "Popover",
      "progress": "Thanh tiến trình",
      "scrollspy": "Scrollspy",
      "spinners": "Spinner",
      "tables": "Bảng",
      "tabs": "Tab",
      "tooltips": "Tooltip",
      "buttons": "Nút",
      "buttons_group": "Nhóm nút",
      "dropdowns": "Dropdown",
      "charts": "Biểu đồ",
      "form_control": "Điều khiển biểu mẫu",
      "select": "Chọn",
      "checks_and_radios": "Checkbox và Radio",
      "range": "Phạm vi",
      "input_group": "Nhóm input",
      "floating_labels": "Nhãn nổi",
      "layout": "Bố cục",
      "validation": "Xác thực",
      "core_ui_icons": "Biểu tượng CoreUI",
      "core_ui_icons_brand": "Biểu tượng CoreUI - Thương hiệu",
      "core_ui_icons_flag": "Biểu tượng CoreUI - Cờ",
      "alerts": "Cảnh báo",
      "badge": "Huy hiệu",
      "modals": "Modal",
      "toasts": "Toast",
      "widgets": "Widget",
      "login": "Đăng nhập",
      "register": "Đăng ký",
      "error404": "Lỗi 404",
      "error500": "Lỗi 500",
      "docs": "Tài liệu",
      "try_core_ui_pro": "Dùng thử CoreUI PRO",
      "base": "Cơ bản",
      "forms": "Biểu mẫu",
      "icons": "Biểu tượng",
      "notifications": "Thông báo",
      "extras": "Bổ sung",
      "pages": "Trang",
      "master_data": "Dữ liệu chính",
      "supplier_prices": "Giá nhà cung cấp",
      "inventory_management": "Quản lý tồn kho",
      "order_management": "Quản lý đơn hàng",
      "receiving_management": "Quản lý nhận hàng",
      "recipes": "Công thức",
      "by_dish": "Theo món ăn",
      "by_ingredient": "Theo nguyên liệu"
    }
  },
 
  "ingredients": {
    "loading": "Đang tải...",
    "no_data": "Không tìm thấy nguyên liệu",
    "confirm_delete": "Bạn có chắc chắn muốn xóa nguyên liệu này?",
    "error_load": "Không thể tải danh sách nguyên liệu",
    "error_delete": "Không thể xóa nguyên liệu",
    "error_create": "Không thể tạo nguyên liệu",
    "error_update": "Không thể cập nhật nguyên liệu",
    "success_create": "Tạo nguyên liệu thành công",
    "success_update": "Cập nhật nguyên liệu thành công",
    "add_new": "Thêm nguyên liệu mới",
    "title": "Quản lý nguyên liệu",
    "id": "Mã nguyên liệu",
    "name": "Tên nguyên liệu",
    "unit": "Đơn vị",
    "category": "Danh mục",
    "supplier": "Nhà cung cấp",
    "status": "Trạng thái",
    "property": "Tính chất",
    "material_group": "Nhóm vật liệu",
    "created_date": "Ngày tạo",
    "edit":"Sửa"
  },
  "kitchens": {
    "loading": "Đang tải...",
    "no_data": "Không tìm thấy bếp",
    "confirm_delete": "Bạn có chắc chắn muốn xóa bếp này?",
    "error_load": "Không thể tải danh sách bếp",
    "error_delete": "Không thể xóa bếp",
    "error_create": "Không thể tạo bếp",
    "error_update": "Không thể cập nhật bếp",
    "success_create": "Tạo bếp thành công",
    "success_update": "Cập nhật bếp thành công",
    "title": "Quản lý bếp",
    "add_new": "Thêm bếp mới",
    "id": "Mã bếp",
    "name": "Tên bếp",
    "address": "Địa chỉ",
    "phone": "Số điện thoại",
    "status": "Trạng thái"
  },
  "dishes": {
    "title": "Quản lý món ăn",
    "add_new": "Thêm món mới",
    "id": "Mã món",
    "name": "Tên món",
    "cooking_method": "Phương pháp nấu",
    "status": "Trạng thái",
    "loading": "Đang tải...",
    "no_data": "Không tìm thấy món ăn",
    "confirm_delete": "Bạn có chắc chắn muốn xóa món ăn này?",
    "error_load": "Không thể tải danh sách món ăn",
    "error_delete": "Không thể xóa món ăn",
    "view_recipe": "Xem công thức",
    "dishId": "Mã món",
    "dishName": "Tên món",
    "cookingMethod": "Phương pháp nấu",
    "group": "Nhóm",
    "description": "Mô tả",
    "active": "Hoạt động",
    "edit": "Cập nhật"
  },
  "suppliers": {
    "title": "Quản lý nhà cung cấp",
    "add_new": "Thêm nhà cung cấp mới",
    "id": "Mã nhà cung cấp",
    "name": "Tên nhà cung cấp",
    "zalo_link": "Liên kết Zalo",
    "address": "Địa chỉ",
    "phone": "Số điện thoại",
    "email": "Email",
    "loading": "Đang tải...",
    "no_data": "Không tìm thấy nhà cung cấp",
    "confirm_delete": "Bạn có chắc chắn muốn xóa nhà cung cấp này?",
    "error_load": "Không thể tải danh sách nhà cung cấp",
    "error_delete": "Không thể xóa nhà cung cấp"
  },
  "recipe_standards": {
    "title": "Định mức công thức",
    "add_new": "Thêm định mức mới",
    "dish": "Món ăn",
    "ingredient": "Nguyên liệu",
    "standard_per_serving": "Định mức cho mỗi khẩu phần",
    "unit": "Đơn vị",
    "amount": "Số lượng",
    "note": "Ghi chú",
    "no_data": "Không tìm thấy định mức công thức",
    "confirm_delete": "Bạn có chắc chắn muốn xóa định mức công thức này?",
    "error_load": "Không thể tải danh sách định mức công thức",
    "error_delete": "Không thể xóa định mức công thức"
  },
  "common": {
    "active": "Hoạt động",
    "inactive": "Không hoạt động",
    "loading": "Đang tải...",
    "no_data": "Không có dữ liệu",
    "cancel": "Hủy",
    "save": "Lưu",
    "search": "Tìm kiếm",
    "filter": "Lọc",
    "export": "Xuất",
    "import": "Nhập",
    "actions": "Hành động"
  }
}
```

### models/

#### models/dish.ts
*Language: TypeScript | Size: 486 bytes*

```typescript
export interface Dish {
  dishId: string
  dishName: string
  cookingMethod: string
  group: string
  description: string
  active: boolean
  createdDate: string
  modifiedDate: string
}

export interface CreateDishInput {
  dishId: string
  dishName: string
  cookingMethod?: string
  group?: string
  description?: string
  active?: boolean
}

export interface UpdateDishInput {
  dishName?: string
  cookingMethod?: string
  group?: string
  description?: string
  active?: boolean
}
```

#### models/egg-group.ts
*Language: TypeScript | Size: 60 bytes*

```typescript
export interface EggGroup {
  id: number;
  name: string;
}
```

#### models/index.ts
*Language: TypeScript | Size: 722 bytes*

```typescript
// Ingredient Models
export type { 
  Ingredient, 
  CreateIngredientInput, 
  UpdateIngredientInput 
} from './ingredient'

// Kitchen Models
export type { 
  Kitchen, 
  CreateKitchenInput, 
  UpdateKitchenInput 
} from './kitchen'

// Dish Models
export type { 
  Dish, 
  CreateDishInput, 
  UpdateDishInput 
} from './dish'

// Supplier Models
export type { 
  Supplier, 
  CreateSupplierInput, 
  UpdateSupplierInput 
} from './supplier'

// Recipe Standard Models
export type { 
  RecipeStandard, 
  CreateRecipeStandardInput, 
  UpdateRecipeStandardInput 
} from './recipe_standard'

// Resource Models
export type { 
  Resource, 
  ResourceCollection 
} from './resource'

export { newResource } from './resource'
```

#### models/ingredient.ts
*Language: TypeScript | Size: 465 bytes*

```typescript
export interface Ingredient {
  ingredientId: string
  ingredientName: string
  property: string
  materialGroup: string
  unit: string
  createdDate: string
  modifiedDate: string
}

export interface CreateIngredientInput {
  ingredientId: string
  ingredientName: string
  property?: string
  materialGroup?: string
  unit: string
}

export interface UpdateIngredientInput {
  ingredientName?: string
  property?: string
  materialGroup?: string
  unit?: string
}
```

#### models/kitchen.ts
*Language: TypeScript | Size: 424 bytes*

```typescript
export interface Kitchen {
  kitchenId: string
  kitchenName: string
  address: string
  phone: string
  active: boolean
  createdDate: string
  modifiedDate: string
}

export interface CreateKitchenInput {
  kitchenId: string
  kitchenName: string
  address?: string
  phone?: string
  active?: boolean
}

export interface UpdateKitchenInput {
  kitchenName?: string
  address?: string
  phone?: string
  active?: boolean
}
```

#### models/pokemon.ts
*Language: TypeScript | Size: 378 bytes*

```typescript
import { Type } from '@/models/type'
import { EggGroup } from '@/models/egg-group'

export interface Pokemon {
  id: number;
  identifier: string;
  pokemondb_identifier: string;
  name: string;
  types: Type[];
  egg_groups: EggGroup[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  total: number;
}
```

#### models/recipe_standard.ts
*Language: TypeScript | Size: 671 bytes*

```typescript
export interface RecipeStandard {
  standardId: number
  dishId: string
  ingredientId: string
  unit: string
  standardPer1: number
  note: string
  amount: number
  updatedById: string
  createdDate: string
  modifiedDate: string
  dish?: {
    dishId: string
    dishName: string
  }
  ingredient?: {
    ingredientId: string
    ingredientName: string
  }
}

export interface CreateRecipeStandardInput {
  dishId: string
  ingredientId: string
  unit: string
  standardPer1: number
  note?: string
  amount: number
  updatedById: string
}

export interface UpdateRecipeStandardInput {
  standardPer1?: number
  note?: string
  amount?: number
  updatedById?: string
}
```

#### models/resource.ts
*Language: TypeScript | Size: 921 bytes*

```typescript
export interface Resource<T> {
  data: T;
}

export interface ResourceCollection<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    per_page: number;
    total: number;
  };
}

const getTo = (total: number, page: number, perPage: number) => {
  if (page === 1) {
    return total < perPage ? total : perPage
  }

  return (page - 1) * perPage + perPage
}

const getLastPage = (total: number, perPage: number) => {
  if (total <= 1) {
    return 1
  }

  return Math.ceil(total / perPage)
}

export const newResource = <T>(
  data: T[],
  total: number,
  page: number,
  perPage: number,
): ResourceCollection<T> => ({
    data,
    meta: {
      current_page: page,
      last_page: getLastPage(total, perPage),
      from: page === 1 ? 1 : (page - 1) * perPage + 1,
      to: getTo(total, page, perPage),
      per_page: perPage,
      total,
    },
  })
```

#### models/supplier.ts
*Language: TypeScript | Size: 541 bytes*

```typescript
export interface Supplier {
  supplierId: string
  supplierName: string
  zaloLink: string
  address: string
  phone: string
  email: string
  active: boolean
  createdDate: string
  modifiedDate: string
}

export interface CreateSupplierInput {
  supplierId: string
  supplierName: string
  zaloLink?: string
  address?: string
  phone?: string
  email?: string
  active?: boolean
}

export interface UpdateSupplierInput {
  supplierName?: string
  zaloLink?: string
  address?: string
  phone?: string
  email?: string
  active?: boolean
}
```

#### models/type.ts
*Language: TypeScript | Size: 289 bytes*

```typescript
export interface Type {
  id: number;
  name: string;
}

export enum TypeIdentifier {
  Normal = 1,
  Fighting,
  Flying,
  Poison,
  Ground,
  Rock,
  Bug,
  Ghost,
  Steel,
  Fire,
  Water,
  Grass,
  Electric,
  Psychic,
  Ice,
  Dragon,
  Dark,
  Fairy,
  Unknown = 10001,
  Shadow,
}
```

#### middleware.ts
*Language: TypeScript | Size: 1378 bytes*

```typescript
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'
import { type NextFetchEvent, NextRequest, NextResponse } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { NextMiddlewareResult } from 'next/dist/server/web/types'
import { getLocales } from '@/locales/dictionary'
import { defaultLocale } from '@/locales/config'

export default async function middleware(request: NextRequest, event: NextFetchEvent) {
  const headers = { 'accept-language': request.headers.get('accept-language') ?? '' }
  const languages = new Negotiator({ headers }).languages()
  const locales = getLocales()

  const locale = match(languages, locales, defaultLocale)
  const response = NextResponse.next()
  if (!request.cookies.get('locale')) {
    response.cookies.set('locale', locale)
  }

  /*
   * Match all request paths except for the ones starting with:
   * - login
   * - register
   */
  if (![
    '/login',
    '/register',
    '/ads.txt',
  ].includes(request.nextUrl.pathname)) {
    const res: NextMiddlewareResult = await withAuth(
      // Response with local cookies
      () => response,
      {
      // Matches the pages config in `[...nextauth]`
        pages: {
          signIn: '/login',
        },
      },
    )(request as NextRequestWithAuth, event)
    return res
  }

  return response
}
```

### services/

#### services/dish-api.ts
*Language: TypeScript | Size: 868 bytes*

```typescript
import { apiClient } from '@/utils/api_client'
import { Dish, CreateDishInput, UpdateDishInput } from '@/models/dish'

export const dishApi = {
  getAll: async (): Promise<Dish[]> => {
    return apiClient<Dish[]>('/api/dishes')
  },

  getById: async (id: string): Promise<Dish> => {
    return apiClient<Dish>(`/api/dishes/${id}`)
  },

  create: async (data: CreateDishInput): Promise<Dish> => {
    return apiClient<Dish>('/api/dishes', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: UpdateDishInput): Promise<Dish> => {
    return apiClient<Dish>(`/api/dishes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return apiClient<{ message: string }>(`/api/dishes/${id}`, {
      method: 'DELETE',
    })
  },
}
```

#### services/index.ts
*Language: TypeScript | Size: 3850 bytes*

```typescript
import { apiClient } from '@/utils/api_client'
import { 
  Ingredient, CreateIngredientInput, UpdateIngredientInput,
  Kitchen, CreateKitchenInput, UpdateKitchenInput,
  Dish, CreateDishInput, UpdateDishInput,
  Supplier, CreateSupplierInput, UpdateSupplierInput,
  RecipeStandard, CreateRecipeStandardInput, UpdateRecipeStandardInput
} from '@/models'

// Ingredients API
export const ingredientApi = {
  getAll: () => apiClient<Ingredient[]>('/api/ingredients'),
  getById: (id: string) => apiClient<Ingredient>(`/api/ingredients/${id}`),
  create: (data: CreateIngredientInput) => 
    apiClient<Ingredient>('/api/ingredients', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdateIngredientInput) => 
    apiClient<Ingredient>(`/api/ingredients/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiClient<{ message: string }>(`/api/ingredients/${id}`, { method: 'DELETE' }),
}

// Kitchens API
export const kitchenApi = {
  getAll: () => apiClient<Kitchen[]>('/api/kitchens'),
  getById: (id: string) => apiClient<Kitchen>(`/api/kitchens/${id}`),
  create: (data: CreateKitchenInput) => 
    apiClient<Kitchen>('/api/kitchens', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdateKitchenInput) => 
    apiClient<Kitchen>(`/api/kitchens/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiClient<{ message: string }>(`/api/kitchens/${id}`, { method: 'DELETE' }),
}

// Dishes API
export const dishApi = {
  getAll: () => apiClient<Dish[]>('/api/dishes'),
  getById: (id: string) => apiClient<Dish>(`/api/dishes/${id}`),
  create: (data: CreateDishInput) => 
    apiClient<Dish>('/api/dishes', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdateDishInput) => 
    apiClient<Dish>(`/api/dishes/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiClient<{ message: string }>(`/api/dishes/${id}`, { method: 'DELETE' }),
}

// Suppliers API
export const supplierApi = {
  getAll: () => apiClient<Supplier[]>('/api/suppliers'),
  getById: (id: string) => apiClient<Supplier>(`/api/suppliers/${id}`),
  create: (data: CreateSupplierInput) => 
    apiClient<Supplier>('/api/suppliers', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: UpdateSupplierInput) => 
    apiClient<Supplier>(`/api/suppliers/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiClient<{ message: string }>(`/api/suppliers/${id}`, { method: 'DELETE' }),
}

// Recipe Standards API
export const recipeStandardApi = {
  getAll: () => apiClient<RecipeStandard[]>('/api/recipe-standards'),
  getById: (id: number) => apiClient<RecipeStandard>(`/api/recipe-standards/${id}`),
  getByDish: (dishId: string) => 
    apiClient<RecipeStandard[]>(`/api/recipe-standards/dish/${dishId}`),
  create: (data: CreateRecipeStandardInput) => 
    apiClient<RecipeStandard>('/api/recipe-standards', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: UpdateRecipeStandardInput) => 
    apiClient<RecipeStandard>(`/api/recipe-standards/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => 
    apiClient<{ message: string }>(`/api/recipe-standards/${id}`, { method: 'DELETE' }),
}

// Users API
export const userApi = {
  getAll: () => apiClient<any[]>('/api/users'),
  getById: (id: string) => apiClient<any>(`/api/users/${id}`),
  create: (data: any) => 
    apiClient<any>('/api/users', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => 
    apiClient<any>(`/api/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => 
    apiClient<{ message: string }>(`/api/users/${id}`, { method: 'DELETE' }),
}
```

#### services/ingredient-api.ts
*Language: TypeScript | Size: 983 bytes*

```typescript
import { apiClient } from '@/utils/api_client'
import { Ingredient, CreateIngredientInput, UpdateIngredientInput } from '@/models/ingredient'

export const ingredientApi = {
  getAll: async (): Promise<Ingredient[]> => {
    return apiClient<Ingredient[]>('/api/ingredients')
  },

  getById: async (id: string): Promise<Ingredient> => {
    return apiClient<Ingredient>(`/api/ingredients/${id}`)
  },

  create: async (data: CreateIngredientInput): Promise<Ingredient> => {
    return apiClient<Ingredient>('/api/ingredients', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  update: async (id: string, data: UpdateIngredientInput): Promise<Ingredient> => {
    return apiClient<Ingredient>(`/api/ingredients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  delete: async (id: string): Promise<{ message: string }> => {
    return apiClient<{ message: string }>(`/api/ingredients/${id}`, {
      method: 'DELETE',
    })
  },
}
```

### styles/

#### styles/_custom.scss
*Language: SCSS | Size: 190 bytes*

```scss
@include color-mode(dark) {
  .dark\:text-gray-500 {
    color: $gray-500 !important;
  }

  .dark\:table-dark {
    @extend .table-dark;
  }

  .dark\:bg-dark {
    @extend .bg-dark;
  }
}
```

#### styles/globals.scss
*Language: SCSS | Size: 219 bytes*

```scss
$enable-negative-margins: true;

@import "~bootstrap/scss/bootstrap";

@import "layout/avatar";
@import "layout/footer";
@import "layout/header";
@import "layout/progress";
@import "layout/sidebar";

@import "_custom";
```

### styles/layout/

#### styles/layout/_avatar.scss
*Language: SCSS | Size: 602 bytes*

```scss
$avatar-width: 2rem;
$avatar-height: 2rem;
$avatar-md-width: 2.5rem;
$avatar-md-height: 2.5rem;
$avatar-status-width: 0.5333333333rem;
$avatar-status-height: 0.5333333333rem;
$avatar-status-md-width: 0.6666666667rem;
$avatar-status-md-height: 0.6666666667rem;

.avatar {
  width: $avatar-width;
  height: $avatar-height;

  .avatar-status {
    width: $avatar-status-width;
    height: $avatar-status-height;
  }

  &.avatar-md {
    width: $avatar-md-width;
    height: $avatar-md-height;

    .avatar-status {
      width: $avatar-status-md-width;
      height: $avatar-status-md-height;
    }
  }
}
```

#### styles/layout/_footer.scss
*Language: SCSS | Size: 65 bytes*

```scss
$footer-height: 3rem;

.footer {
  min-height: $footer-height;
}
```

#### styles/layout/_header.scss
*Language: SCSS | Size: 1397 bytes*

```scss
$header-background: #fff;
$header-background-dark: #212529;
$header-link-color: rgba(44, 56, 74, 0.681);
$header-link-color-dark: var(--#{$prefix}body-color);
$header-link-color-hover: rgba(44, 56, 74, 0.95);
$header-link-color-hover-dark: #999;
$header-brand-color: #4f5d73;
$header-brand-color-dark: var(--#{$prefix}body-color);

:root {
  --header-background: #{$header-background};
  --header-link-color: #{$header-link-color};
  --header-link-color-hover: #{$header-link-color-hover};
  --header-brand-color: #{$header-brand-color};
}

@include color-mode(dark) {
  --header-background: #{$header-background-dark};
  --header-link-color: #{$header-link-color-dark};
  --header-link-color-hover: #{$header-link-color-hover-dark};
  --header-brand-color: #{$header-brand-color-dark};
}

.header {
  background: var(--header-background);

  .header-brand {
    color: var(--header-brand-color);
  }

  .header-navbar {
    min-height: 3rem;

    .header-toggler {
      color: var(--header-link-color);
    }

    .header-nav {
      .nav-link {
        color: var(--header-link-color);

        &:hover {
          color: var(--header-link-color-hover);
        }
      }
    }
  }

  .breadcrumb {
    min-height: 2rem;

    .breadcrumb-item {
      a {
        color: var(--header-link-color);

        &:hover {
          color: var(--header-link-color-hover);
        }
      }
    }
  }
}
```

#### styles/layout/_progress.scss
*Language: SCSS | Size: 91 bytes*

```scss
$progress-bar-thin-height: .4rem;

.progress-thin {
  height: $progress-bar-thin-height;
}
```

#### styles/layout/_sidebar.scss
*Language: SCSS | Size: 4543 bytes*

```scss
$sidebar-background: #3c4b64;
$sidebar-background-dark: var(--#{$prefix}body-bg);
$sidebar-text-color: rgba(255, 255, 255, 0.6);
$sidebar-brand-height: 4rem;
$sidebar-brand-background: rgba(0, 0, 21, 0.2);
$sidebar-brand-background-dark: #1a1e26;
$sidebar-border-color: #3c4b64;
$sidebar-border-color-dark: var(--#{$prefix}border-color);
$sidebar-nav-group-background: rgba(0, 0, 0, 0.2);
$sidebar-link-color: rgba(255, 255, 255, 0.6);
$sidebar-link-color-hover: rgba(255, 255, 255, 0.87);
$sidebar-link-background-hover: rgba(255, 255, 255, 0.05);
$sidebar-toggler-height: 3rem;
$sidebar-toggler-background: rgba(0, 0, 21, 0.2);
$sidebar-toggler-background-dark: #1a1e26;
$sidebar-toggler-background-hover: rgba(0, 0, 0, 0.3);
$sidebar-toggler-color: rgba(255, 255, 255, 0.6);
$sidebar-toggler-color-hover: #ffffff;
$sidebar-z-index: $zindex-fixed; // Default 1030
$sidebar-overlay-z-index: 1025;

:root {
  --sidebar-width: 16rem;
  --sidebar-background: #{$sidebar-background};
  --sidebar-brand-background: #{$sidebar-brand-background};
  --sidebar-toggler-background: #{$sidebar-toggler-background};
  --sidebar-border-color: #{$sidebar-border-color}
}

@include color-mode(dark) {
  --sidebar-background: #{$sidebar-background-dark};
  --sidebar-brand-background: #{$sidebar-brand-background-dark};
  --sidebar-toggler-background: #{$sidebar-toggler-background-dark};
  --sidebar-border-color: #{$sidebar-border-color-dark}
}

.sidebar {
  flex: 0 0 var(--sidebar-width);
  width: var(--sidebar-width);
  background: var(--sidebar-background);
  color: $sidebar-text-color;
  transition: margin-left 0.15s, margin-right 0.15s, box-shadow 0.075s, transform 0.15s, width 0.15s, z-index 0s ease 0.15s;
  z-index: $sidebar-z-index;

  & + .wrapper {
    transition: padding 0.15s;
  }

  .sidebar-brand {
    flex: 0 0 $sidebar-brand-height;
    background: var(--sidebar-brand-background);
  }

  .sidebar-nav {
    overflow-x: hidden;
    overflow-y: auto;
    border-top-color: var(--sidebar-border-color) !important;

    .nav-title {
      font-size: 80%;
    }

    .nav-link {
      color: $sidebar-link-color;

      &:hover {
        color: $sidebar-link-color-hover;
        text-decoration: none;
        background: $sidebar-link-background-hover;
      }

      .nav-icon {
        flex: 0 0 4rem;
      }
    }

    .nav-group {
      &.show {
        background: $sidebar-nav-group-background;
      }

      .nav-link {
        &:focus {
          box-shadow: none;
        }

        .nav-chevron {
          transition: transform 0.15s;
        }

        &.collapsed {
          .nav-chevron {
            transform: rotate(180deg);
          }
        }
      }
    }
  }

  .sidebar-toggler {
    flex: 0 0 $sidebar-toggler-height;
    background: var(--sidebar-toggler-background);
    color: $sidebar-toggler-color;
    border-top-color: var(--sidebar-border-color) !important;

    &:hover {
      background: $sidebar-toggler-background-hover;
      color: $sidebar-toggler-color-hover;
    }

    .sidebar-toggler-chevron {
      transition: transform 0.15s;
    }
  }

  & {
    margin-left: calc(-1 * var(--sidebar-width));
  }

  &.show {
    margin-left: 0;
  }

  & + .wrapper {
    padding-left: calc(-1 * var(--sidebar-width));
  }

  // Push content to the right only for md and up
  @include media-breakpoint-up(md) {
    & {
      margin-left: 0;
    }

    & + .wrapper {
      padding-left: var(--sidebar-width);
    }

    // .show is the opposite meaning for md and up
    // it means the sidebar is collapsed
    &.show {
      margin-left: calc(-1 * var(--sidebar-width));

        & + .wrapper {
          padding-left: calc(-1 * var(--sidebar-width));
        }
    }
  }

  // Sidebar narrow styling, only for md and up
  @include media-breakpoint-up(md) {
    &.sidebar-narrow {
      .sidebar-toggler {
        .sidebar-toggler-chevron {
          transform: rotate(180deg);
        }
      }

      &:not(:hover) {
        --sidebar-width: 4rem;

        .sidebar-brand {
          .sidebar-brand-full {
            display: none !important;
          }

          .sidebar-brand-narrow {
            display: flex !important;
          }
        }

        .nav-title, .nav-group-items {
          display: none;
        }

        & + .wrapper {
          --sidebar-width: 4rem;
        }

        .nav-link {
          white-space: nowrap;
        }
      }
    }
  }
}

.sidebar-overlay {
  z-index: $sidebar-overlay-z-index;

  @include media-breakpoint-up(md) {
    display: none;
  }
}
```

### themes/

#### themes/enum.ts
*Language: TypeScript | Size: 75 bytes*

```typescript
export enum Theme {
  Light = 'light',
  Dark = 'dark',
  Auto = 'auto',
}
```

#### themes/theme.ts
*Language: TypeScript | Size: 601 bytes*

```typescript
import 'server-only'

import { cookies } from 'next/headers'
import { Theme } from '@/themes/enum'

export const getPreferredTheme = () => {
  const preferredThemeCookies = (cookies().get('preferred_theme')?.value ?? Theme.Auto) as Theme

  if (!Object.values(Theme).includes(preferredThemeCookies)) {
    return Theme.Auto
  }

  return preferredThemeCookies
}

export default function getTheme() {
  const themeCookies = (cookies().get('theme')?.value ?? Theme.Light) as Theme

  if (themeCookies !== Theme.Light && themeCookies !== Theme.Dark) {
    return Theme.Light
  }

  return themeCookies
}
```

### types/

#### types/next.d.ts
*Language: TypeScript | Size: 79 bytes*

```typescript
export type SearchParams = {
  [key: string]: string | string[] | undefined;
}
```

### utils/

#### utils/api_client.ts
*Language: TypeScript | Size: 2823 bytes*

```typescript
'use server'
import { t } from 'i18next'
import { authOptions } from "@/app/api/auth/option"
import { getServerSession } from "next-auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:18080'

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const session = await getServerSession(authOptions)

  if (!session) {
    console.log('No session found')
    throw new ApiError(401, t('error.unauthorized'))
  } else {
  }

  const token = session?.accessToken

  const { requiresAuth = true, ...fetchOptions } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

  const url = `${API_BASE_URL}${endpoint}`
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers,
    })
   
    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, try to refresh
        const refreshed = await refreshToken()
        if (refreshed) {
          // Retry the request with new token
          return apiClient(endpoint, options)
        }
        // Redirect to login
        window.location.href = '/login'
        throw new ApiError(401, 'Unauthorized')
      }

      const error = await response.json().catch(() => ({}))
      throw new ApiError(
        response.status,
        error.message || `HTTP Error: ${response.status}`
      )
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }

    return response as unknown as T
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(0, 'Network error')
  }
}

async function refreshToken(): Promise<boolean> {
  try {
    const cookieStore = cookies()
const refreshToken = cookieStore.get('refresh_token')?.value
    if (!refreshToken) {
      return false
    }

    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (!response.ok) {
      return false
    }

    const data = await response.json()
    console.log('Token refreshed:', data)
    cookieStore.set('access_token', data.token)
    if (data.expire) {
      cookieStore.set('token_expire', data.expire)
    }

    return true
  } catch {
    return false
  }
}

export { apiClient, ApiError }
```

#### utils/server-fetch.ts
*Language: TypeScript | Size: 1666 bytes*

```typescript
import 'server-only'

type FetchArguments = Parameters<typeof fetch>;

class RetryableError extends Error {
}

/**
 * Fetch wrapper for server side use only.
 * Implemented retries and timeout.
 *
 * @param args
 */
export default async function serverFetch(...args: FetchArguments): Promise<Response> {
  let retryCount = 0
  const maxRetries = 3
  const timeout = 30_000 // 30 seconds
  let success = false

  while (retryCount < maxRetries && !success) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const response = await fetch(
        args[0],
        { ...args[1], signal: AbortSignal.timeout(timeout) },
      )

      if (!response.ok) {
        const statusCode = response.status

        // Retry only on specific HTTP status codes indicating network issues
        if (
          (statusCode >= 500 && statusCode <= 599) // Server errors
          || statusCode === 408 // Request timeout
          || statusCode === 429 // Too many requests
          || statusCode === 0 // Network error or CORS policy blocking
        ) {
          retryCount += 1
          throw new RetryableError(`Network-related error occurred (Status: ${statusCode}).`)
        }

        throw new Error(`HTTP error! Status: ${statusCode}`)
      }

      success = true
      return response
    } catch (error) {
      if (error instanceof RetryableError) {
        // eslint-disable-next-line no-continue
        continue
      }

      if ((error as Error).name === 'TimeoutError') {
        throw new Error('Fetch request timeout error.')
      }

      throw error
    }
  }

  throw new Error('Maximum number of retries reached without success.')
}
```

### zod/

#### zod/zod.ts
*Language: TypeScript | Size: 5411 bytes*

```typescript
import i18next from 'i18next'
import enTranslation from 'zod-i18n-map/locales/en/zod.json'
import { makeZodI18nMap } from 'zod-i18n-map'
import { z } from 'zod'
import { getLocale } from '@/locales/dictionary'

const viTranslation = {
  errors: {
    invalid_type: "Kiểu dữ liệu không hợp lệ. Mong đợi {{expected}}, nhận được {{received}}",
    invalid_type_received_undefined: "Bắt buộc",
    invalid_type_received_null: "Bắt buộc",
    invalid_literal: "Giá trị không hợp lệ, mong đợi {{expected}}",
    unrecognized_keys: "Khóa không được nhận dạng trong đối tượng: {{keys}}",
    invalid_union: "Đầu vào không hợp lệ",
    invalid_union_discriminator: "Giá trị phân biệt không hợp lệ. Mong đợi {{options}}",
    invalid_enum_value: "Giá trị enum không hợp lệ. Mong đợi {{options}}, nhận được '{{received}}'",
    invalid_arguments: "Đối số của hàm không hợp lệ",
    invalid_return_type: "Kiểu trả về của hàm không hợp lệ",
    invalid_date: "Ngày không hợp lệ",
    custom: "Đầu vào không hợp lệ",
    invalid_intersection_types: "Không thể hợp nhất kết quả giao nhau",
    not_multiple_of: "Số phải là bội số của {{multipleOf}}",
    not_finite: "Số phải là hữu hạn",
    invalid_string: {
      email: "Email không hợp lệ",
      url: "URL không hợp lệ",
      emoji: "Emoji không hợp lệ",
      uuid: "UUID không hợp lệ",
      cuid: "CUID không hợp lệ",
      cuid2: "CUID2 không hợp lệ",
      ulid: "ULID không hợp lệ",
      regex: "Không hợp lệ",
      datetime: "Datetime không hợp lệ",
      startsWith: "Đầu vào phải bắt đầu với \"{{startsWith}}\"",
      endsWith: "Đầu vào phải kết thúc bằng \"{{endsWith}}\"",
    },
    too_small: {
      array: {
        exact: "Mảng phải chứa chính xác {{minimum}} phần tử",
        inclusive: "Mảng phải chứa ít nhất {{minimum}} phần tử",
        not_inclusive: "Mảng phải chứa nhiều hơn {{minimum}} phần tử",
      },
      string: {
        exact: "Chuỗi phải chứa chính xác {{minimum}} ký tự",
        inclusive: "Chuỗi phải chứa ít nhất {{minimum}} ký tự",
        not_inclusive: "Chuỗi phải chứa nhiều hơn {{minimum}} ký tự",
      },
      number: {
        exact: "Số phải bằng {{minimum}}",
        inclusive: "Số phải lớn hơn hoặc bằng {{minimum}}",
        not_inclusive: "Số phải lớn hơn {{minimum}}",
      },
      set: {
        exact: "Đầu vào không hợp lệ",
        inclusive: "Đầu vào không hợp lệ",
        not_inclusive: "Đầu vào không hợp lệ",
      },
      date: {
        exact: "Ngày phải bằng {{minimum, datetime}}",
        inclusive: "Ngày phải lớn hơn hoặc bằng {{minimum, datetime}}",
        not_inclusive: "Ngày phải lớn hơn {{minimum, datetime}}",
      },
    },
    too_big: {
      array: {
        exact: "Mảng phải chứa chính xác {{maximum}} phần tử",
        inclusive: "Mảng phải chứa nhiều nhất {{maximum}} phần tử",
        not_inclusive: "Mảng phải chứa ít hơn {{maximum}} phần tử",
      },
      string: {
        exact: "Chuỗi phải chứa chính xác {{maximum}} ký tự",
        inclusive: "Chuỗi phải chứa nhiều nhất {{maximum}} ký tự",
        not_inclusive: "Chuỗi phải chứa ít hơn {{maximum}} ký tự",
      },
      number: {
        exact: "Số phải bằng {{maximum}}",
        inclusive: "Số phải nhỏ hơn hoặc bằng {{maximum}}",
        not_inclusive: "Số phải nhỏ hơn {{maximum}}",
      },
      set: {
        exact: "Đầu vào không hợp lệ",
        inclusive: "Đầu vào không hợp lệ",
        not_inclusive: "Đầu vào không hợp lệ",
      },
      date: {
        exact: "Ngày phải bằng {{maximum, datetime}}",
        inclusive: "Ngày phải nhỏ hơn hoặc bằng {{maximum, datetime}}",
        not_inclusive: "Ngày phải nhỏ hơn {{maximum, datetime}}",
      },
    },
  },
  validations: {
    email: "Email không hợp lệ",
    url: "URL không hợp lệ",
    uuid: "UUID không hợp lệ",
    cuid: "CUID không hợp lệ",
    regex: "Không hợp lệ",
    datetime: "Datetime không hợp lệ",
  },
  types: {
    function: "hàm",
    number: "số",
    string: "chuỗi",
    nan: "nan",
    integer: "số nguyên",
    float: "số thực",
    boolean: "boolean",
    date: "ngày",
    bigint: "bigint",
    undefined: "undefined",
    symbol: "symbol",
    null: "null",
    array: "mảng",
    object: "đối tượng",
    unknown: "không xác định",
    promise: "promise",
    void: "void",
    never: "never",
    map: "map",
    set: "set",
  },
}

const vi = i18next.createInstance()
vi.init({
  lng: 'vi',
  resources: {
    vi: { zod: viTranslation },
  },
})

const en = i18next.createInstance()
en.init({
  lng: 'en',
  resources: {
    en: { zod: enTranslation },
  },
})


const zodMap = {
  en: makeZodI18nMap({ t: en.t }),
  vi: makeZodI18nMap({ t: vi.t }),
}

// Set zod error map by user's locale.
// The error message should be translated based on user's locale.
z.setErrorMap((err, ctx) => zodMap[getLocale()](err, ctx))

export { z }
```

