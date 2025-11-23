# Common Components

This directory contains reusable components for master data pages and common UI patterns.

## Components

### 1. ActionButton

A reusable button component with loading state support.

**Location:** `src/components/Common/ActionButton/`

**Usage:**
```tsx
import ActionButton from '@/components/Common/ActionButton'
import { faSave } from '@fortawesome/free-solid-svg-icons'

<ActionButton
  variant="primary"
  size="sm"
  loading={isLoading}
  icon={faSave}
  onClick={handleClick}
  loadingLabel="Saving..."
>
  Save
</ActionButton>
```

**Props:**
- `variant`: Button variant (primary, secondary, success, danger, etc.)
- `size`: Button size (sm, lg)
- `loading`: Show loading spinner
- `disabled`: Disable button
- `icon`: FontAwesome icon
- `loadingLabel`: Text to show when loading
- `onClick`: Click handler
- `type`: Button type (button, submit, reset)

### 2. SaveButton

A specialized button for form submissions with loading state.

**Location:** `src/components/Common/SaveButton/`

**Usage:**
```tsx
import SaveButton from '@/components/Common/SaveButton'

<SaveButton
  loading={isSubmitting}
  submittingLabel="Saving..."
  submitLabel="Save"
/>
```

**Props:**
- Extends `ActionButtonProps` (except variant, children, loadingLabel)
- `loading`: Show loading state
- `submittingLabel`: Text when submitting (defaults to dictionary)
- `submitLabel`: Text when not submitting (defaults to dictionary)

### 3. LoadingState

A reusable loading component with spinner.

**Location:** `src/components/Common/LoadingState/`

**Usage:**
```tsx
import LoadingState, { LoadingStateCard } from '@/components/Common/LoadingState'

// Simple loading state
<LoadingState message="Loading data..." />

// Loading state in a card
<LoadingStateCard message="Loading..." fullHeight />
```

**Props:**
- `message`: Loading message text
- `fullHeight`: Make container full height
- `size`: Spinner size (sm, lg)
- `className`: Additional CSS classes

### 4. MasterDataListPage

A complete list page component for master data with search, pagination, and actions.

**Location:** `src/components/Common/MasterDataListPage/`

**Usage:**
```tsx
import MasterDataListPage from '@/components/Common/MasterDataListPage'
import { TableColumn, TableAction } from '@/components/Common/MasterDataTable/MasterDataTable'

const columns: TableColumn[] = [
  { key: 'id', label: 'ID', align: 'left' },
  { key: 'name', label: 'Name', align: 'left' },
]

const actions: TableAction[] = [
  {
    label: 'Edit',
    onClick: async (item) => router.push(`/items/${item.id}/edit`),
  },
  {
    label: 'Delete',
    variant: 'danger',
    onClick: async () => {}, // Handled automatically if onDelete is provided
  },
]

<MasterDataListPage<ItemType>
  title="Item Management"
  addNewLabel="Add New Item"
  createPath="/items/create"
  searchPlaceholder="Search items..."
  emptyMessage="No items found"
  columns={columns}
  actions={actions}
  data={data}
  loading={loading}
  error={error}
  onLoadData={loadData}
  onDelete={handleDelete}
  onError={setError}
  getItemName={(item) => item.name}
  getItemId={(item) => item.id}
  basePath="/items"
  dictKey="items"
/>
```

**Props:**
- `title`: Page title
- `addNewLabel`: Label for "Add New" button
- `createPath`: Path to create page
- `searchPlaceholder`: Search input placeholder
- `emptyMessage`: Message when no data
- `loadingMessage`: Message when loading
- `columns`: Table column definitions
- `actions`: Table action definitions
- `data`: Resource collection data
- `loading`: Loading state
- `error`: Error message
- `onLoadData`: Function to load data (page, perPage, search)
- `onDelete`: Optional delete handler
- `onError`: Error handler
- `getItemName`: Function to get item name for messages
- `getItemId`: Function to get item ID
- `basePath`: Base path for routing
- `dictKey`: Dictionary key for translations

### 5. MasterDataFormPage

A complete form page component with error/success handling and buttons.

**Location:** `src/components/Common/MasterDataFormPage/`

**Usage:**
```tsx
import MasterDataFormPage from '@/components/Common/MasterDataFormPage'

<MasterDataFormPage
  title="Add New Item"
  onSubmit={handleSubmit}
  cancelPath="/items"
  loading={isSubmitting}
  error={error}
  success={success}
>
  <FormGroup className="mb-3">
    <FormLabel>Name</FormLabel>
    <FormControl
      type="text"
      name="name"
      value={formData.name}
      onChange={handleChange}
      required
    />
  </FormGroup>
  {/* More form fields */}
</MasterDataFormPage>
```

**Props:**
- `title`: Form title
- `children`: Form fields (FormGroup components)
- `onSubmit`: Submit handler
- `onCancel`: Optional cancel handler
- `cancelPath`: Path to navigate on cancel
- `loading`: Loading state
- `error`: Error message
- `success`: Success message
- `submitLabel`: Submit button label
- `cancelLabel`: Cancel button label
- `className`: Additional CSS classes

