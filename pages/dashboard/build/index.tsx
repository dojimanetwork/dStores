import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export default function BuildHomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Add a small delay to ensure everything is loaded
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleOptionClick = (href: string, title: string) => {
    console.log(`🎯 Build option clicked: ${title}`);
    console.log(`🔗 Navigating to: ${href}`);
    
    try {
      router.push(href).catch((error) => {
        console.error(`❌ Navigation failed:`, error);
        window.location.href = href;
      });
    } catch (error) {
      console.error(`❌ Click handler error:`, error);
      window.location.href = href;
    }
  };

  const buildOptions = [
    {
      id: 'templates',
      title: 'Templates',
      description: 'Choose from professionally designed templates and customize them to your brand',
      href: '/dashboard/build/templates',
      icon: '🎨',
      category: 'Quick Start',
      color: 'from-blue-500 to-blue-600',
      popular: true
    },
    {
      id: 'grapesjs',
      title: 'Visual Editor',
      description: 'Design your store with Plasmic\'s powerful drag-and-drop visual editor',
      href: '/dashboard/build/grapesjs',
      icon: '🎯',
      category: 'Custom Build',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'ai-generate',
      title: 'AI Builder',
      description: 'Let AI create a custom design based on your brand and preferences',
      href: '/dashboard/build/ai-generate',
      icon: '🤖',
      category: 'AI Powered',
      color: 'from-green-500 to-green-600',
      new: true
    }
  ];

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading build options...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="text-red-600 mb-4">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Something went wrong</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Build Your Store
          </h1>
          <p className="text-lg text-gray-600">
            Choose your preferred way to build and customize your e-commerce store
          </p>
        </div>

        {/* Build Options Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {buildOptions.map((option) => {
            return (
              <div
                key={option.id}
                onClick={() => handleOptionClick(option.href, option.title)}
                className="relative bg-white rounded-xl border border-gray-200 p-8 hover:shadow-xl hover:border-gray-300 transition-all cursor-pointer group"
              >
                {/* Badges */}
                <div className="absolute top-6 right-6 flex gap-2">
                  {option.popular && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                  {option.new && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                      New
                    </span>
                  )}
                </div>

                {/* Icon and Category */}
                <div className="mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <span className="text-2xl">{option.icon}</span>
                  </div>
                  <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                    {option.category}
                  </span>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {option.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {option.description}
                </p>

                {/* Call to Action */}
                <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                  Get Started
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
} 