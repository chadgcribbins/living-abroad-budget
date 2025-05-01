import { Metadata } from 'next';
import { NextPage } from 'next';

export const metadata: Metadata = {
  title: 'Living Abroad Budget',
  description: 'A modern budgeting platform for planning international moves',
};

const Page: NextPage = () => {
  return (
    <main className="py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Living Abroad Budget</h1>
        <p className="text-xl text-gray-600">
          Plan your international move with confidence by modeling multiple financial scenarios
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Create New Scenario Card */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Create New Scenario</h2>
            <p>Start planning your international move with a new budget scenario.</p>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-primary">
                Create Scenario
              </button>
            </div>
          </div>
        </div>

        {/* Load Scenario Card */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Load Scenario</h2>
            <p>Continue working on a previously saved scenario.</p>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-secondary">
                Load Scenario
              </button>
            </div>
          </div>
        </div>

        {/* Compare Scenarios Card */}
        <div className="card bg-base-200 shadow-xl">
          <div className="card-body">
            <h2 className="card-title">Compare Scenarios</h2>
            <p>View and compare different budget scenarios side by side.</p>
            <div className="card-actions justify-end mt-4">
              <button className="btn btn-accent">
                Compare Scenarios
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
