import { useRouter } from 'next/router';
import { useSetupCompletion } from '@/contexts/SetupCompletionContext';

const steps = [
  { id: 'build', label: 'Build Website', path: '/dashboard/build', completionKey: 'buildWebsite' as const },
  { id: 'products', label: 'Add Products', path: '/dashboard/products', completionKey: 'addProducts' as const },
  { id: 'shipping', label: 'Configure Shipping', path: '/dashboard/shipping', completionKey: 'configureShipping' as const },
  { id: 'payments', label: 'Set Up Payments', path: '/dashboard/payments', completionKey: 'setupPayments' as const },
  { id: 'review', label: 'Review & Deploy', path: '/dashboard/review', completionKey: 'reviewDeploy' as const },
];

interface SetupProgressProps {
  compact?: boolean;
}

export default function SetupProgress({ compact = false }: SetupProgressProps) {
  const router = useRouter();
  const { isStepCompleted, getCompletionPercentage, getBuildMethod } = useSetupCompletion();
  
  const currentStep = steps.findIndex(step => router.pathname.startsWith(step.path));
  const completedSteps = steps.filter(step => isStepCompleted(step.completionKey)).length;
  const buildMethod = getBuildMethod();

  if (compact) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium text-gray-600 hidden sm:block">Setup Progress:</span>
        <div className="flex items-center space-x-1">
          {steps.map((step, index) => {
            const isCompleted = isStepCompleted(step.completionKey);
            const isCurrent = router.pathname.startsWith(step.path);
            const stepBuildMethod = step.completionKey === 'buildWebsite' && isCompleted ? buildMethod : null;
            
            return (
              <div
                key={step.id}
                className={`w-3 h-3 rounded-full transition-colors ${
                  isCompleted 
                    ? 'bg-green-500' 
                    : isCurrent 
                    ? 'bg-blue-500' 
                    : 'bg-gray-300'
                }`}
                title={`${step.label}${isCompleted ? ` ✓${stepBuildMethod ? ` (${stepBuildMethod})` : ''}` : ''}`}
              />
            );
          })}
        </div>
        <span className="text-sm text-gray-500 hidden md:block">
          {completedSteps}/{steps.length}
        </span>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = isStepCompleted(step.completionKey);
          const isCurrent = router.pathname.startsWith(step.path);
          const stepBuildMethod = step.completionKey === 'buildWebsite' && isCompleted ? buildMethod : null;
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              <span className={`text-sm mt-2 text-center ${
                isCompleted ? 'text-green-600' : isCurrent ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {step.label}
                {stepBuildMethod && (
                  <div className="text-xs text-green-500 mt-1">
                    ({stepBuildMethod})
                  </div>
                )}
              </span>
            </div>
          );
        })}
      </div>
      <div className="relative mt-4">
        <div className="absolute top-0 left-0 h-1 bg-gray-200 w-full rounded-full"></div>
        <div
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 rounded-full"
          style={{ width: `${(completedSteps / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
} 