'use client';

import Link from 'next/link';

interface DemoLink {
  href: string;
  label: string;
  description?: string;
}

const demoPages: DemoLink[] = [
  { href: '/components', label: 'Component Showcase', description: 'Main showcase of UI components.' },
  { href: '/components/charts', label: 'Chart Components', description: 'Specific examples of chart components.' },
  { href: '/components/interactive', label: 'Interactive Components', description: 'Examples of interactive elements like buttons, forms, etc.' },
  { href: '/demo/forex', label: 'Forex Demo', description: 'Demonstration of currency conversion and FX features.' },
  { href: '/debug', label: 'Debug Page', description: 'Page for debugging application state or features.' },
  { href: '/test', label: 'Test Page', description: 'General test page for experiments.' },
];

const utilityPages: DemoLink[] = [
  { href: '/', label: 'Home Page', description: 'Main application home page.' },
  { href: '/profile', label: 'User Profile', description: 'User profile settings page.' },
  { href: '/scenarios', label: 'Scenarios List', description: 'List of user-created scenarios.' },
  { href: '/scenarios/create', label: 'Create Scenario', description: 'Page to create a new scenario.' },
  // { href: '/scenarios/new', label: 'New Scenario (alternative)', description: 'Alternative page for new scenario creation.' }, // Assuming /scenarios/create is primary
  { href: '/dashboard', label: 'Dashboard', description: 'User dashboard page.' },
  { href: '/about', label: 'About Page', description: 'Application about page.' },
];

export default function DemoHubPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="mb-4">
        <Link href="/" className="text-blue-500 hover:text-blue-700 transition-colors">
          &larr; Return to Application Home
        </Link>
      </div>
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Developer Demo Hub</h1>
        <p className="text-lg text-gray-600 mt-2">
          A central place to access various demo pages, component showcases, and test utilities.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Primary Demos & Tests</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoPages.map((page) => (
            <Link key={page.href} href={page.href} legacyBehavior>
              <a className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out transform hover:-translate-y-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{page.label}</h3>
                {page.description && <p className="text-gray-700 text-sm">{page.description}</p>}
              </a>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2">Other Application Pages</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {utilityPages.map((page) => (
            <Link key={page.href} href={page.href} legacyBehavior>
              <a className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out transform hover:-translate-y-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{page.label}</h3>
                {page.description && <p className="text-gray-700 text-sm">{page.description}</p>}
              </a>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
} 