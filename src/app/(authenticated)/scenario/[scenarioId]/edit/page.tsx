'use client';

import React from 'react';

interface ScenarioEditPageProps {
  params: {
    scenarioId: string;
  };
}

const ScenarioEditPage: React.FC<ScenarioEditPageProps> = ({ params }) => {
  return (
    <div>
      <h1>Edit Scenario</h1>
      <p>Scenario ID: {params.scenarioId}</p>
      {/* Form to edit scenario details will go here */}
    </div>
  );
};

export default ScenarioEditPage; 