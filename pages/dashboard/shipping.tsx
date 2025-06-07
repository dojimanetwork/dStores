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
  PlusIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  CloudIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

interface CustomShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: number;
  description: string;
}

interface ShippingFulfillmentProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  features: string[];
  integrationComplexity: 'Easy' | 'Medium' | 'Advanced';
  monthlyFee: string;
  perShipmentFee: string;
  supportedServices: string[];
  apiDocumentation: string;
  setupTime: string;
  color: string;
  icon: React.ComponentType<any>;
}

const fulfillmentProviders: ShippingFulfillmentProvider[] = [
  {
    id: 'fedex',
    name: 'FedEx',
    logo: '🚚',
    description: 'Global express transportation and logistics services',
    features: ['Real-time tracking', 'International shipping', 'Same-day delivery', 'Packaging services'],
    integrationComplexity: 'Medium',
    monthlyFee: '$0 - $50',
    perShipmentFee: '$0.10 - $2.50',
    supportedServices: ['Ground', 'Express', 'International', 'Freight'],
    apiDocumentation: 'https://developer.fedex.com',
    setupTime: '2-5 business days',
    color: 'purple',
    icon: TruckIcon
  },
  {
    id: 'ups',
    name: 'UPS',
    logo: '📦',
    description: 'United Parcel Service worldwide shipping and logistics',
    features: ['Package tracking', 'Delivery notifications', 'Carbon neutral shipping', 'Pickup services'],
    integrationComplexity: 'Medium',
    monthlyFee: '$0 - $40',
    perShipmentFee: '$0.08 - $2.00',
    supportedServices: ['Ground', 'Air', 'International', 'Freight'],
    apiDocumentation: 'https://developer.ups.com',
    setupTime: '1-3 business days',
    color: 'yellow',
    icon: TruckIcon
  },
  {
    id: 'usps',
    name: 'USPS',
    logo: '🏛️',
    description: 'United States Postal Service nationwide delivery',
    features: ['Priority mail', 'Certified mail', 'PO Box delivery', 'Rural delivery'],
    integrationComplexity: 'Easy',
    monthlyFee: '$0',
    perShipmentFee: '$0.05 - $1.50',
    supportedServices: ['First-Class', 'Priority', 'Express', 'Media Mail'],
    apiDocumentation: 'https://www.usps.com/business/web-tools-apis',
    setupTime: '1-2 business days',
    color: 'blue',
    icon: BuildingOfficeIcon
  },
  {
    id: 'dhl',
    name: 'DHL',
    logo: '✈️',
    description: 'International express mail services and logistics',
    features: ['International express', 'Customs clearance', 'Door-to-door delivery', 'Supply chain solutions'],
    integrationComplexity: 'Advanced',
    monthlyFee: '$25 - $100',
    perShipmentFee: '$0.15 - $3.00',
    supportedServices: ['Express', 'International', 'eCommerce', 'Supply Chain'],
    apiDocumentation: 'https://developer.dhl.com',
    setupTime: '3-7 business days',
    color: 'red',
    icon: GlobeAltIcon
  },
  {
    id: 'shipstation',
    name: 'ShipStation',
    logo: '🚢',
    description: 'Multi-carrier shipping software platform',
    features: ['Multi-carrier support', 'Bulk shipping', 'Inventory management', 'Returns processing'],
    integrationComplexity: 'Easy',
    monthlyFee: '$9 - $159',
    perShipmentFee: '$0.09 - $0.15',
    supportedServices: ['All major carriers', 'International', 'Local delivery', 'Custom rates'],
    apiDocumentation: 'https://www.shipstation.com/docs/api',
    setupTime: '30 minutes - 1 day',
    color: 'indigo',
    icon: CloudIcon
  },
  {
    id: 'easypost',
    name: 'EasyPost',
    logo: '📮',
    description: 'Shipping API platform for developers',
    features: ['Unified API', 'Rate shopping', 'Address validation', 'Webhook notifications'],
    integrationComplexity: 'Easy',
    monthlyFee: '$0',
    perShipmentFee: '$0.05 - $0.25',
    supportedServices: ['100+ carriers', 'International', 'Last-mile delivery', 'Freight'],
    apiDocumentation: 'https://www.easypost.com/docs/api',
    setupTime: '1-2 hours',
    color: 'green',
    icon: RocketLaunchIcon
  }
];

