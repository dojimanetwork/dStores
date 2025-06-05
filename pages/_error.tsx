import React from 'react';
import { NextPageContext } from 'next';
import Link from 'next/link';

interface ErrorProps {
  statusCode?: number;
  hasGetInitialProps?: boolean;
  err?: {
    message?: string;
    name?: string;
  };
}

function Error({ statusCode, hasGetInitialProps, err }: ErrorProps) {
  if (statusCode === 404) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Go Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">{statusCode || 'Error'}</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-8">
          {err?.message || 'An unexpected error occurred. Please try again later.'}
        </p>
        <Link
          href="/dashboard"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
        >
          Go Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error; 