# UI Component Library

The Living Abroad Budget application uses a comprehensive UI component library built with React, TypeScript, TailwindCSS, and DaisyUI. The components are designed to be reusable, flexible, and consistent across the application.

## Component Structure

The component library is organized into the following sections:

- **UI Components**: Basic UI elements (buttons, inputs, cards)
- **Layout Components**: Page structure components (grids, containers)
- **Navigation Components**: Sidebar, breadcrumbs, and routing components
- **Form Components**: Form-specific components
- **Chart Components**: Financial visualization components

## Live Examples

You can view interactive examples of these components in the application:

- [Basic UI Components](/components/)
- [Interactive Components](/components/interactive)
- [Chart Components](/components/charts)

## Component Categories

- [UI Components](./components/ui.md)
- [Layout Components](./components/layout.md)
- [Navigation Components](./components/navigation.md)
- [Form Components](./components/form.md)
- [Chart Components](./components/charts.md)

## Theme Support

The component library uses DaisyUI's theming system. The default themes are:

- `light`: Light theme
- `dark`: Dark theme

Use the `ThemeToggle` component to allow users to switch between themes.

## Responsive Design

All components are designed to be responsive. The grid system and many components have built-in responsive behavior.

## Accessibility

Components are built with accessibility in mind, including proper labeling, ARIA attributes, and keyboard navigation. 

## Icon Integration

Icons are provided via [Iconify](https://iconify.design/) and integrated into Tailwind CSS using the [`@egoist/tailwindcss-icons`](https://github.com/egoist/tailwindcss-icons) plugin.

- **Setup**: 
  - Install `@egoist/tailwindcss-icons` and the desired icon collections (e.g., `@iconify-json/lucide`).
  - Configure `tailwind.config.ts`:
    ```typescript
    // tailwind.config.ts
    import { iconsPlugin, getIconCollections } from "@egoist/tailwindcss-icons";

    export default {
      // ... other config
      plugins: [
        require('daisyui'), // Or your preferred way of importing daisyui
        iconsPlugin({
          collections: getIconCollections(["lucide"] // Add other collections as needed
        }),
      ],
    };
    ```
- **Usage**: Icons can be used in components with a specific class pattern: `i-{collection}-{icon-name}`.
  ```html
  <span class="i-lucide-home w-4 h-4"></span> 
  ```
  The `w-4 h-4` (or other sizing utilities) are typically needed to control the icon dimensions.

- **Troubleshooting Notes**:
  - Initial attempts to use `@iconify/tailwind` resulted in build errors (`TypeError: Cannot read properties of undefined (reading 'call')`). Switching to `@egoist/tailwindcss-icons` resolved these build issues and enabled icon rendering.
  - Ensure that your `tailwind.config.ts` is correctly processed. Linter errors regarding `require()` or incorrect ES module imports for Tailwind plugins can indicate deeper issues with how JITI (Tailwind's config loader) handles the file.
  - If icons don't appear, verify that the correct icon collection (e.g., `@iconify-json/lucide`) is installed and specified in the `iconsPlugin` configuration.
  - Clearing the `.next` directory and performing a hard browser refresh can sometimes resolve caching issues that might prevent icons or styles from updating.
  - Sporadic `SyntaxError: Invalid or unexpected token` in compiled `layout.js` files can sometimes occur due to complex interactions in the build process; these may resolve after cache clearing or further isolating problematic plugins. 