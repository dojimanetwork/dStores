import React, { createContext, useContext, useState, useEffect } from 'react';

interface SetupCompletionState {
  buildWebsite: {
    completed: boolean;
    method: 'template' | 'visual-builder' | 'ai-generated' | null;
    templateSelected: string | null;
    templateConfirmed: boolean;
    buildMethod: string | null;
    completedAt: string | null;
  };
  addProducts: {
    completed: boolean;
    productCount: number;
    completedAt: string | null;
  };
  configureShipping: {
    completed: boolean;
    shippingMethods: string[];
    completedAt: string | null;
  };
  setupPayments: {
    completed: boolean;
    paymentMethods: string[];
    completedAt: string | null;
  };
  reviewDeploy: {
    completed: boolean;
    deployed: boolean;
    deploymentUrl: string | null;
    completedAt: string | null;
  };
}

interface SetupCompletionContextType {
  completionState: SetupCompletionState;
  markBuildWebsiteComplete: (methodOrTemplateId: string, method?: 'template' | 'visual-builder' | 'ai-generated') => void;
  markAddProductsComplete: (productCount: number) => void;
  markConfigureShippingComplete: (methods: string[]) => void;
  markSetupPaymentsComplete: (methods: string[]) => void;
  markReviewDeployComplete: (deploymentUrl: string) => void;
  isStepCompleted: (step: 'buildWebsite' | 'addProducts' | 'configureShipping' | 'setupPayments' | 'reviewDeploy') => boolean;
  getCompletionPercentage: () => number;
  getBuildMethod: () => string | null;
  resetCompletion: () => void;
  debugCompletion: () => void;
}

const defaultState: SetupCompletionState = {
  buildWebsite: {
    completed: false,
    method: null,
    templateSelected: null,
    templateConfirmed: false,
    buildMethod: null,
    completedAt: null,
  },
  addProducts: {
    completed: false,
    productCount: 0,
    completedAt: null,
  },
  configureShipping: {
    completed: false,
    shippingMethods: [],
    completedAt: null,
  },
  setupPayments: {
    completed: false,
    paymentMethods: [],
    completedAt: null,
  },
  reviewDeploy: {
    completed: false,
    deployed: false,
    deploymentUrl: null,
    completedAt: null,
  },
};

const SetupCompletionContext = createContext<SetupCompletionContextType | undefined>(undefined);

export function SetupCompletionProvider({ children }: { children: React.ReactNode }) {
  const [completionState, setCompletionState] = useState<SetupCompletionState>(defaultState);

  // Load completion state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('setupCompletion');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        console.log('🔍 Loaded completion state from localStorage:', parsedState);
        setCompletionState(parsedState);
      } catch (error) {
        console.error('Error loading setup completion state:', error);
      }
    } else {
      console.log('🔍 No existing completion state in localStorage, using defaults');
    }
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('setupCompletion', JSON.stringify(completionState));
  }, [completionState]);

  const markBuildWebsiteComplete = (methodOrTemplateId: string, method?: 'template' | 'visual-builder' | 'ai-generated') => {
    // If method is not provided, try to infer from methodOrTemplateId
    const buildMethod = method || (methodOrTemplateId.includes('template') ? 'template' : 'visual-builder');
    
    let buildMethodName = '';
    let templateSelected = null;
    
    switch (buildMethod) {
      case 'template':
        buildMethodName = 'Template';
        templateSelected = methodOrTemplateId;
        break;
      case 'visual-builder':
        buildMethodName = 'Visual Builder';
        break;
      case 'ai-generated':
        buildMethodName = 'AI Generated';
        break;
      default:
        buildMethodName = 'Custom Build';
    }
    
    setCompletionState(prev => ({
      ...prev,
      buildWebsite: {
        completed: true,
        method: buildMethod,
        templateSelected,
        templateConfirmed: buildMethod === 'template',
        buildMethod: buildMethodName,
        completedAt: new Date().toISOString(),
      },
    }));
  };

  const markAddProductsComplete = (productCount: number) => {
    setCompletionState(prev => ({
      ...prev,
      addProducts: {
        completed: productCount > 0,
        productCount,
        completedAt: productCount > 0 ? new Date().toISOString() : null,
      },
    }));
  };

  const markConfigureShippingComplete = (methods: string[]) => {
    setCompletionState(prev => ({
      ...prev,
      configureShipping: {
        completed: methods.length > 0,
        shippingMethods: methods,
        completedAt: methods.length > 0 ? new Date().toISOString() : null,
      },
    }));
  };

  const markSetupPaymentsComplete = (methods: string[]) => {
    setCompletionState(prev => ({
      ...prev,
      setupPayments: {
        completed: methods.length > 0,
        paymentMethods: methods,
        completedAt: methods.length > 0 ? new Date().toISOString() : null,
      },
    }));
  };

  const markReviewDeployComplete = (deploymentUrl: string) => {
    setCompletionState(prev => ({
      ...prev,
      reviewDeploy: {
        completed: true,
        deployed: true,
        deploymentUrl,
        completedAt: new Date().toISOString(),
      },
    }));
  };

  const isStepCompleted = (step: keyof SetupCompletionState): boolean => {
    return completionState[step].completed;
  };

  const getCompletionPercentage = (): number => {
    const steps = Object.keys(completionState) as (keyof SetupCompletionState)[];
    const completedSteps = steps.filter(step => completionState[step].completed).length;
    return Math.round((completedSteps / steps.length) * 100);
  };

  const getBuildMethod = (): string | null => {
    return completionState.buildWebsite.buildMethod;
  };

  const resetCompletion = () => {
    setCompletionState(defaultState);
  };

  const debugCompletion = () => {
    console.log('Current completion state:', completionState);
  };

  return (
    <SetupCompletionContext.Provider
      value={{
        completionState,
        markBuildWebsiteComplete,
        markAddProductsComplete,
        markConfigureShippingComplete,
        markSetupPaymentsComplete,
        markReviewDeployComplete,
        isStepCompleted,
        getCompletionPercentage,
        getBuildMethod,
        resetCompletion,
        debugCompletion,
      }}
    >
      {children}
    </SetupCompletionContext.Provider>
  );
}

export function useSetupCompletion() {
  const context = useContext(SetupCompletionContext);
  if (context === undefined) {
    throw new Error('useSetupCompletion must be used within a SetupCompletionProvider');
  }
  return context;
} 