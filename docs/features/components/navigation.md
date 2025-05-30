# Navigation System

This page documents the navigation system in the Living Abroad Budget application.

## Overview

The navigation system consists of several key components that work together:

1. **Router Structure**: Next.js 13+ App Router configuration
2. **Sidebar Component**: Main navigation menu
3. **AppLayout**: Container layout that includes the sidebar
4. **Navigation Hooks**: Custom hooks for accessing and manipulating navigation state
5. **Breadcrumbs**: Progress indicators for multi-step processes

## Router Structure

The application uses Next.js App Router with the following key organization:

```
src/app/
├── (authenticated)/       # Route group for authenticated pages
│   ├── dashboard/        # Dashboard page
│   ├── profile/          # Profile page
│   ├── scenarios/        # Scenarios list
│   │   └── [id]/         # Individual scenario view/edit 
│   └── layout.tsx        # Shared authenticated layout
├── layout.tsx            # Root layout with StoreProvider
└── page.tsx              # Landing page
```

## Sidebar Component

The Sidebar component provides the main navigation menu.

### Implementation

```tsx
// src/components/layout/Sidebar.tsx
export const Sidebar: React.FC<SidebarProps> = ({ 
  className 
}) => {
  const { activeView, sidebarOpen, toggleSidebar } = useNavigation();
  
  return (
    <div className={clsx(
      "h-screen bg-base-200 transition-all duration-300",
      sidebarOpen ? "w-64" : "w-16",
      "fixed left-0 top-0 z-10 flex flex-col shadow-lg",
      className
    )}>
      {/* Sidebar header */}
      <div className="flex h-16 items-center justify-between px-4">
        <a href="/" className="text-xl font-bold">
          {sidebarOpen ? "Living Abroad" : "LA"}
        </a>
        <button 
          className="btn btn-ghost btn-sm" 
          onClick={toggleSidebar}
          aria-label="Collapse sidebar"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
      </div>
      
      {/* Navigation links */}
      <nav className="mt-5 flex-1 px-2">
        <ul className="space-y-2">
          {NAVIGATION_ITEMS.map((item) => (
            <SidebarItem 
              key={item.path}
              item={item}
              isActive={activeView === item.id}
              isCollapsed={!sidebarOpen}
            />
          ))}
        </ul>
      </nav>
      
      {/* Footer area */}
      <div className="mt-auto p-4">
        <div className="text-xs text-base-content/70">
          <p>Living Abroad Budget v0.1</p>
        </div>
      </div>
    </div>
  );
};
```

## AppLayout

The AppLayout component serves as a wrapper for authenticated pages, incorporating the Sidebar.

```tsx
// src/components/layout/AppLayout.tsx
export const AppLayout: React.FC<AppLayoutProps> = ({ 
  children 
}) => {
  const { sidebarOpen } = useNavigation();
  
  return (
    <div className="min-h-screen flex bg-base-100">
      {/* Sidebar navigation */}
      <Sidebar />
      
      {/* Main content area */}
      <main className={clsx(
        "flex-1 transition-all duration-300",
        sidebarOpen ? "ml-64" : "ml-16"
      )}>
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};
```

## Navigation Hooks

The application uses custom hooks to access navigation state from the Zustand store.

### useNavigation Hook

```tsx
/**
 * Hook to access navigation state
 * @returns Navigation-related UI state and actions
 */
export const useNavigation = () => {
  const state = useStore();
  
  try {
    return {
      activeView: state?.ui?.activeView || 'home',
      sidebarOpen: state?.ui?.sidebarOpen || true,
      setActiveView: state?.ui?.setActiveView || (() => console.warn('UI state not initialized')),
      toggleSidebar: state?.ui?.toggleSidebar || (() => console.warn('UI state not initialized')),
    };
  } catch (error) {
    console.error('Error in useNavigation hook:', error);
    // Return safe defaults
    return {
      activeView: 'home',
      sidebarOpen: true,
      setActiveView: () => console.warn('UI state not initialized'),
      toggleSidebar: () => console.warn('UI state not initialized'),
    };
  }
};
```

### Hook Error Prevention

To prevent "Cannot read properties of undefined" errors, the hooks implement several safety measures:

1. **Optional Chaining**: Using `?.` notation to safely access potentially undefined properties
2. **Default Values**: Providing fallback values when properties are undefined
3. **Try/Catch Blocks**: Catching and handling any runtime errors gracefully
4. **Error Logging**: Logging issues to the console for debugging

## Breadcrumbs

The Breadcrumbs component shows the user's progress through multi-step wizards.

```tsx
export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  steps,
  currentStep,
  onStepClick
}) => {
  return (
    <div className="flex items-center space-x-2">
      {steps.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <React.Fragment key={step.id}>
            {index > 0 && (
              <div className="h-px w-4 bg-base-300" />
            )}
            <button
              className={clsx(
                "flex h-8 w-8 items-center justify-center rounded-full",
                isActive && "bg-primary text-primary-content",
                isCompleted && "bg-success text-success-content",
                !isActive && !isCompleted && "bg-base-300 text-base-content"
              )}
              disabled={!isCompleted && !isActive}
              onClick={() => onStepClick?.(index)}
            >
              {isCompleted ? (
                <CheckIcon className="h-4 w-4" />
              ) : (
                <span>{index + 1}</span>
              )}
            </button>
          </React.Fragment>
        );
      })}
    </div>
  );
};
```

## Store Initialization

The application uses a StoreProvider component to ensure proper initialization of the store, including the UI slice that powers navigation.

```tsx
// src/store/StoreProvider.tsx
export function StoreProvider({ children }: StoreProviderProps) {
  // Force initialization of the store on the client
  const store = useStore();
  
  // Ensure core state is initialized properly
  useEffect(() => {
    // Ensure UI slice is properly initialized if needed
    if (!store.ui) {
      console.warn('UI slice was not properly initialized, correcting...');
      useStore.setState({
        ...store,
        ui: {
          activeView: 'home',
          sidebarOpen: true,
          theme: 'light',
          // ... action methods ...
        }
      });
    }
    
    // ... other initialization logic ...
  }, [store]);

  return <>{children}</>;
}
```

## Troubleshooting Navigation Issues

### Common Issues

1. **"Cannot read properties of undefined (reading 'X')"**:
   - This occurs when trying to access properties on an undefined object, typically during store initialization
   - Solution: Use optional chaining (`?.`) and provide default values
   
2. **Navigation state lost on page refresh**:
   - Ensure the store persistence middleware is correctly configured
   - Verify local storage is working correctly

3. **Active state not highlighting correctly**:
   - Check that the activeView value matches the route IDs in the navigation items
   - Verify the useNavigation hook is correctly selecting from the store

### Safe Hook Pattern

For all UI-related hooks, follow this safe pattern:

```tsx
export const useSomeHook = () => {
  const state = useStore();
  
  try {
    return {
      someValue: state?.someSlice?.someValue || defaultValue,
      someAction: state?.someSlice?.someAction || (() => console.warn('State not initialized')),
    };
  } catch (error) {
    console.error('Error in hook:', error);
    return {
      someValue: defaultValue,
      someAction: () => console.warn('State not initialized'),
    };
  }
};
```

This pattern ensures the application remains functional even if there are initialization issues with the store. 