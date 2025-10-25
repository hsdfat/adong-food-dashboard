// app/(dashboard)/recipe-standards/create/page.tsx
'use client'

import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import RecipeStandardForm from '@/components/Page/RecipeStandard/RecipeStandardForm'
import useDictionary from '@/locales/dictionary-hook'

export default function CreateRecipeStandardPage() {
  const dict = useDictionary()

  return (
    <Card>
      <CardHeader>
        <h4>{dict.recipe_standards?.create_title || 'Create Recipe Standard'}</h4>
        <div className="text-muted">
          {dict.recipe_standards?.create_description || 'Add ingredient quantities for a dish'}
        </div>
      </CardHeader>
      <CardBody>
        <RecipeStandardForm />
      </CardBody>
    </Card>
  )
}