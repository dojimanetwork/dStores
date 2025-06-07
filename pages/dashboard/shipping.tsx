import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import { useSetupCompletion } from '@/contexts/SetupCompletionContext';
import { 
  TruckIcon, 
  ClockIcon, 
  GlobeAltIcon, 
  HomeIcon,
  ShoppingCartIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CubeIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

interface ShippingProvider {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  estimatedTime: string;
  priceRange: string;
  features: string[];
  bestFor: string;
  color: string;
}

const shippingProviders: ShippingProvider[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    icon: TruckIcon,
    description: 'Reliable delivery for everyday orders',
    estimatedTime: '5-7 business days',
    priceRange: '$5.99 - $12.99',
    features: ['Package tracking', 'Insurance included', 'Signature on delivery'],
    bestFor: 'Regular orders, cost-effective shipping',
    color: 'blue'
  },
  {
    id: 'express',
    name: 'Express Shipping',
    icon: ClockIcon,
    description: 'Fast delivery for urgent orders',
    estimatedTime: '2-3 business days',
    priceRange: '$12.99 - $24.99',
    features: ['Priority handling', 'Real-time tracking', 'Email notifications'],
    bestFor: 'Time-sensitive deliveries',
    color: 'orange'
  },
  {
    id: 'overnight',
    name: 'Overnight Delivery',
    icon: ClockIcon,
    description: 'Next-day delivery for critical orders',
    estimatedTime: '1 business day',
    priceRange: '$24.99 - $49.99',
    features: ['Next-day guarantee', 'Premium tracking', 'SMS alerts'],
    bestFor: 'Emergency orders, high-value items',
    color: 'red'
  },
  {
    id: 'international',
    name: 'International Shipping',
    icon: GlobeAltIcon,
    description: 'Worldwide delivery with customs handling',
    estimatedTime: '7-21 business days',
    priceRange: '$19.99 - $89.99',
    features: ['Customs clearance', 'International tracking', 'Duty calculation'],
    bestFor: 'Global customers, international expansion',
    color: 'green'
  },
  {
    id: 'local-delivery',
    name: 'Local Delivery',
    icon: HomeIcon,
    description: 'Same-day delivery within local area',
    estimatedTime: 'Same day / 2-4 hours',
    priceRange: '$8.99 - $19.99',
    features: ['Same-day delivery', 'Local courier', 'Real-time updates'],
    bestFor: 'Local customers, fresh products',
    color: 'purple'
  },
  {
    id: 'free-shipping',
    name: 'Free Shipping',
    icon: TruckIcon,
    description: 'Free delivery for qualifying orders',
    estimatedTime: '5-10 business days',
    priceRange: 'Free (min. order $50)',
    features: ['No shipping cost', 'Standard tracking', 'Order minimum required'],
    bestFor: 'Customer acquisition, large orders',
    color: 'indigo'
  }
];

interface Product {
  id: string;
  name: string;
  source?: string;
  price: number;
}

