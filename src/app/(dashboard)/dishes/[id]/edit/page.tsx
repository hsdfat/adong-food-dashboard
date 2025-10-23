'use client'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import { notFound } from 'next/navigation'
import { dishApi } from '@/services'
import { Dish } from '@/models'
import DishForm from '@/components/Page/Dish/DishForm'
import useDictionary from '@/locales/dictionary-hook'
import { useState, useEffect } from 'react'

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

export default function Page({ params }: { params: { id: string } }) {

  const dict = useDictionary()
  const [dish, setDish] = useState<Dish | null>(null)
  const [notFoundFlag, setNotFoundFlag] = useState(false)
  
  useEffect(() => {
    const loadDish = async () => {
      const fetchedDish = await fetchDish(params.id)
      if (!fetchedDish) {
        setNotFoundFlag(true)
        return
      }
      setNotFoundFlag(false)
      setDish(fetchedDish)
    }
    loadDish()
  }, [])

  return (
    <Card>
      <CardHeader>{dict.dishes.edit}: {dish && dish.dishName}</CardHeader>
      {
        !dish ? (
          <CardBody>
            <p>{dict.dishes.loading || 'Loading...'}</p>
          </CardBody>
        ) : notFoundFlag ? (
          notFound()
        ) : (
          <CardBody>
            <DishForm dish={dish} />
          </CardBody>
        )
      }
      
    </Card>
  )
}