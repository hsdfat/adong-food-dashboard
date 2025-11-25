// import 'server-only'
import Cookies from 'js-cookie'
import { defaultLocale } from '@/locales/config'

const dictionaries = {
  en: () => import('./en/lang.json').then((module) => module.default),
  vi: () => import('./vi/lang.json').then((module) => module.default),
}

type Locale = keyof typeof dictionaries

export const getLocales = () => Object.keys(dictionaries) as Array<Locale>

export const getLocale = (localeCookie?: string): Locale => {
  // Check if running in browser
  if (typeof window !== 'undefined') {
    const cookie = localeCookie || Cookies.get('locale')

    if (cookie && getLocales().includes(cookie as Locale)) {
      return cookie as Locale
    }
  } else if (localeCookie && getLocales().includes(localeCookie as Locale)) {
    // Server-side: check cookies from headers
    return localeCookie as Locale
  }

  // Server-side or fallback
  return defaultLocale
}

export const getDictionary = async (localeCookie?: string) => {
  const locale = getLocale(localeCookie)
  return dictionaries[locale]()
}
