import React, { ComponentType } from 'react';
import { StoreProvider, useStoreOptional } from '@/contexts/StoreContext';

/**
 * HOC to ensure components have access to StoreProvider
 */
export function withStoreProvider<P extends object>(
  WrappedComponent: ComponentType<P>
): ComponentType<P> {
  const WithStoreProviderComponent = (props: P) => {
    return (
      <StoreProvider>
        <WrappedComponent {...props} />
      </StoreProvider>
    );
  };

  WithStoreProviderComponent.displayName = `withStoreProvider(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithStoreProviderComponent;
}

/**
 * Hook to safely check if StoreProvider is available
 */
export function useStoreCheck(): { hasStore: boolean; error?: string } {
  const store = useStoreOptional();
  
  if (!store) {
    return {
      hasStore: false,
      error: 'StoreProvider not found. Component may need to be wrapped with withStoreProvider or accessed through proper app structure.'
    };
  }
  
  return { hasStore: true };
}

/**
 * Component to display error message when StoreProvider is missing
 */
export function StoreProviderError({ error }: { error?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center p-6 bg-white rounded-lg shadow-lg border border-red-200">
        <div className="text-red-500 mb-4">
          <svg className="w-12 h-12 mx-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Store Context Missing</h2>
        <p className="text-gray-600 mb-4">
          {error || 'This component requires StoreProvider context.'}
        </p>
        <div className="space-y-2">
          <button 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Dashboard
          </button>
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Reload Page
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Safe wrapper component that checks for StoreProvider before rendering children
 */
export function SafeStoreWrapper({ children }: { children: React.ReactNode }) {
  const { hasStore, error } = useStoreCheck();
  
  if (!hasStore) {
    return <StoreProviderError error={error} />;
  }
  
  return <>{children}</>;
} 