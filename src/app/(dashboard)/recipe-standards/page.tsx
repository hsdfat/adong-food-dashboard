// app/(dashboard)/recipe-standards/page.tsx

'use client'

import React, { useState } from 'react'
import { Card, CardBody, CardHeader, ButtonGroup, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faList, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import RecipeStandardsList from '@/components/Page/RecipeStandard/RecipeStandardsList'
import RecipeStandardsGroupedList from '@/components/Page/RecipeStandard/RecipeStandardsGroupedList'
import useDictionary from '@/locales/dictionary-hook'

export default function RecipeStandardsPage() {
  const dict = useDictionary()
  const [viewMode, setViewMode] = useState<'grouped' | 'list'>('grouped')

  return (
    <Card>
      <CardHeader>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h4>{dict.sidebar?.items?.recipe_standards || 'Recipe Standards'}</h4>
            <div className="text-muted">
              {dict.recipe_standards?.description ||
                'Manage ingredient quantities for dishes'}
            </div>
          </div>
          <ButtonGroup>
            <Button
              variant={viewMode === 'grouped' ? 'primary' : 'outline-primary'}
              onClick={() => setViewMode('grouped')}
              title="Grouped by Dish"
            >
              <FontAwesomeIcon icon={faLayerGroup} className="me-2" />
              <span className="d-none d-sm-inline">Grouped</span>
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
        {viewMode === 'grouped' ? (
          <RecipeStandardsGroupedList />
        ) : (
          <RecipeStandardsList />
        )}
      </CardBody>
    </Card>
  )
}
