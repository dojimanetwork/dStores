import DashboardLayout from '@/components/DashboardLayout';
import { useSetupCompletion } from '@/contexts/SetupCompletionContext';
import { CheckCircleIcon, XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function TestCompletion() {
  const { 
    completionState, 
    markBuildWebsiteComplete, 
    isStepCompleted,
    getCompletionPercentage,
    resetCompletion,
    debugCompletion
  } = useSetupCompletion();
  
  const [testTemplate, setTestTemplate] = useState('modern-dropshipping');

  const handleTestCompletion = () => {
    markBuildWebsiteComplete(testTemplate);
    alert(`✅ Build Website step marked as complete with template: ${testTemplate}`);
  };

  const handleReset = () => {
    resetCompletion();
    alert('🔄 All completion state has been reset to defaults');
  };

  const handleDebug = () => {
    debugCompletion();
    alert('🔍 Check browser console for completion state details');
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          🧪 Completion Testing Page
        </h1>

        {/* Current Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Completion Status</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Build Website</span>
                <div className="flex items-center">
                  {isStepCompleted('buildWebsite') ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-gray-400 mr-2" />
                  )}
                  <span className={`text-sm ${
                    isStepCompleted('buildWebsite') ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {isStepCompleted('buildWebsite') ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Add Products</span>
                <div className="flex items-center">
                  {isStepCompleted('addProducts') ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-gray-400 mr-2" />
                  )}
                  <span className={`text-sm ${
                    isStepCompleted('addProducts') ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {isStepCompleted('addProducts') ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Configure Shipping</span>
                <div className="flex items-center">
                  {isStepCompleted('configureShipping') ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-gray-400 mr-2" />
                  )}
                  <span className={`text-sm ${
                    isStepCompleted('configureShipping') ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {isStepCompleted('configureShipping') ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Set Up Payments</span>
                <div className="flex items-center">
                  {isStepCompleted('setupPayments') ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-gray-400 mr-2" />
                  )}
                  <span className={`text-sm ${
                    isStepCompleted('setupPayments') ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {isStepCompleted('setupPayments') ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium">Review & Deploy</span>
                <div className="flex items-center">
                  {isStepCompleted('reviewDeploy') ? (
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                  ) : (
                    <XCircleIcon className="w-5 h-5 text-gray-400 mr-2" />
                  )}
                  <span className={`text-sm ${
                    isStepCompleted('reviewDeploy') ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {isStepCompleted('reviewDeploy') ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Overall Progress</h3>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {getCompletionPercentage()}%
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
              </div>

              {completionState.buildWebsite.completed && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-green-900 mb-2">Build Website Details</h3>
                  <div className="text-sm text-green-700 space-y-1">
                    <div><strong>Template:</strong> {completionState.buildWebsite.templateSelected}</div>
                    <div><strong>Completed:</strong> {new Date(completionState.buildWebsite.completedAt!).toLocaleString()}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Build Website Completion Test */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Build Website Completion Test
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Template to Complete With:
              </label>
              <select 
                value={testTemplate}
                onChange={(e) => setTestTemplate(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 bg-white"
              >
                <option value="modern-dropshipping">Modern Dropshipping</option>
                <option value="commerce-landing-page">Commerce Landing Page</option>
                <option value="minimalist-storefront">Minimalist Storefront</option>
                <option value="fashion-boutique">Fashion Boutique</option>
                <option value="electronics-shop">Electronics Shop</option>
              </select>
            </div>

            <button
              onClick={handleTestCompletion}
              disabled={isStepCompleted('buildWebsite')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isStepCompleted('buildWebsite')
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isStepCompleted('buildWebsite') ? 'Already Complete' : 'Mark Build Website Complete'}
            </button>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={handleDebug}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-medium transition-colors"
              >
                🔍 Debug State
              </button>
              
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                🔄 Reset All Progress
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📋 Build Website Completion Procedure
          </h2>
          
          <div className="prose max-w-none">
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Navigate to the Build section</li>
              <li>Click on "Templates" option</li>
              <li>Browse available templates</li>
              <li>Click "Use Template" on any template</li>
              <li>System automatically marks the step as complete</li>
              <li>✅ Step marked as complete, tick appears in progress bar</li>
              <li>User redirected to template preview page</li>
            </ol>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">🔍 What to Look For:</h3>
              <ul className="list-disc list-inside space-y-1 text-yellow-800">
                <li>Green dot in the top progress bar for "Build Website"</li>
                <li>Green checkmark in left sidebar for "Build Website"</li>
                <li>Completion percentage increases to 20%</li>
                <li>Selected template highlighted with green border</li>
                <li>Green completion banner on template selection page</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 