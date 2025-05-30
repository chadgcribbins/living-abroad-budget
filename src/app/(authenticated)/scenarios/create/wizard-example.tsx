'use client';

import React, { useState } from 'react';
import { Breadcrumb, BreadcrumbItem } from '@/components/layout';

/**
 * Example component demonstrating how to use breadcrumbs in a multi-step wizard
 * This would typically be integrated into the scenarios create flow
 */
const WizardExample: React.FC = () => {
  // Define the steps for our wizard
  const steps = [
    { id: 'basics', label: 'Basic Info' },
    { id: 'household', label: 'Household' },
    { id: 'income', label: 'Income' },
    { id: 'expenses', label: 'Expenses' },
    { id: 'review', label: 'Review' },
  ];
  
  // Track the current step
  const [currentStep, setCurrentStep] = useState('basics');
  
  // Generate breadcrumb items based on steps and current progress
  const breadcrumbItems: BreadcrumbItem[] = steps.map((step) => {
    // Find the index of the current step and this step
    const currentIndex = steps.findIndex(s => s.id === currentStep);
    const thisIndex = steps.findIndex(s => s.id === step.id);
    
    // Determine if this step is completed, active, or upcoming
    const isCompleted = thisIndex < currentIndex;
    const isActive = step.id === currentStep;
    const isUpcoming = thisIndex > currentIndex;
    
    return {
      label: step.label,
      active: isActive,
      // Only allow navigation to completed steps
      disabled: isUpcoming,
      // Allow clicking on completed steps to go back
      onClick: isCompleted || isActive ? () => setCurrentStep(step.id) : undefined,
    };
  });

  return (
    <div className="p-4 border rounded-lg bg-base-200 mt-8">
      <h2 className="text-xl font-bold mb-4">Wizard Navigation Example</h2>
      
      <Breadcrumb items={breadcrumbItems} className="mb-6" />
      
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h3 className="card-title">Step: {currentStep}</h3>
          <p>This content would change based on the current step.</p>
          
          <div className="card-actions justify-between mt-8">
            <button
              className="btn btn-outline"
              disabled={currentStep === steps[0].id}
              onClick={() => {
                const currentIndex = steps.findIndex(s => s.id === currentStep);
                if (currentIndex > 0) {
                  setCurrentStep(steps[currentIndex - 1].id);
                }
              }}
            >
              Previous
            </button>
            
            <button
              className="btn btn-primary"
              disabled={currentStep === steps[steps.length - 1].id}
              onClick={() => {
                const currentIndex = steps.findIndex(s => s.id === currentStep);
                if (currentIndex < steps.length - 1) {
                  setCurrentStep(steps[currentIndex + 1].id);
                }
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardExample; 