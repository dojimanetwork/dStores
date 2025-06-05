import DashboardLayout from '@/components/DashboardLayout';
import TemplateSelection from '@/components/TemplateSelection';
import { useRouter } from 'next/router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function TemplateSelectionPage() {
  const router = useRouter();

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header with back button */}
        <div className="flex items-center mb-4 sm:mb-6">
          <button 
            onClick={() => router.back()}
            className="flex items-center p-2 -ml-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors touch-manipulation"
          >
            <ArrowLeftIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="ml-2 text-sm sm:text-base font-medium">Back</span>
          </button>
        </div>
        
        {/* Page title */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Choose Your Template
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Select a professionally designed template to get started quickly
          </p>
        </div>

        {/* Template selection component */}
        <TemplateSelection />
      </div>
    </DashboardLayout>
  );
} 