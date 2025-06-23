"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ScenarioListItem } from '@/types/scenario';
import { Card, Button, Modal } from '@/components/ui';
import { formatDistance } from 'date-fns';

interface ScenarioCardProps {
  scenario: ScenarioListItem;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  onDelete,
  onDuplicate,
  onRename,
}) => {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [newName, setNewName] = useState(scenario.name);

  // Format the updated date as relative time (e.g., "2 days ago")
  const updatedTimeAgo = formatDistance(
    new Date(scenario.updatedAt),
    new Date(),
    { addSuffix: true }
  );

  const handleViewScenario = () => {
    router.push(`/scenarios/${scenario.id}`);
  };

  const handleDeleteConfirm = () => {
    onDelete(scenario.id);
    setIsDeleteModalOpen(false);
  };

  const handleRenameConfirm = () => {
    if (newName.trim() !== '') {
      onRename(scenario.id, newName);
      setIsRenameModalOpen(false);
    }
  };

  return (
    <>
      <Card className="h-full transition-all hover:shadow-lg">
        <div className="p-6 flex flex-col h-full">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg line-clamp-1">{scenario.name}</h3>
            {/* Completion Status Badge */}
            {scenario.completionStatus === 'draft' && (
              <div className="badge badge-warning ml-2">Draft</div>
            )}
            {scenario.completionStatus === 'complete' && (
              <div className="badge badge-success ml-2">Complete</div>
            )}
            <div className="dropdown dropdown-end ml-auto">
              <label tabIndex={0} className="btn btn-ghost btn-sm btn-square">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-5 h-5 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                </svg>
              </label>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                <li><a onClick={() => setIsRenameModalOpen(true)}>Rename</a></li>
                <li><a onClick={() => onDuplicate(scenario.id)}>Duplicate</a></li>
                <li><a onClick={() => setIsDeleteModalOpen(true)} className="text-error">Delete</a></li>
              </ul>
            </div>
          </div>

          {scenario.description && (
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{scenario.description}</p>
          )}

          <div className="flex items-center mt-auto pt-4">
            <div className="flex gap-1">
              {/* Country Badges */}
              <div className="badge badge-outline">{scenario.originCountry}</div>
              <div className="badge badge-outline">{scenario.destinationCountry}</div>
            </div>
            <div className="ml-auto text-xs text-gray-500">
              Updated {updatedTimeAgo}
            </div>
          </div>

          <div className="mt-4">
            <Button onClick={handleViewScenario} className="w-full">
              View Scenario
            </Button>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Scenario"
      >
        <div className="p-4">
          <p>Are you sure you want to delete &quot;{scenario.name}&quot;? This action cannot be undone.</p>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="ghost" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" className="btn-error" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      {/* Rename Modal */}
      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        title="Rename Scenario"
      >
        <div className="p-4">
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Scenario Name</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter scenario name"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="ghost" onClick={() => setIsRenameModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameConfirm}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}; 