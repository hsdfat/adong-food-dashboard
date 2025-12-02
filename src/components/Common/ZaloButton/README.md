# ZaloButton Component

A reusable button component for opening Zalo links in a new tab.

## Features

- Opens Zalo links in a new tab with security attributes (noopener, noreferrer)
- Customizable variant, size, and styling
- Optional Zalo icon (FontAwesome comment-dots icon)
- Disabled state support
- Custom button text or default "Mở Zalo"

## Usage

### Basic Usage

```tsx
import ZaloButton from '@/components/Common/ZaloButton'

// Simple usage with default text "Mở Zalo"
<ZaloButton zaloLink="https://zalo.me/0123456789" />
```

### Custom Text

```tsx
// With custom text
<ZaloButton zaloLink="https://zalo.me/0123456789">
  Liên hệ qua Zalo
</ZaloButton>
```

### Different Variants

```tsx
// Primary variant
<ZaloButton
  zaloLink="https://zalo.me/0123456789"
  variant="primary"
>
  Chat Zalo
</ZaloButton>

// Success variant
<ZaloButton
  zaloLink="https://zalo.me/0123456789"
  variant="success"
>
  Zalo Supplier
</ZaloButton>

// Outline variant
<ZaloButton
  zaloLink="https://zalo.me/0123456789"
  variant="outline-info"
>
  Zalo
</ZaloButton>
```

### Different Sizes

```tsx
// Small button
<ZaloButton
  zaloLink="https://zalo.me/0123456789"
  size="sm"
/>

// Large button
<ZaloButton
  zaloLink="https://zalo.me/0123456789"
  size="lg"
/>
```

### Without Icon

```tsx
// Hide the Zalo icon
<ZaloButton
  zaloLink="https://zalo.me/0123456789"
  showIcon={false}
>
  Chat
</ZaloButton>
```

### Disabled State

```tsx
// Disabled button
<ZaloButton
  zaloLink="https://zalo.me/0123456789"
  disabled={true}
>
  Không khả dụng
</ZaloButton>
```

### Custom Styling

```tsx
// With custom CSS class
<ZaloButton
  zaloLink="https://zalo.me/0123456789"
  className="mt-3 w-100"
>
  Zalo Full Width
</ZaloButton>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| zaloLink | string | required | The Zalo URL to open (e.g., "https://zalo.me/0123456789") |
| variant | string | 'info' | Bootstrap button variant |
| size | 'sm' \| 'lg' | undefined | Button size |
| disabled | boolean | false | Whether the button is disabled |
| children | React.ReactNode | 'Mở Zalo' | Custom button text |
| className | string | '' | Additional CSS classes |
| showIcon | boolean | true | Whether to show the Zalo icon |

## Examples in Context

### In a Supplier Table

```tsx
<Table>
  <thead>
    <tr>
      <th>Tên NCC</th>
      <th>Số điện thoại</th>
      <th>Zalo</th>
    </tr>
  </thead>
  <tbody>
    {suppliers.map((supplier) => (
      <tr key={supplier.id}>
        <td>{supplier.name}</td>
        <td>{supplier.phone}</td>
        <td>
          {supplier.zaloLink && (
            <ZaloButton
              zaloLink={supplier.zaloLink}
              size="sm"
            />
          )}
        </td>
      </tr>
    ))}
  </tbody>
</Table>
```

### In a Contact Card

```tsx
<Card>
  <Card.Body>
    <h5>{supplier.name}</h5>
    <p>Phone: {supplier.phone}</p>
    <div className="d-flex gap-2">
      <Button variant="primary">
        <FontAwesomeIcon icon={faPhone} /> Gọi
      </Button>
      <ZaloButton zaloLink={supplier.zaloLink}>
        Chat Zalo
      </ZaloButton>
    </div>
  </Card.Body>
</Card>
```
