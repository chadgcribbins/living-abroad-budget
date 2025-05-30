/**
 * Mock for next/navigation in Jest tests.
 * This prevents errors when components use App Router hooks like useRouter, usePathname, etc.
 */

export const useRouter = jest.fn(() => ({
  push: jest.fn(),
  replace: jest.fn(),
  refresh: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  prefetch: jest.fn(),
  // Add other router properties/methods if your components use them
  pathname: '/',
  query: {},
  asPath: '/',
  basePath: '',
  isFallback: false,
  isReady: true,
  isPreview: false,
  isLocaleDomain: false,
  locale: 'en',
  locales: ['en'],
  defaultLocale: 'en',
  domainLocales: [],
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
}));

export const usePathname = jest.fn(() => '/'); // Default mock pathname

export const useSearchParams = jest.fn(() => new URLSearchParams()); // Default mock search params

// Mock other exports from next/navigation if needed by your components
// e.g., Link, redirect, notFound, etc.

export const Link = jest.fn(({ children, ...props }) => {
  // A simplified Link mock that just renders its children
  // You might need to make this more sophisticated based on your Link usage
  const { href, replace, scroll, prefetch, locale } = props;
  return <a href={typeof href === 'string' ? href : href.pathname}>{children}</a>;
});

export const redirect = jest.fn((url, type) => {
  console.log(`Mocked redirect to: ${url} (type: ${type})`);
});

export const notFound = jest.fn(() => {
  console.log('Mocked notFound() called');
  // In a real scenario, this might throw an error or set a specific state
  // that your test can assert against if you are testing notFound behavior.
}); 