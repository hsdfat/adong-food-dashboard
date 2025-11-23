// Simple test to verify locale switching logic
// This file can be run with: node test-locale.js

// Mock the dictionary functions
const dictionaries = {
  en: () => Promise.resolve({ hello: 'Hello', welcome: 'Welcome' }),
  vi: () => Promise.resolve({ hello: 'Xin chào', welcome: 'Chào mừng' }),
}

const defaultLocale = 'vi'

const getLocales = () => Object.keys(dictionaries)

const getLocale = (localeCookie) => {
  if (localeCookie && getLocales().includes(localeCookie)) {
    return localeCookie
  }
  return defaultLocale
}

const getDictionary = async (localeCookie) => {
  const locale = getLocale(localeCookie)
  return dictionaries[locale]()
}

// Test cases
async function testLocale() {
  console.log('Testing locale switching...')

  // Test default (Vietnamese)
  const dict1 = await getDictionary()
  console.log('Default locale:', dict1)

  // Test English
  const dict2 = await getDictionary('en')
  console.log('English locale:', dict2)

  // Test Vietnamese
  const dict3 = await getDictionary('vi')
  console.log('Vietnamese locale:', dict3)

  // Test invalid locale (should fallback to default)
  const dict4 = await getDictionary('invalid')
  console.log('Invalid locale fallback:', dict4)
}

testLocale().catch(console.error)
