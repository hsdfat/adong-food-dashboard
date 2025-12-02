// app/(dashboard)/dishes/[id]/recipe-standard/page.tsx

'use client'

import React, { useState } from 'react'
import { Card, CardBody, CardHeader, ButtonGroup, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import RecipeStandardsList from '@/components/Page/RecipeStandard/RecipeStandardsList'
import DishRecipeVariantsView from '@/components/Page/RecipeStandard/DishRecipeVariantsView'
import useDictionary from '@/locales/dictionary-hook'

export default function Page({ params }: { params: { id: string } }) {
  const dict = useDictionary()
  const [viewMode, setViewMode] = useState<'variants' | 'list'>('variants')

  return (
    <Card>
      <CardHeader>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h4>{dict.recipe_standards?.title || 'Recipe Standards'}</h4>
            <div className="text-muted">
              {dict.recipe_standards?.description ||
                'Manage ingredient quantities for this dish'}
            </div>
          </div>
          <ButtonGroup>
            <Button
              variant={viewMode === 'variants' ? 'primary' : 'outline-primary'}
              onClick={() => setViewMode('variants')}
              title="Variants View"
            >
              <FontAwesomeIcon icon={faLayerGroup} className="me-2" />
              <span className="d-none d-sm-inline">Variants</span>
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <FontAwesomeIcon icon={faList} className="me-2" />
              <span className="d-none d-sm-inline">List</span>
            </Button>
          </ButtonGroup>
        </div>
      </CardHeader>
      <CardBody>
        {viewMode === 'variants' ? (
          <DishRecipeVariantsView dishId={params.id} />
        ) : (
          <RecipeStandardsList dishId={params.id} />
        )}
      </CardBody>
    </Card>
  )
}
