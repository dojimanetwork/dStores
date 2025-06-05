import { createContext, useContext, useState, ReactNode } from 'react';

interface SetupState {
  website: {
    template?: string;
    aiGenerated?: boolean;
    content?: any;
  };
  products: {
    importMethod?: string;
    items?: any[];
  };
  shipping: {
    providers: string[];
  };
  payments: {
    providers: string[];
  };
  domain: {
    name?: string;
    status?: 'pending' | 'registered' | 'error';
  };
}

interface SetupContextType {
  setupState: SetupState;
  updateWebsite: (data: Partial<SetupState['website']>) => void;
  updateProducts: (data: Partial<SetupState['products']>) => void;
  updateShipping: (data: Partial<SetupState['shipping']>) => void;
  updatePayments: (data: Partial<SetupState['payments']>) => void;
  updateDomain: (data: Partial<SetupState['domain']>) => void;
  isStepComplete: (step: keyof SetupState) => boolean;
}

const SetupContext = createContext<SetupContextType | undefined>(undefined);

export function SetupProvider({ children }: { children: ReactNode }) {
  const [setupState, setSetupState] = useState<SetupState>({
    website: {},
    products: {},
    shipping: { providers: [] },
    payments: { providers: ['dojima'] },
    domain: {},
  });

  const updateWebsite = (data: Partial<SetupState['website']>) => {
    setSetupState(prev => ({
      ...prev,
      website: { ...prev.website, ...data },
    }));
  };

  const updateProducts = (data: Partial<SetupState['products']>) => {
    setSetupState(prev => ({
      ...prev,
      products: { ...prev.products, ...data },
    }));
  };

  const updateShipping = (data: Partial<SetupState['shipping']>) => {
    setSetupState(prev => ({
      ...prev,
      shipping: { ...prev.shipping, ...data },
    }));
  };

  const updatePayments = (data: Partial<SetupState['payments']>) => {
    setSetupState(prev => ({
      ...prev,
      payments: { ...prev.payments, ...data },
    }));
  };

  const updateDomain = (data: Partial<SetupState['domain']>) => {
    setSetupState(prev => ({
      ...prev,
      domain: { ...prev.domain, ...data },
    }));
  };

  const isStepComplete = (step: keyof SetupState): boolean => {
    switch (step) {
      case 'website':
        return !!(setupState.website.template || setupState.website.aiGenerated);
      case 'products':
        return !!setupState.products.items?.length;
      case 'shipping':
        return setupState.shipping.providers.length > 0;
      case 'payments':
        return setupState.payments.providers.length > 0;
      case 'domain':
        return !!setupState.domain.name;
      default:
        return false;
    }
  };

  return (
    <SetupContext.Provider
      value={{
        setupState,
        updateWebsite,
        updateProducts,
        updateShipping,
        updatePayments,
        updateDomain,
        isStepComplete,
      }}
    >
      {children}
    </SetupContext.Provider>
  );
}

export function useSetup() {
  const context = useContext(SetupContext);
  if (context === undefined) {
    throw new Error('useSetup must be used within a SetupProvider');
  }
  return context;
} 