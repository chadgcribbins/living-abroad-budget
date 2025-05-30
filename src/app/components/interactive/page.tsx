'use client';

import React, { useState } from 'react';
import {
  Button,
  Card, 
  Modal,
  Alert,
  Tooltip,
  ToastProvider,
  useToast,
  Tabs
} from '@/components/ui';
import { Toast } from '../../../components/ui/Toast';
import Link from 'next/link';
import { PageContainer } from "@/components/layout";

// Demo component for Toast showcase
const ToastDemo = () => {
  const toast = useToast();
  
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="primary"
          onClick={() => toast.success('Successfully saved!', { duration: 3000 })}
        >
          Success Toast
        </Button>
        <Button
          variant="secondary"
          onClick={() => toast.info('Please check your email', { position: 'top-right' })}
        >
          Info Toast
        </Button>
        <Button
          variant="accent"
          onClick={() => toast.warning('Your session will expire soon', { title: 'Warning' })}
        >
          Warning Toast
        </Button>
        <Button
          variant="neutral"
          onClick={() => toast.error('Failed to save changes', { title: 'Error', showProgress: false })}
        >
          Error Toast
        </Button>
      </div>
      <Button onClick={() => toast.dismissAll()}>Dismiss All</Button>
    </div>
  );
};

const InteractiveComponentsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  const [showToast, setShowToast] = useState(false);
  
  const tabs = [
    {
      id: 'modals',
      label: 'Modals',
      content: (
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">Modal Component</h2>
          <p>Interactive modal dialog with customizable header, content, and footer.</p>
          
          <div className="flex gap-4">
            <Button 
              variant="primary" 
              onClick={() => setIsModalOpen(true)}
            >
              Open Modal
            </Button>
          </div>
          
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Example Modal"
            footer={
              <div className="flex gap-2 justify-end w-full">
                <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button variant="primary" onClick={() => setIsModalOpen(false)}>Submit</Button>
              </div>
            }
          >
            <p>This is an example modal dialog. You can customize the title, content, and footer sections.</p>
            <p className="mt-2">Click the X button or press Escape to close.</p>
          </Modal>
        </div>
      ),
    },
    {
      id: 'alerts',
      label: 'Alerts',
      content: (
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">Alert Component</h2>
          <p>Alert components for displaying important messages.</p>
          
          <div className="flex flex-col gap-4">
            <Alert 
              type="info" 
              message="This is an informational alert."
              title="Information"
            />
            
            <Alert 
              type="success" 
              message="Your changes have been saved successfully!"
              title="Success"
            />
            
            <Alert 
              type="warning" 
              message="Please review your information before continuing."
              title="Warning"
            />
            
            <Alert 
              type="error" 
              message="An error occurred while processing your request."
              title="Error"
            />
            
            {showAlert && (
              <Alert 
                type="info" 
                message="This alert can be dismissed by clicking the X button."
                isDismissible={true}
                onClose={() => setShowAlert(false)}
              />
            )}
            
            {!showAlert && (
              <Button onClick={() => setShowAlert(true)}>Show Dismissible Alert</Button>
            )}
          </div>
        </div>
      ),
    },
    {
      id: 'toasts',
      label: 'Toasts',
      content: (
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">Toast Component</h2>
          <p>Toast notifications for showing temporary messages.</p>
          
          <Card>
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold">Single Toast Example</h3>
              <Button 
                onClick={() => setShowToast(!showToast)} 
                variant="primary"
              >
                {showToast ? 'Hide Toast' : 'Show Toast'}
              </Button>
              
              <Toast
                type="success"
                title="Toast Example"
                message="This is a single toast component example."
                isVisible={showToast}
                onClose={() => setShowToast(false)}
                position="top-right"
              />
            </div>
          </Card>
          
          <Card>
            <div className="flex flex-col gap-4">
              <h3 className="font-semibold">Toast Manager Example</h3>
              <p>Use the global toast manager to show multiple toasts:</p>
              <ToastDemo />
            </div>
          </Card>
        </div>
      ),
    },
    {
      id: 'tooltips',
      label: 'Tooltips',
      content: (
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">Tooltip Component</h2>
          <p>Tooltips for showing additional information on hover.</p>
          
          <div className="flex flex-wrap gap-8 py-10">
            <Tooltip content="This is a default tooltip">
              <Button>Default Tooltip</Button>
            </Tooltip>
            
            <Tooltip 
              content="This tooltip appears on the right" 
              position="right"
              color="primary"
            >
              <Button variant="primary">Right Tooltip</Button>
            </Tooltip>
            
            <Tooltip 
              content="This tooltip appears on the bottom" 
              position="bottom"
              color="secondary"
            >
              <Button variant="secondary">Bottom Tooltip</Button>
            </Tooltip>
            
            <Tooltip 
              content="This tooltip appears on the left" 
              position="left"
              color="accent"
            >
              <Button variant="accent">Left Tooltip</Button>
            </Tooltip>
            
            <Tooltip 
              content={
                <div className="p-2">
                  <h3 className="font-bold">Rich Tooltip</h3>
                  <p>Tooltips can contain complex content</p>
                  <ul className="list-disc pl-4 mt-2">
                    <li>Including lists</li>
                    <li>And other elements</li>
                  </ul>
                </div>
              } 
              position="top"
              color="info"
              delay={500}
            >
              <Button variant="outline">Rich Content Tooltip</Button>
            </Tooltip>
          </div>
        </div>
      ),
    },
  ];
  
  return (
    <PageContainer title="Interactive UI Components">
      <div className="mb-4">
        <Link href="/dev/demos" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
          &larr; Back to Demo Hub
        </Link>
      </div>
      <div className="space-y-12">
        <section>
          <ToastProvider>
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold mb-8">Interactive UI Components</h1>
              
              <Tabs 
                tabs={tabs} 
                variant="bordered" 
                size="md" 
                contentClassName="block min-h-[200px] visible"
              />
            </div>
          </ToastProvider>
        </section>
      </div>
    </PageContainer>
  );
};

export default InteractiveComponentsPage; 