import React from 'react';
import { PageContainer } from '@/components';

export default function AboutPage() {
  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Living Abroad Budget</h1>
        
        <div className="prose lg:prose-xl">
          <p className="lead text-xl">
            Living Abroad Budget is a modern financial planning tool designed specifically 
            for individuals and families considering international relocation.
          </p>
          
          <h2>Our Mission</h2>
          <p>
            Our mission is to make international moves financially transparent by helping users 
            create accurate budget projections that account for the complex realities of 
            relocating abroad. We believe that with the right tools, anyone can make confident 
            financial decisions about living in a new country.
          </p>
          
          <h2>Key Features</h2>
          <ul>
            <li><strong>Scenario Comparison:</strong> Create and compare multiple financial scenarios side-by-side</li>
            <li><strong>Multi-Currency Support:</strong> Budget using multiple currencies with real-time exchange rates</li>
            <li><strong>Country-Specific Considerations:</strong> Automatically adjust for country-specific costs and tax implications</li>
            <li><strong>Comprehensive Planning:</strong> Account for housing, education, healthcare, transportation, and lifestyle expenses</li>
            <li><strong>Visual Reports:</strong> Generate clear visual reports for better decision-making</li>
          </ul>
          
          <h2>Privacy & Data</h2>
          <p>
            Your data stays with you. All budget scenarios and personal information are stored locally 
            in your browser using secure local storage. We never upload or store your financial 
            information on our servers.
          </p>
          
          <h2>Open Source</h2>
          <p>
            Living Abroad Budget is an open-source project. Contributions and feedback 
            are welcome on our GitHub repository.
          </p>
        </div>
      </div>
    </PageContainer>
  );
} 