import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { useRouter } from 'next/router';

export default function WebsiteSetup() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<'template' | 'ai' | null>(null);

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Choose Your Website Setup Method</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className={`p-6 border rounded-lg cursor-pointer ${
              selectedOption === 'template' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setSelectedOption('template')}
          >
            <h2 className="text-xl font-semibold mb-4">Choose from Templates</h2>
            <p className="text-gray-600 mb-4">
              Select from our pre-designed templates and customize them to your needs.
            </p>
            <Button 
              onClick={() => router.push('/dashboard/website/templates')}
              className="w-full"
            >
              Browse Templates
            </Button>
          </div>

          <div 
            className={`p-6 border rounded-lg cursor-pointer ${
              selectedOption === 'ai' ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => setSelectedOption('ai')}
          >
            <h2 className="text-xl font-semibold mb-4">AI-Powered Generation</h2>
            <p className="text-gray-600 mb-4">
              Let our AI create a unique website design based on your preferences.
            </p>
            <Button 
              onClick={() => router.push('/dashboard/website/ai-generator')}
              className="w-full"
            >
              Generate with AI
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 