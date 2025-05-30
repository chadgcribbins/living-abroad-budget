# Project Structure

This document outlines the overall structure of the Living Abroad Budget application, explaining the organization principles and key directories.

## Overview

The application follows a feature-based organization pattern, which groups code by functional features rather than by technical role. This approach provides several benefits:

- **Improved discoverability** - Related code is kept together
- **Better encapsulation** - Features can be more self-contained
- **Easier maintenance** - Changes to one feature are less likely to affect others
- **Scalability** - The application can grow by adding new features without refactoring existing code

## Directory Structure

The main source code is located in the `src/` directory with the following organization:

### Core Directories

| Directory | Purpose |
|-----------|---------|
| `src/app/` | Next.js App Router pages and layouts |
| `src/components/` | Shared UI components used across features |
| `src/features/` | Feature-based modules (each subdirectory represents a distinct feature) |
| `src/hooks/` | Custom React hooks shared across the application |
| `src/services/` | External service integrations (APIs, third-party services) |
| `src/store/` | Zustand state management (slices, selectors, actions) |
| `src/types/` | TypeScript type definitions and interfaces |
| `src/utils/` | Utility functions and helper methods |

### Feature-Based Organization

Each feature within the `src/features/` directory can contain its own:

- Components that are specific to the feature
- Hooks for feature-specific logic
- Utility functions for feature-specific operations
- Types for feature-specific data structures

Example feature structure:

```
src/features/housing/
├── components/        # UI components specific to housing
│   ├── HousingForm.tsx
│   ├── PropertyComparison.tsx
│   └── ...
├── hooks/             # Hooks specific to housing
│   ├── useHousingCalculations.ts
│   └── ...
├── utils/             # Utility functions for housing
│   ├── mortgageCalculator.ts
│   └── ...
├── types.ts           # Type definitions specific to housing
└── index.ts           # Public API of the housing feature
```

### App Router Organization

The `src/app/` directory follows Next.js App Router conventions:

- Each route segment is a directory
- `page.tsx` files define routes
- `layout.tsx` files define layouts for routes and their children
- `loading.tsx` files define loading states
- `error.tsx` files define error states
- `globals.css` defines global styles

## Styling Approach

The application uses a combination of:

- **TailwindCSS** for utility-first styling
- **DaisyUI** for component styling on top of Tailwind
- Custom theme configuration in `tailwind.config.ts`

## State Management

State management is handled using Zustand with:

- Modular store slices for different domains
- Persistence middleware for LocalStorage
- Optimized selectors for component rendering

## Testing Strategy

The testing approach includes:

- Component tests with React Testing Library
- Tests are co-located with their components in `__tests__` directories
- Jest is configured for running tests

## Recommended Development Practices

When contributing to this project:

1. **Keep features isolated** - New functionality should be added as a feature in the features directory
2. **Shared components** - Extract components that will be used across features to the shared components directory
3. **Type everything** - Use TypeScript types for all code to catch issues early
4. **Test as you develop** - Write tests alongside your components and features
5. **Document public APIs** - Document the purpose and usage of components, hooks, and utilities 