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