import Link from 'next/link';
import { Button } from '@/components/ui'; // Assuming Button component is available

const LandingPageContent = () => {
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center py-12 md:py-20">
      {/* Hero Section */}
      <section className="mb-16 md:mb-24 max-w-3xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
          Plan Your International Move with Confidence
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8">
          Our modern budgeting platform helps you create, compare, and analyze financial scenarios across countries and lifestyles. Understand the true &quot;felt impact&quot; of your move and make informed decisions.
        </p>
        <Link href="/dashboard" passHref>
          <Button size="lg" variant="primary" className="btn-primary">
            Get Started
          </Button>
        </Link>
      </section>

      {/* Features Overview Section */}
      <section className="w-full max-w-4xl">
        <h2 className="text-3xl font-semibold mb-10">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-base-200 rounded-lg shadow">
            {/* Icon Placeholder - e.g., using Heroicons or similar */}
            {/* <svg className="w-12 h-12 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2a4 4 0 00-4-4H3V9h2a4 4 0 004-4V3l5 4-5 4zm12 2v-2a4 4 0 00-4-4h-2V9h2a4 4 0 004-4V3l5 4-5 4z" /></svg> */}
            <h3 className="text-xl font-semibold mb-3">Compare Scenarios</h3>
            <p className="text-gray-600">
              Easily create and compare multiple financial scenarios side-by-side to see how different choices impact your budget.
            </p>
          </div>
          <div className="p-6 bg-base-200 rounded-lg shadow">
            {/* <svg className="w-12 h-12 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> */}
            <h3 className="text-xl font-semibold mb-3">Tax & Currency Insights</h3>
            <p className="text-gray-600">
              Understand tax implications (like Portugal&apos;s NHR) and see how currency fluctuations affect your finances.
            </p>
          </div>
          <div className="p-6 bg-base-200 rounded-lg shadow">
            {/* <svg className="w-12 h-12 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> */}
            <h3 className="text-xl font-semibold mb-3">Visualize Your Budget</h3>
            <p className="text-gray-600">
              Get clear visualizations of your income, expenses, and disposable income to plan effectively for your new life abroad.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPageContent; 