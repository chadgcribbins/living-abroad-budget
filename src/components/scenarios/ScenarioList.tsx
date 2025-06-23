"use client";

import { useState, useMemo } from 'react';
import { ScenarioListItem } from '@/types/scenario';
import { ScenarioCard } from './ScenarioCard';
import { CreateScenarioModal } from './CreateScenarioModal';
import { Button, Input, Select } from '@/components/ui';
import { CountryCode } from '@/types/base';
import { COUNTRIES } from '@/utils/constants';

export interface ScenarioListProps {
  scenarios: ScenarioListItem[];
  onCreateScenario: (data: {
    name: string;
    description: string;
    destinationCountry: CountryCode;
  }) => Promise<void>;
  onDeleteScenario: (id: string) => Promise<void>;
  onDuplicateScenario: (id: string) => Promise<void>;
  onRenameScenario: (id: string, newName: string) => Promise<void>;
}

type SortOption = 'updatedAt' | 'createdAt' | 'name';

export const ScenarioList: React.FC<ScenarioListProps> = ({
  scenarios,
  onCreateScenario,
  onDeleteScenario,
  onDuplicateScenario,
  onRenameScenario,
}) => {
  console.log('ScenarioList: received scenarios prop:', scenarios);
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updatedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [countryFilter, setCountryFilter] = useState<CountryCode | ''>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'complete'>('all');

  // Filter and sort scenarios
  const filteredAndSortedScenarios = useMemo(() => {
    // First filter by search term, country, and status
    const filtered = scenarios.filter((scenario) => {
      const matchesSearch = searchTerm === '' || 
        scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (scenario.description && scenario.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCountry = countryFilter === '' || 
        scenario.destinationCountry === countryFilter;
      
      const matchesStatus = statusFilter === 'all' || 
        scenario.completionStatus === statusFilter;
      
      return matchesSearch && matchesCountry && matchesStatus;
    });

    // Then sort
    return filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else { // updatedAt
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [scenarios, searchTerm, sortBy, sortDirection, countryFilter, statusFilter]);

  // Get unique countries from all scenarios for the filter dropdown
  const uniqueCountries = useMemo(() => {
    const countries = new Set<CountryCode>();
    
    scenarios.forEach((scenario) => {
      countries.add(scenario.destinationCountry);
    });
    
    return Array.from(countries).sort();
  }, [scenarios]);

  // Toggle sort direction when sorting by the same field
  const handleSortChange = (newSortBy: SortOption) => {
    if (newSortBy === sortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortDirection('desc'); // Default to descending when changing sort field
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search input */}
          <div className="relative w-full sm:w-64">
            <Input
              type="text"
              placeholder="Search scenarios..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              onClick={() => setSearchTerm('')}
              style={{ display: searchTerm ? 'block' : 'none' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Country filter */}
          <Select 
            value={countryFilter} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCountryFilter(e.target.value as CountryCode | '')}
            className="w-full sm:w-48"
            options={[
              { value: '', label: 'All Countries' },
              ...uniqueCountries.map(country => ({ 
                value: country, 
                label: COUNTRIES[country] || country
              }))
            ]}
          />

          {/* Status filter */}
          <Select 
            value={statusFilter} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value as 'all' | 'draft' | 'complete')}
            className="w-full sm:w-48"
            options={[
              { value: 'all', label: 'All Statuses' },
              { value: 'draft', label: 'Draft' },
              { value: 'complete', label: 'Complete' },
            ]}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Sort controls */}
          <div className="join w-full sm:w-auto">
            <button 
              className={`join-item btn ${sortBy === 'updatedAt' ? 'btn-active' : ''}`}
              onClick={() => handleSortChange('updatedAt')}
            >
              Last Updated
              {sortBy === 'updatedAt' && (
                <span className="ml-1">
                  {sortDirection === 'desc' ? '↓' : '↑'}
                </span>
              )}
            </button>
            <button 
              className={`join-item btn ${sortBy === 'createdAt' ? 'btn-active' : ''}`}
              onClick={() => handleSortChange('createdAt')}
            >
              Created
              {sortBy === 'createdAt' && (
                <span className="ml-1">
                  {sortDirection === 'desc' ? '↓' : '↑'}
                </span>
              )}
            </button>
            <button 
              className={`join-item btn ${sortBy === 'name' ? 'btn-active' : ''}`}
              onClick={() => handleSortChange('name')}
            >
              Name
              {sortBy === 'name' && (
                <span className="ml-1">
                  {sortDirection === 'desc' ? '↓' : '↑'}
                </span>
              )}
            </button>
          </div>

          {/* Create new button */}
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full sm:w-auto"
          >
            Create New Scenario
          </Button>
        </div>
      </div>

      {/* Scenarios grid */}
      {filteredAndSortedScenarios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedScenarios.map((scenario) => (
            <ScenarioCard
              key={scenario.id}
              scenario={scenario}
              onDelete={onDeleteScenario}
              onDuplicate={onDuplicateScenario}
              onRename={onRenameScenario}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-base-200 rounded-lg">
          <h3 className="text-xl font-semibold mb-2">No scenarios found</h3>
          {searchTerm || countryFilter ? (
            <p className="text-gray-500">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-500">
                You haven&apos;t created any scenarios yet. Get started by creating your first one!
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                Create Your First Scenario
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Create scenario modal */}
      <CreateScenarioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={onCreateScenario}
      />
    </div>
  );
}; 