interface Product {
  id: string;
  name: string;
  source?: string;
  price: number;
}

export default function Shipping() {
  const setupCompletion = useSetupCompletion();
  const [customShippingOptions, setCustomShippingOptions] = useState<CustomShippingOption[]>([]);
  const [selectedFulfillmentProviders, setSelectedFulfillmentProviders] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manualProductCount, setManualProductCount] = useState(0);
  const [importedProductCount, setImportedProductCount] = useState(0);
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'custom' | 'fulfillment'>('custom');
  
  // New integration modal states
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [selectedIntegrationProvider, setSelectedIntegrationProvider] = useState<ShippingFulfillmentProvider | null>(null);
  const [integrationStep, setIntegrationStep] = useState(1);
  const [providerCredentials, setProviderCredentials] = useState<Record<string, any>>({});

  // Custom shipping form state
  const [newShippingName, setNewShippingName] = useState('');
  const [newShippingPrice, setNewShippingPrice] = useState('');
  const [newShippingDays, setNewShippingDays] = useState('');
  const [newShippingDescription, setNewShippingDescription] = useState('');

  // Safely handle context values with fallbacks
  const markConfigureShippingComplete = setupCompletion?.markConfigureShippingComplete || (() => {});
  const isStepCompleted = setupCompletion?.isStepCompleted || (() => false);
  const completionState = setupCompletion?.completionState || {
    configureShipping: {
      completed: false,
      shippingMethods: [],
      completedAt: null,
    }
  };

  // Load existing shipping configuration
  useEffect(() => {
    const loadShippingConfig = async () => {
      try {
        const response = await fetch('/api/shipping?storeId=1');
        if (response.ok) {
          const data = await response.json();
          if (data.customOptions) {
            setCustomShippingOptions(data.customOptions);
          }
          if (data.fulfillmentProviders) {
            setSelectedFulfillmentProviders(data.fulfillmentProviders);
          }
        }
      } catch (err) {
        console.error('Error loading shipping configuration:', err);
      }
    };
    loadShippingConfig();
  }, []);

  // Load products to categorize manual vs imported
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setError(null);
        const response = await fetch('/api/products?storeId=1');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        const productsData = data.products || [];
        
        setProducts(productsData);
        
        // Count manual vs imported products
        const manual = productsData.filter((p: any) => {
          const source = p.source || p.metadata?.source;
          return !source || source === 'manual' || source === 'seed';
        }).length;
        const imported = productsData.filter((p: any) => {
          const source = p.source || p.metadata?.source;
          return source && ['dstores', 'amazon', 'alibaba'].includes(source);
        }).length;
        
        setManualProductCount(manual);
        setImportedProductCount(imported);
        setError(null);
        
      } catch (err) {
        console.error('Error loading products:', err);
        setError(`Failed to load products: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setManualProductCount(0);
        setImportedProductCount(0);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      loadProducts();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Fallback timeout to prevent infinite loading
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (loading) {
        console.warn('Shipping page loading timeout - forcing render');
        setLoading(false);
      }
    }, 5000);

    return () => clearTimeout(fallbackTimer);
  }, [loading]);

  const handleAddCustomShipping = () => {
    if (!newShippingName || !newShippingPrice || !newShippingDays) {
      setError('Please fill in all required fields');
      return;
    }

    const newOption: CustomShippingOption = {
      id: Date.now().toString(),
      name: newShippingName,
      price: parseFloat(newShippingPrice),
      estimatedDays: parseInt(newShippingDays),
      description: newShippingDescription
    };

    setCustomShippingOptions(prev => [...prev, newOption]);
    
    // Reset form
    setNewShippingName('');
    setNewShippingPrice('');
    setNewShippingDays('');
    setNewShippingDescription('');
    setShowCustomForm(false);
    setError(null);
  };

  const handleRemoveCustomShipping = (id: string) => {
    setCustomShippingOptions(prev => prev.filter(option => option.id !== id));
  };

  const handleToggleFulfillmentProvider = (id: string) => {
    const provider = fulfillmentProviders.find(p => p.id === id);
    if (!provider) return;

    if (selectedFulfillmentProviders.includes(id)) {
      // If already selected, remove it
      setSelectedFulfillmentProviders(prev => prev.filter(p => p !== id));
    } else {
      // If not selected, show integration modal
      setSelectedIntegrationProvider(provider);
      setShowIntegrationModal(true);
      setIntegrationStep(1);
    }
  };

  const handleCompleteIntegration = () => {
    if (selectedIntegrationProvider) {
      setSelectedFulfillmentProviders(prev => [...prev, selectedIntegrationProvider.id]);
      setShowIntegrationModal(false);
      setSelectedIntegrationProvider(null);
      setIntegrationStep(1);
      setProviderCredentials({});
    }
  };

  const handleSkipIntegration = () => {
    if (selectedIntegrationProvider) {
      setSelectedFulfillmentProviders(prev => [...prev, selectedIntegrationProvider.id]);
      setShowIntegrationModal(false);
      setSelectedIntegrationProvider(null);
      setIntegrationStep(1);
      setProviderCredentials({});
    }
  };

  const getIntegrationSteps = (provider: ShippingFulfillmentProvider) => {
    const baseSteps = [
      {
        title: "Create Account",
        description: `Sign up for a ${provider.name} developer account`,
        action: `Visit ${provider.apiDocumentation}`,
        status: "pending"
      },
      {
        title: "Get API Credentials",
        description: "Obtain your API keys and credentials",
        action: "Generate API keys in your developer dashboard",
        status: "pending"
      },
      {
        title: "Configure Integration",
        description: "Enter your API credentials in dStores",
        action: "Enter credentials below",
        status: "pending"
      },
      {
        title: "Test Connection",
        description: "Verify the integration works correctly",
        action: "Test API connection",
        status: "pending"
      }
    ];

    // Provider-specific steps
    switch (provider.id) {
      case 'fedex':
        baseSteps[1].description = "Get FedEx Web Services Key, Password, Account Number, and Meter Number";
        break;
      case 'ups':
        baseSteps[1].description = "Get UPS Access License Number, Username, and Password";
        break;
      case 'usps':
        baseSteps[1].description = "Get USPS Web Tools User ID";
        break;
      case 'dhl':
        baseSteps[1].description = "Get DHL API Key and Secret";
        break;
      case 'shipstation':
        baseSteps[1].description = "Get ShipStation API Key and API Secret";
        break;
      case 'easypost':
        baseSteps[1].description = "Get EasyPost API Key (Test and Production)";
        break;
    }

    return baseSteps;
  };

  const renderCredentialFields = (provider: ShippingFulfillmentProvider) => {
    const updateCredential = (key: string, value: string) => {
      setProviderCredentials(prev => ({
        ...prev,
        [key]: value
      }));
    };

    switch (provider.id) {
      case 'fedex':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Web Services Key</label>
              <input
                type="text"
                value={providerCredentials.webServicesKey || ''}
                onChange={(e) => updateCredential('webServicesKey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your FedEx Web Services Key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={providerCredentials.password || ''}
                onChange={(e) => updateCredential('password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your FedEx Password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
              <input
                type="text"
                value={providerCredentials.accountNumber || ''}
                onChange={(e) => updateCredential('accountNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your FedEx Account Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meter Number</label>
              <input
                type="text"
                value={providerCredentials.meterNumber || ''}
                onChange={(e) => updateCredential('meterNumber', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your FedEx Meter Number"
              />
            </div>
          </div>
        );
      
      case 'ups':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Access License Number</label>
              <input
                type="text"
                value={providerCredentials.accessLicense || ''}
                onChange={(e) => updateCredential('accessLicense', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your UPS Access License Number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <input
                type="text"
                value={providerCredentials.username || ''}
                onChange={(e) => updateCredential('username', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your UPS Username"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={providerCredentials.password || ''}
                onChange={(e) => updateCredential('password', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your UPS Password"
              />
            </div>
          </div>
        );

      case 'usps':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
              <input
                type="text"
                value={providerCredentials.userId || ''}
                onChange={(e) => updateCredential('userId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your USPS Web Tools User ID"
              />
            </div>
          </div>
        );

      case 'shipstation':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <input
                type="text"
                value={providerCredentials.apiKey || ''}
                onChange={(e) => updateCredential('apiKey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your ShipStation API Key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Secret</label>
              <input
                type="password"
                value={providerCredentials.apiSecret || ''}
                onChange={(e) => updateCredential('apiSecret', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your ShipStation API Secret"
              />
            </div>
          </div>
        );

      case 'easypost':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test API Key</label>
              <input
                type="text"
                value={providerCredentials.testApiKey || ''}
                onChange={(e) => updateCredential('testApiKey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your EasyPost Test API Key"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Production API Key</label>
              <input
                type="text"
                value={providerCredentials.prodApiKey || ''}
                onChange={(e) => updateCredential('prodApiKey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your EasyPost Production API Key"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
              <input
                type="text"
                value={providerCredentials.apiKey || ''}
                onChange={(e) => updateCredential('apiKey', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your API Key"
              />
            </div>
          </div>
        );
    }
  };

  const handleSaveShipping = async () => {
    if (customShippingOptions.length === 0 && selectedFulfillmentProviders.length === 0) {
      setError('Please add at least one shipping option or select a fulfillment provider');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/shipping?storeId=1', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customOptions: customShippingOptions,
          fulfillmentProviders: selectedFulfillmentProviders,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save shipping configuration');
      }

      const result = await response.json();
      console.log('Shipping configuration saved:', result);
      
      // Mark as complete in the setup context
      const allOptions = [
        ...customShippingOptions.map(opt => opt.name),
        ...selectedFulfillmentProviders
      ];
      markConfigureShippingComplete(allOptions);
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
      purple: selected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300',
      yellow: selected ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 hover:border-yellow-300',
      red: selected ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-300',
      green: selected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300',
      indigo: selected ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-indigo-300',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Show loading screen if context is not available yet
  if (!setupCompletion) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Initializing shipping configuration...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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

  try {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Shipping Configuration</h1>
                <p className="mt-2 text-gray-600">Set up custom shipping options and connect with fulfillment providers</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <p className="mt-2 text-sm text-gray-500">Need shipping setup</p>
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
                  <p className="text-sm font-medium text-gray-600">Custom Options</p>
                  <p className="text-2xl font-bold text-gray-900">{customShippingOptions.length}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">Your shipping methods</p>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <BuildingOfficeIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Fulfillment Partners</p>
                  <p className="text-2xl font-bold text-gray-900">{selectedFulfillmentProviders.length}</p>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-500">Connected providers</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('custom')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'custom'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Custom Shipping Options
              </button>
              <button
                onClick={() => setActiveTab('fulfillment')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'fulfillment'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Fulfillment Providers
              </button>
            </nav>
          </div>

          {/* Custom Shipping Options Tab */}
          {activeTab === 'custom' && (
            <div className="space-y-6">
              {/* Add Custom Shipping Button */}
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Your Custom Shipping Options</h3>
                  <p className="text-sm text-gray-600">Create custom shipping methods with your own pricing</p>
                </div>
                <button
                  onClick={() => setShowCustomForm(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Custom Option
                </button>
              </div>

              {/* Custom Shipping Form */}
              {showCustomForm && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Add Custom Shipping Option</h4>
                    <button
                      onClick={() => setShowCustomForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shipping Method Name *
                      </label>
                      <input
                        type="text"
                        value={newShippingName}
                        onChange={(e) => setNewShippingName(e.target.value)}
                        placeholder="e.g., Standard Delivery"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (USD) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={newShippingPrice}
                        onChange={(e) => setNewShippingPrice(e.target.value)}
                        placeholder="9.99"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Delivery Days *
                      </label>
                      <input
                        type="number"
                        value={newShippingDays}
                        onChange={(e) => setNewShippingDays(e.target.value)}
                        placeholder="5"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description (Optional)
                      </label>
                      <input
                        type="text"
                        value={newShippingDescription}
                        onChange={(e) => setNewShippingDescription(e.target.value)}
                        placeholder="Standard ground shipping"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setShowCustomForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddCustomShipping}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add Shipping Option
                    </button>
                  </div>
                </div>
              )}

              {/* Custom Shipping Options List */}
              {customShippingOptions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customShippingOptions.map((option) => (
                    <div key={option.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{option.name}</h4>
                          <p className="text-2xl font-bold text-blue-600">${option.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-600">{option.estimatedDays} business days</p>
                          {option.description && (
                            <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemoveCustomShipping(option.id)}
                          className="text-red-400 hover:text-red-600 p-1"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <TruckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Custom Shipping Options</h3>
                  <p className="text-gray-600 mb-4">Create your own shipping methods with custom pricing and delivery times</p>
                  <button
                    onClick={() => setShowCustomForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Shipping Option
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Fulfillment Providers Tab */}
          {activeTab === 'fulfillment' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect with Shipping Providers</h3>
                <p className="text-sm text-gray-600 mb-6">Choose professional fulfillment partners to handle your shipping automatically</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {fulfillmentProviders.map((provider) => {
                  const isSelected = selectedFulfillmentProviders.includes(provider.id);
                  const IconComponent = provider.icon;
                  
                  return (
                    <div
                      key={provider.id}
                      className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        getProviderColor(provider.color, isSelected)
                      }`}
                      onClick={() => handleToggleFulfillmentProvider(provider.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center">
                          <div className={`p-3 rounded-lg ${isSelected ? 'bg-white' : 'bg-gray-100'}`}>
                            <span className="text-2xl mr-2">{provider.logo}</span>
                            <IconComponent className={`w-6 h-6 inline text-${provider.color}-600`} />
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
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Integration:</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${getComplexityColor(provider.integrationComplexity)}`}>
                            {provider.integrationComplexity}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Monthly Fee:</span>
                            <p className="text-gray-900">{provider.monthlyFee}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Per Shipment:</span>
                            <p className="text-gray-900">{provider.perShipmentFee}</p>
                          </div>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-gray-700">Setup Time:</span>
                          <p className="text-sm text-gray-600">{provider.setupTime}</p>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-gray-700">Services:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {provider.supportedServices.slice(0, 3).map((service, index) => (
                              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                {service}
                              </span>
                            ))}
                            {provider.supportedServices.length > 3 && (
                              <span className="text-xs text-gray-500">+{provider.supportedServices.length - 3} more</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <span className="text-sm font-medium text-gray-700">Key Features:</span>
                          <ul className="text-sm text-gray-600 mt-1">
                            {provider.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {isSelected && (
                          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                            <p className="text-sm text-blue-800 font-medium">✓ Ready to integrate</p>
                            <p className="text-xs text-blue-600 mt-1">
                              Visit: {provider.apiDocumentation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
          <div className="flex justify-between items-center mt-8">
            <div>
              {(customShippingOptions.length > 0 || selectedFulfillmentProviders.length > 0) && (
                <p className="text-sm text-gray-600">
                  {customShippingOptions.length} custom option{customShippingOptions.length !== 1 ? 's' : ''}, {selectedFulfillmentProviders.length} provider{selectedFulfillmentProviders.length !== 1 ? 's' : ''} selected
                </p>
              )}
            </div>
            <div className="flex gap-4">
              {(customShippingOptions.length > 0 || selectedFulfillmentProviders.length > 0) && (
                <button
                  onClick={() => {
                    setCustomShippingOptions([]);
                    setSelectedFulfillmentProviders([]);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={handleSaveShipping}
                disabled={customShippingOptions.length === 0 && selectedFulfillmentProviders.length === 0}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors"
              >
                {isStepCompleted('configureShipping') ? 'Update Shipping' : 'Save Shipping Configuration'}
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
                Your shipping configuration is ready. Customers will see these options during checkout for manually added products.
              </p>
              <div className="text-sm text-green-600">
                <p><strong>Total Shipping Options:</strong> {customShippingOptions.length + selectedFulfillmentProviders.length}</p>
                <p><strong>Last Updated:</strong> {new Date().toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* Integration Modal */}
          {showIntegrationModal && selectedIntegrationProvider && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{selectedIntegrationProvider.logo}</span>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                          Integrate {selectedIntegrationProvider.name}
                        </h2>
                        <p className="text-gray-600">{selectedIntegrationProvider.description}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowIntegrationModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Integration Steps */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Integration Steps</h3>
                    <div className="space-y-4">
                      {getIntegrationSteps(selectedIntegrationProvider).map((step, index) => (
                        <div
                          key={index}
                          className={`flex items-start p-4 rounded-lg border ${
                            integrationStep > index + 1
                              ? 'bg-green-50 border-green-200'
                              : integrationStep === index + 1
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <div
                            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                              integrationStep > index + 1
                                ? 'bg-green-500 text-white'
                                : integrationStep === index + 1
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-300 text-gray-600'
                            }`}
                          >
                            {integrationStep > index + 1 ? '✓' : index + 1}
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="font-medium text-gray-900">{step.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                            <p className="text-sm text-blue-600 mt-1">{step.action}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Step Content */}
                  {integrationStep === 1 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Step 1: Create Developer Account</h4>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                        <div className="flex">
                          <InformationCircleIcon className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div className="ml-3">
                            <p className="text-sm text-yellow-800">
                              You'll need a {selectedIntegrationProvider.name} developer account to get API access.
                              This typically takes {selectedIntegrationProvider.setupTime} to set up.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Developer Portal</p>
                          <p className="text-sm text-gray-600">{selectedIntegrationProvider.apiDocumentation}</p>
                        </div>
                        <a
                          href={selectedIntegrationProvider.apiDocumentation}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Open Portal
                        </a>
                      </div>
                    </div>
                  )}

                  {integrationStep === 3 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Step 3: Configure Credentials</h4>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <div className="flex">
                          <InformationCircleIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div className="ml-3">
                            <p className="text-sm text-blue-800">
                              Enter your API credentials below. These will be encrypted and stored securely.
                            </p>
                          </div>
                        </div>
                      </div>
                      {renderCredentialFields(selectedIntegrationProvider)}
                    </div>
                  )}

                  {/* Cost Information */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Pricing Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Monthly Fee:</span>
                        <p className="text-gray-900">{selectedIntegrationProvider.monthlyFee}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Per Shipment:</span>
                        <p className="text-gray-900">{selectedIntegrationProvider.perShipmentFee}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-between">
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowIntegrationModal(false)}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSkipIntegration}
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Set Up Later
                      </button>
                    </div>
                    <div className="flex gap-3">
                      {integrationStep > 1 && (
                        <button
                          onClick={() => setIntegrationStep(prev => prev - 1)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          Previous
                        </button>
                      )}
                      {integrationStep < 4 ? (
                        <button
                          onClick={() => setIntegrationStep(prev => prev + 1)}
                          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          onClick={handleCompleteIntegration}
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Complete Integration
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    );
  } catch (renderError) {
    console.error('Error rendering shipping page:', renderError);
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-900">Error Loading Shipping Configuration</h3>
                <p className="mt-1 text-red-700">
                  There was an error loading the shipping page. Please try refreshing the page or contact support if the issue persists.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }
}
