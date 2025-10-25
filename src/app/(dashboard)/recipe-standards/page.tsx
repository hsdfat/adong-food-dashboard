// app/(dashboard)/recipe-standards/page.tsx
'use client'

import React from 'react'
import { Card, CardBody, CardHeader } from 'react-bootstrap'
import RecipeStandardsList from '@/components/Page/RecipeStandard/RecipeStandardsList'
import useDictionary from '@/locales/dictionary-hook'

export default function RecipeStandardsPage() {
  const dict = useDictionary()

  return (
    <Card>
      <CardHeader>
        <h4>{dict.sidebar?.items?.recipe_standards || 'Recipe Standards'}</h4>
        <div className="text-muted">
          {dict.recipe_standards?.description ||
            'Manage ingredient quantities for dishes'}
        </div>
      </CardHeader>
      <CardBody>
        <RecipeStandardsList />
      </CardBody>
    </Card>
  )
}
