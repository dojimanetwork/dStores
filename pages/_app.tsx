// File: pages/_app.tsx

import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SetupProvider } from '@/contexts/SetupContext'
import { StoreProvider } from '@/contexts/StoreContext'
import { LayoutProvider } from '@/contexts/LayoutContext'
import { ProductProvider } from '@/contexts/ProductContext'
import { SetupCompletionProvider } from '@/contexts/SetupCompletionContext'
import { ErrorBoundary } from 'react-error-boundary'
import { useEffect, useState } from 'react'
import { Web3AuthProvider } from "@web3auth/modal/react";
import { Web3AuthProvider as Web3AuthContextProvider } from "../contexts/Web3AuthContext";
import web3authConfig from "../config/web3auth";
import Layout from "../components/Layout";

function ErrorFallback({ error }: { error: Error }) {
  useEffect(() => {
    // Log the error for debugging
    console.error('Error Boundary caught:', error);
  }, [error]);

  return (
    <div role="alert" className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-red-600 mb-4">Something went wrong</h2>
        <details className="text-left">
          <summary className="cursor-pointer text-sm text-gray-600 mb-2">Error Details</summary>
          <pre className="text-xs text-red-500 bg-gray-100 p-2 rounded overflow-auto max-h-32">
            {error.message}
          </pre>
        </details>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Reload Page
        </button>
      </div>
    </div>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('App component mounted')

    // Global error handler for clipboard and other unhandled errors
    const handleGlobalError = (event: ErrorEvent) => {
      console.log('Global error caught:', event.message);

      // Suppress clipboard errors
      if (event.message.includes('clipboard') ||
        event.message.includes('Copy to clipboard is not supported')) {
        console.warn('Clipboard error suppressed:', event.message);
        event.preventDefault();
        return false;
      }

      // Handle useStore context errors
      if (event.message.includes('useStore must be used within a StoreProvider')) {
        console.error('StoreProvider context error. Reloading page...');
        // Optionally reload the page or redirect to a safe route
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
        event.preventDefault();
        return false;
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.log('Unhandled rejection caught:', event.reason);

      if (event.reason?.message?.includes('clipboard') ||
        event.reason?.message?.includes('Copy to clipboard is not supported')) {
        console.warn('Clipboard promise rejection suppressed:', event.reason);
        event.preventDefault();
        return false;
      }

      if (event.reason?.message?.includes('useStore must be used within a StoreProvider')) {
        console.error('StoreProvider context rejection. Redirecting...');
        event.preventDefault();
        return false;
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [])

  // Prevent hydration issues by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, errorInfo) => {
        console.error('Error Boundary triggered:', error, errorInfo);

        // Suppress clipboard errors in error boundary too
        if (error.message.includes('clipboard') ||
          error.message.includes('Copy to clipboard is not supported')) {
          console.warn('Clipboard error caught by boundary:', error.message);
          return;
        }

        // Handle context errors
        if (error.message.includes('useStore must be used within a StoreProvider')) {
          console.error('Context provider error caught by boundary:', error.message);
          return;
        }

        console.error('Unhandled error caught by boundary:', error);
      }}
      onReset={() => {
        // Clear any error states and reload
        window.location.reload();
      }}
    >
      <div className="w-full min-h-screen">
        <Web3AuthProvider
          config={web3authConfig}
        >
          <Web3AuthContextProvider>
            <SetupCompletionProvider>
              <SetupProvider>
                <StoreProvider>
                  <LayoutProvider>
                    <ProductProvider>
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>
                    </ProductProvider>
                  </LayoutProvider>
                </StoreProvider>
              </SetupProvider>
            </SetupCompletionProvider>
          </Web3AuthContextProvider>
        </Web3AuthProvider>
      </div>
    </ErrorBoundary>
  )
}