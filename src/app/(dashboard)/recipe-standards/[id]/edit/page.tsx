// app/(dashboard)/recipe-standards/[id]/edit/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader, Spinner, Alert } from 'react-bootstrap'
import { useParams } from 'next/navigation'
import RecipeStandardForm from '@/components/Page/RecipeStandard/RecipeStandardForm'
import { recipeStandardApi } from '@/services'
import { RecipeStandard } from '@/models/recipe_standard'
import useDictionary from '@/locales/dictionary-hook'

export default function EditRecipeStandardPage() {
  const params = useParams()
  const id = params?.id as string
  const dict = useDictionary()
  const [standard, setStandard] = useState<RecipeStandard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadStandard = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await recipeStandardApi.getById(parseInt(id))
        setStandard(data)
      } catch (err) {
        setError(dict.common?.load_error || 'Failed to load recipe standard')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadStandard()
    }
  }, [id])

  if (loading) {
    return (
      <Card>
        <CardBody className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">{dict.common.loading}</span>
          </Spinner>
        </CardBody>
      </Card>
    )
  }

  if (error || !standard) {
    return (
      <Card>
        <CardBody>
          <Alert variant="danger">
            {error || dict.common?.not_found || 'Recipe standard not found'}
          </Alert>
        </CardBody>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h4>{dict.recipe_standards?.edit_title || 'Edit Recipe Standard'}</h4>
        <div className="text-muted">
          {dict.recipe_standards?.edit_description ||
            'Update ingredient quantities for a dish'}
        </div>
      </CardHeader>
      <CardBody>
        <RecipeStandardForm recipeStandard={standard} isEdit />
      </CardBody>
    </Card>
  )
}
