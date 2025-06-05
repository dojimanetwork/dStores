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
      title: 'Template Builder',
      description: 'Choose from professionally designed templates and customize them to your needs',
      href: '/dashboard/build/templates',
      color: 'bg-blue-500',
      popular: true
    },
    {
      id: 'visual',
      title: 'Visual Editor',
      description: 'Build your store visually with drag-and-drop components',
      href: '/dashboard/build/visual',
      color: 'bg-purple-500'
    },
    {
      id: 'ai-generate',
      title: 'AI Generator',
      description: 'Let AI create your store based on your business description',
      href: '/dashboard/build/ai-generate',
      color: 'bg-green-500',
      new: true
    },
    {
      id: 'grapesjs',
      title: 'GrapesJS Editor',
      description: 'Advanced web builder with complete design control',
      href: '/dashboard/build/grapesjs',
      color: 'bg-orange-500'
    },
    {
      id: 'builderio',
      title: 'Builder.io',
      description: 'Professional page builder with advanced features',
      href: '/dashboard/build/builderio',
      color: 'bg-indigo-500'
    },
    {
      id: 'plasmic',
      title: 'Plasmic Studio',
      description: 'Component-based visual development platform',
      href: '/dashboard/build/plasmic',
      color: 'bg-pink-500'
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildOptions.map((option) => {
            return (
              <div
                key={option.id}
                onClick={() => handleOptionClick(option.href, option.title)}
                className="relative bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer group"
              >
                {/* Badges */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {option.popular && (
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                  {option.new && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      New
                    </span>
                  )}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 ${option.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <div className="w-6 h-6 bg-white rounded" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {option.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {option.description}
                </p>

                {/* Arrow */}
                <div className="mt-4 flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Get Started
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-gray-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12+</div>
              <div className="text-sm text-gray-600">Templates Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">6</div>
              <div className="text-sm text-gray-600">Builder Options</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">∞</div>
              <div className="text-sm text-gray-600">Customization Possibilities</div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 