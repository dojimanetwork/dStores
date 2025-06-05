import { useStoreOptional } from '@/contexts/StoreContext';
import { useEffect, useState } from 'react';

interface SafeStoreResult {
  store: ReturnType<typeof useStoreOptional>;
  isLoading: boolean;
  error: string | null;
  isAvailable: boolean;
}

/**
 * Safe hook to access store context with loading states and error handling
 */
export function useSafeStore(): SafeStoreResult {
  const store = useStoreOptional();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStore = () => {
      try {
        if (store) {
          setError(null);
          setIsLoading(false);
        } else {
          setError('Store context not available');
          setIsLoading(false);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error accessing store');
        setIsLoading(false);
      }
    };

    // Check immediately
    checkStore();

    // Set a timeout to handle SSR issues
    const timeout = setTimeout(() => {
      if (isLoading) {
        setError('Store context loading timeout');
        setIsLoading(false);
      }
    }, 5000);

    return () => clearTimeout(timeout);
  }, [store, isLoading]);

  return {
    store,
    isLoading,
    error,
    isAvailable: !!store && !error
  };
}

/**
 * Hook that throws if store is not available (for components that require store)
 */
export function useRequiredStore() {
  const { store, isLoading, error, isAvailable } = useSafeStore();

  if (isLoading) {
    throw new Promise(resolve => setTimeout(resolve, 100)); // Suspend component
  }

  if (!isAvailable || !store) {
    throw new Error(error || 'Store context is required but not available');
  }

  return store;
}

/**
 * Hook for optional store access with defaults
 */
export function useOptionalStore() {
  const { store, isLoading, error } = useSafeStore();

  return {
    store: store || null,
    isLoading,
    error,
    // Provide safe defaults for store operations
    addProduct: store?.addProduct || (() => console.warn('Store not available: addProduct')),
    setTemplateOption: store?.setTemplateOption || (() => console.warn('Store not available: setTemplateOption')),
    setShippingProvider: store?.setShippingProvider || (() => console.warn('Store not available: setShippingProvider')),
    setPaymentProviders: store?.setPaymentProviders || (() => console.warn('Store not available: setPaymentProviders')),
    setDomainName: store?.setDomainName || (() => console.warn('Store not available: setDomainName')),
    
    // Safe data access with defaults
    products: store?.products || [],
    paymentProviders: store?.paymentProviders || [],
    templateOption: store?.templateOption || null,
    shippingProvider: store?.shippingProvider || null,
    domainName: store?.domainName || '',
    isLoaded: store?.isLoaded || false
  };
} 