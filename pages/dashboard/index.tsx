import DashboardLayout from '@/components/DashboardLayout';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function DashboardHome() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?storeId=1');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      // Silent error handling
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Templates',
      description: 'Choose from professionally designed templates and customize them to your brand',
      icon: '🎨',
      href: '/dashboard/build/templates',
      category: 'Quick Start'
    },
    {
      title: 'Visual Editor',
      description: 'Design your store with a powerful drag-and-drop visual editor',
      icon: '🎯',
      href: '/dashboard/build/grapesjs',
      category: 'Custom Build'
    },
    {
      title: 'AI Builder',
      description: 'Let AI create a custom design based on your brand and preferences',
      icon: '🤖',
      href: '/dashboard/build/ai-generate',
      category: 'AI Powered'
    },
  ];

  if (!hydrated) return null;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Store Dashboard
          </h1>
          <p className="text-gray-600">
            Choose how you want to build your store or manage your existing setup
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold text-blue-600">
              {loading ? '...' : products.length}
            </div>
            <div className="text-sm text-gray-600">Total Products</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold text-green-600">12+</div>
            <div className="text-sm text-gray-600">Templates Available</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-2xl font-bold text-purple-600">6</div>
            <div className="text-sm text-gray-600">Build Options</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Build Your Store</h2>
          <p className="text-gray-600 mb-8">Choose your preferred method to create your online store</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Test Nexus Template Button */}
            <button
              type="button"
              className="bg-gradient-to-br from-cyan-500 to-purple-600 text-white rounded-lg p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group w-full text-left focus:outline-none"
              onClick={() => {
                console.log('Nexus template test clicked');
                router.push('/dashboard/templates/nexus-futuristic');
              }}
              tabIndex={0}
            >
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="font-semibold text-white mb-2">
                Test Nexus Template
              </h3>
              <p className="text-sm text-cyan-100 mb-4">Test the Nexus Futuristic template directly</p>
              <div className="flex items-center text-white font-medium text-sm group-hover:translate-x-1 transition-transform">
                Open Template
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            
            {dashboardCards.map((card) => (
              <button
                key={card.title}
                type="button"
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 cursor-pointer group w-full text-left focus:outline-none"
                onClick={() => {
                  console.log('Card clicked:', card.href);
                  try {
                    if (router && typeof router.push === 'function') {
                      router.push(card.href).catch((err) => {
                        console.error('router.push failed, falling back to window.location.href', err);
                        window.location.href = card.href;
                      });
                    } else {
                      console.warn('router.push not available, using window.location.href');
                      window.location.href = card.href;
                    }
                  } catch (err) {
                    console.error('Navigation error, using window.location.href', err);
                    window.location.href = card.href;
                  }
                }}
                tabIndex={0}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{card.icon}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {card.category}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600">
                  {card.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4">{card.description}</p>
                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform">
                  Get Started
                  <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                {/* Fallback link for accessibility, visually hidden */}
                <a
                  href={card.href}
                  tabIndex={-1}
                  aria-hidden="true"
                  style={{ display: 'none' }}
                >
                  {card.title}
                </a>
              </button>
            ))}
          </div>
          
          {/* Helper text explaining the options */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium text-gray-900 mb-3">Which option should I choose?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">🎨</span>
                  <span className="font-medium text-gray-900">Templates</span>
                </div>
                <p className="text-gray-600">Perfect for getting started quickly with proven designs. Just customize colors, content, and images.</p>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">🎯</span>
                  <span className="font-medium text-gray-900">Visual Editor</span>
                </div>
                <p className="text-gray-600">Best for custom designs. Drag and drop components to build exactly what you envision.</p>
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-lg mr-2">🤖</span>
                  <span className="font-medium text-gray-900">AI Builder</span>
                </div>
                <p className="text-gray-600">Let AI do the heavy lifting. Describe your vision and get a custom design generated for you.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Products */}
        {!loading && products.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Recent Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.slice(0, 3).map((product: any) => (
                <div key={product.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  {product.images && product.images[0] && (
                    <img 
                      src={product.images[0]} 
                      alt={product.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-green-600 font-semibold">${product.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