## Example Refactoring

See example refactored components:
- `src/components/Page/Ingredient/IngredientList.refactored.example.tsx`
- `src/components/Page/Ingredient/IngredientForm.refactored.example.tsx`

These examples show how to refactor existing components to use the common components.

### 6. SingleSelectionModal

A reusable modal component for selecting a single object from a list.

**Location:** `src/components/Common/SingleSelectionModal/`

**Usage:**
```tsx
import SingleSelectionModal from '@/components/Common/SingleSelectionModal'

<SingleSelectionModal
  show={showModal}
  onHide={() => setShowModal(false)}
  title="Select Kitchen"
  items={kitchens.map(k => ({
    id: k.kitchenId,
    name: k.kitchenName,
    subtitle: k.address,
    badge: k.kitchenId,
  }))}
  searchValue={search}
  onSearchChange={setSearch}
  selectedId={selectedId}
  onSelect={(item) => {
    setSelectedId(item.id)
    // Handle selection
  }}
  searchPlaceholder="Search kitchens..."
  emptyMessage="No kitchens found"
/>
```

**Props:**
- `show`: Whether modal is visible
- `onHide`: Function to close modal
- `title`: Modal title
- `items`: Array of items to select from (must have `id` and `name`)
- `searchValue`: Current search value
- `onSearchChange`: Search change handler
- `selectedId`: Currently selected item ID
- `onSelect`: Selection handler (receives selected item)
- `searchPlaceholder`: Search input placeholder
- `emptyMessage`: Message when no items found
- `closeLabel`: Close button label
- `getItemName`: Custom function to get item name (default: `item.name`)
- `getItemSubtitle`: Custom function to get item subtitle
- `getItemBadge`: Custom function to get item badge
- `renderItem`: Custom render function for items
- `size`: Modal size ('sm', 'lg', 'xl')

### 7. MultiSelectionModal

A reusable modal component for selecting multiple objects with checkboxes.

**Location:** `src/components/Common/MultiSelectionModal/`

**Usage:**
```tsx
import MultiSelectionModal from '@/components/Common/MultiSelectionModal'

<MultiSelectionModal
  show={showModal}
  onHide={() => setShowModal(false)}
  title="Select Dishes"
  items={dishes.map(d => ({
    id: d.dishId,
    name: d.dishName,
    subtitle: `${d.ingredientCount} ingredients`,
    badge: d.dishId,
  }))}
  searchValue={search}
  onSearchChange={setSearch}
  selectedIds={selectedIds}
  onSelect={(itemId, checked) => {
    if (checked) {
      setSelectedIds([...selectedIds, itemId])
    } else {
      setSelectedIds(selectedIds.filter(id => id !== itemId))
    }
  }}
  onConfirm={handleAddDishes}
  searchPlaceholder="Search dishes..."
  emptyMessage="No dishes found"
  confirmLabel={`Add ${selectedIds.length} dishes`}
  additionalFields={
    <FormGroup>
      <FormLabel>Portions:</FormLabel>
      <FormControl
        type="number"
        value={portions}
        onChange={(e) => setPortions(parseInt(e.target.value))}
      />
    </FormGroup>
  }
/>
```

**Props:**
- `show`: Whether modal is visible
- `onHide`: Function to close modal
- `title`: Modal title
- `items`: Array of items to select from (must have `id` and `name`)
- `searchValue`: Current search value
- `onSearchChange`: Search change handler
- `selectedIds`: Array of selected item IDs
- `onSelect`: Selection handler (receives itemId and checked state)
- `onConfirm`: Confirm button handler
- `searchPlaceholder`: Search input placeholder
- `emptyMessage`: Message when no items found
- `closeLabel`: Close button label
- `confirmLabel`: Confirm button label
- `selectedCountLabel`: Label showing selected count
- `getItemName`: Custom function to get item name
- `getItemSubtitle`: Custom function to get item subtitle
- `getItemBadge`: Custom function to get item badge
- `renderItem`: Custom render function for items
- `additionalFields`: Additional form fields to show when items are selected
- `size`: Modal size ('sm', 'lg', 'xl')
- `confirmVariant`: Button variant for confirm button
- `selectedHighlightClass`: CSS class for selected items

## Benefits

1. **Consistency**: All master data pages have the same look and feel
2. **Less Code**: Reduce boilerplate code significantly
3. **Maintainability**: Update common functionality in one place
4. **Type Safety**: Full TypeScript support
5. **Reusability**: Easy to create new master data pages
6. **Modal Components**: Reusable modals for object selection reduce duplication

## Migration Guide

To refactor an existing master data list page:

1. Replace the entire component with `MasterDataListPage`
2. Extract the data loading logic into a function that matches `onLoadData` signature
3. Define columns and actions as before
4. Provide the required props

To refactor an existing form page:

1. Wrap form fields with `MasterDataFormPage`
2. Move error/success alerts to props
3. Remove manual button code (handled by component)
4. Keep form field definitions as children

