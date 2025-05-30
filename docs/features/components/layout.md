# Layout Components

This section documents the layout components used for page structure throughout the Living Abroad Budget application.

## PageContainer

Main page layout wrapper that provides consistent padding and max-width constraints.

### Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `children` | `ReactNode` | - | Page content |
| `className` | `string` | - | Additional CSS classes |
| `maxWidth` | `string` | `'7xl'` | Maximum width constraint |

### Example

```tsx
<PageContainer>
  <h1>Page Title</h1>
  <p>Page content goes here</p>
</PageContainer>
```

## Grid

Responsive grid system for layout.

### Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `children` | `ReactNode` | - | Grid items |
| `cols` | `number` | `12` | Number of grid columns |
| `gap` | `number` | `4` | Gap size between items |
| `className` | `string` | - | Additional CSS classes |

### Example

```tsx
<Grid cols={12} gap={4}>
  <GridItem span={6}>
    Half width on all screens
  </GridItem>
  <GridItem span={{ sm: 12, md: 6 }}>
    Full width on small screens, half width on medium and up
  </GridItem>
</Grid>
```

## GridItem

Individual item within a Grid.

### Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `children` | `ReactNode` | - | Item content |
| `span` | `number \| { sm?: number, md?: number, lg?: number, xl?: number }` | `12` | Columns to span |
| `className` | `string` | - | Additional CSS classes |

### Example

```tsx
<GridItem span={6}>
  This takes up half the grid
</GridItem>

<GridItem span={{ sm: 12, md: 6, lg: 4 }}>
  Responsive column span
</GridItem>
```

## NavBar

Navigation header with theme toggle and branding.

### Props

| Name | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `title` | `string` | `'Living Abroad Budget'` | Application title |
| `logo` | `ReactNode` | - | Logo component |
| `showThemeToggle` | `boolean` | `true` | Whether to show theme toggle |
| `children` | `ReactNode` | - | Additional navbar content |

### Example

```tsx
<NavBar title="My Application">
  <div className="flex gap-4">
    <Link href="/dashboard">Dashboard</Link>
    <Link href="/settings">Settings</Link>
  </div>
</NavBar>
``` 