export default function Shipping() {
  const { markConfigureShippingComplete, isStepCompleted, completionState } = useSetupCompletion();
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manualProductCount, setManualProductCount] = useState(0);
  const [importedProductCount, setImportedProductCount] = useState(0);

  // Load existing shipping configuration
  useEffect(() => {
    if (completionState.configureShipping.shippingMethods.length > 0) {
      setSelectedProviders(completionState.configureShipping.shippingMethods);
    }
  }, [completionState.configureShipping.shippingMethods]);

  // Load products to categorize manual vs imported
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch('/api/products?storeId=1');
        if (!response.ok) {
          throw new Error('Failed to load products');
        }
        const productsData = await response.json();
        setProducts(productsData);
        
        // Count manual vs imported products
        const manual = productsData.filter((p: Product) => 
          !p.source || p.source === 'manual' || p.source === 'seed'
        ).length;
        const imported = productsData.filter((p: Product) => 
          p.source && ['dstores', 'amazon', 'alibaba'].includes(p.source)
        ).length;
        
        setManualProductCount(manual);
        setImportedProductCount(imported);
      } catch (err) {
        console.error('Error loading products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleToggle = (id: string) => {
    setSelectedProviders(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  const handleSaveShipping = async () => {
    if (selectedProviders.length === 0) {
      setError('Please select at least one shipping option');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Call the shipping API to save configuration
      const response = await fetch('/api/shipping?storeId=1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shippingMethods: selectedProviders,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save shipping configuration');
      }

      const result = await response.json();
      console.log('Shipping configuration saved:', result);
      
      // Mark as complete in the setup context
      markConfigureShippingComplete(selectedProviders);
      setError(null);
      
    } catch (err) {
      console.error('Error saving shipping configuration:', err);
      setError('Failed to save shipping configuration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getProviderColor = (color: string, selected: boolean) => {
    const colors = {
      blue: selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300',
      orange: selected ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-orange-300',
      red: selected ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300',
      green: selected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300',
      purple: selected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300',
      indigo: selected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getIconColor = (color: string) => {
    const colors = {
      blue: 'text-blue-600',
      orange: 'text-orange-600',
      red: 'text-red-600',
      green: 'text-green-600',
      purple: 'text-purple-600',
      indigo: 'text-indigo-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading shipping configuration...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Configure Shipping</h1>
              <p className="mt-2 text-gray-600">Set up shipping options for your manually added products</p>
            </div>
            {isStepCompleted('configureShipping') && (
              <div className="flex items-center text-green-600">
                <CheckCircleIcon className="w-6 h-6 mr-2" />
                <span className="font-medium">Shipping Configured</span>
              </div>
            )}
          </div>
        </div>

        {/* Product Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <CubeIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Manual Products</p>
                <p className="text-2xl font-bold text-gray-900">{manualProductCount}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Need shipping configuration</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingCartIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Imported Products</p>
                <p className="text-2xl font-bold text-gray-900">{importedProductCount}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Use platform shipping</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <TruckIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Shipping Options</p>
                <p className="text-2xl font-bold text-gray-900">{selectedProviders.length}</p>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Selected providers</p>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8">
          <div className="flex">
            <InformationCircleIcon className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800">Shipping Configuration Notice</h3>
              <p className="mt-1 text-sm text-amber-700">
                These shipping options apply only to manually added products. Products imported from Amazon, Alibaba, 
                and other platforms will automatically use their respective shipping services.
              </p>
            </div>
          </div>
        </div>

        {manualProductCount === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-blue-600" />
              <div className="ml-3">
                <h3 className="text-lg font-medium text-blue-900">No Manual Products Found</h3>
                <p className="mt-1 text-blue-700">
                  You don't have any manually added products yet. You can still configure shipping options 
                  for future manual products, or go to the Products section to add some products first.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Providers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {shippingProviders.map((provider) => {
            const isSelected = selectedProviders.includes(provider.id);
            const IconComponent = provider.icon;
            
            return (
              <div
                key={provider.id}
                onClick={() => handleToggle(provider.id)}
                className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  getProviderColor(provider.color, isSelected)
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${isSelected ? 'bg-white' : 'bg-gray-100'}`}>
                      <IconComponent className={`w-6 h-6 ${getIconColor(provider.color)}`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">{provider.name}</h3>
                      <p className="text-sm text-gray-600">{provider.description}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircleIcon className="w-6 h-6 text-green-600" />
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Delivery Time:</span>
                    <span className="text-sm text-gray-900">{provider.estimatedTime}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Price Range:</span>
                    <span className="text-sm text-gray-900">{provider.priceRange}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Best For:</span>
                    <p className="text-sm text-gray-600 mt-1">{provider.bestFor}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Features:</span>
                    <ul className="text-sm text-gray-600 mt-1">
                      {provider.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <div>
            {selectedProviders.length > 0 && (
              <p className="text-sm text-gray-600">
                {selectedProviders.length} shipping option{selectedProviders.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
          <div className="flex gap-4">
            {selectedProviders.length > 0 && (
              <button
                onClick={() => setSelectedProviders([])}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Clear Selection
              </button>
            )}
            <button
              onClick={handleSaveShipping}
              disabled={selectedProviders.length === 0}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
            >
              {isStepCompleted('configureShipping') ? 'Update Shipping' : 'Save Shipping Options'}
            </button>
          </div>
        </div>

        {/* Summary */}
        {isStepCompleted('configureShipping') && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
              <h3 className="ml-2 text-lg font-medium text-green-900">Shipping Configuration Complete</h3>
            </div>
            <p className="text-green-700 mb-4">
              Your shipping options have been configured and will be available to customers during checkout 
              for manually added products.
            </p>
            <div className="text-sm text-green-600">
              <p><strong>Selected Options:</strong> {completionState.configureShipping.shippingMethods.join(', ')}</p>
              <p><strong>Configured:</strong> {new Date(completionState.configureShipping.completedAt || '').toLocaleDateString()}</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
