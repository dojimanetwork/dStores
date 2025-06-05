import DashboardLayout from '@/components/DashboardLayout';
import { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  RocketLaunchIcon,
  EyeIcon,
  GlobeAltIcon,
  CubeIcon,
  TruckIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';

export default function ReviewDeploy() {
  const [deploymentStatus, setDeploymentStatus] = useState<'ready' | 'deploying' | 'deployed' | 'error'>('ready');
  const [checks, setChecks] = useState({
    website: false,
    products: false,
    shipping: false,
    payments: false
  });

  useEffect(() => {
    // Simulate checking setup completion
    const checkSetup = async () => {
      try {
        // Check if website is built
        const websiteCheck = true; // Placeholder

        // Check if products are added
        const productsResponse = await fetch('/api/products?storeId=1');
        const productsData = await productsResponse.json();
        const hasProducts = productsData.products?.length > 0;

        // Check shipping and payments (placeholder)
        const shippingCheck = true; // Placeholder
        const paymentsCheck = true; // Placeholder

        setChecks({
          website: websiteCheck,
          products: hasProducts,
          shipping: shippingCheck,
          payments: paymentsCheck
        });
      } catch (error) {
        console.error('Error checking setup:', error);
      }
    };

    checkSetup();
  }, []);

  const allChecksComplete = Object.values(checks).every(check => check);

  const handleDeploy = async () => {
    setDeploymentStatus('deploying');
    
    // Simulate deployment process
    setTimeout(() => {
      setDeploymentStatus('deployed');
    }, 3000);
  };

  const handlePreview = () => {
    // Open preview in new window
    window.open('/dashboard/templates/modern-dropshipping', '_blank');
  };

  const setupItems = [
    {
      key: 'website',
      title: 'Website Built',
      description: 'Template selected and configured',
      icon: GlobeAltIcon,
      href: '/dashboard/build'
    },
    {
      key: 'products',
      title: 'Products Added',
      description: 'Product catalog set up',
      icon: CubeIcon,
      href: '/dashboard/products'
    },
    {
      key: 'shipping',
      title: 'Shipping Configured',
      description: 'Delivery methods set up',
      icon: TruckIcon,
      href: '/dashboard/shipping'
    },
    {
      key: 'payments',
      title: 'Payments Set Up',
      description: 'Payment methods configured',
      icon: CreditCardIcon,
      href: '/dashboard/payments'
    }
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
            Review & Deploy
          </h1>
          <p className="text-gray-600">
            Review your store setup and deploy to the world
          </p>
        </div>

        {/* Setup Checklist */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Setup Checklist</h2>
            <p className="text-sm text-gray-600 mt-1">
              Ensure all steps are complete before deploying
            </p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {setupItems.map((item) => {
                const IconComponent = item.icon;
                const isComplete = checks[item.key as keyof typeof checks];
                
                return (
                  <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isComplete ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {isComplete ? (
                          <CheckCircleIcon className="w-6 h-6 text-green-600" />
                        ) : (
                          <IconComponent className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {isComplete ? (
                        <span className="text-sm text-green-600 font-medium">Complete</span>
                      ) : (
                        <a 
                          href={item.href}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Configure
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Deployment Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Deploy Your Store</h2>
            <p className="text-sm text-gray-600 mt-1">
              Ready to go live? Deploy your store to the world
            </p>
          </div>
          <div className="p-6">
            {deploymentStatus === 'ready' && (
              <div className="text-center py-8">
                {allChecksComplete ? (
                  <div>
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircleIcon className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Ready to Deploy!
                    </h3>
                    <p className="text-gray-600 mb-6">
                      All setup steps are complete. Your store is ready to go live.
                    </p>
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={handlePreview}
                        className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <EyeIcon className="w-5 h-5 mr-2" />
                        Preview Store
                      </button>
                      <button
                        onClick={handleDeploy}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <RocketLaunchIcon className="w-5 h-5 mr-2" />
                        Deploy Store
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ExclamationTriangleIcon className="w-8 h-8 text-yellow-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Setup Incomplete
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Please complete all setup steps before deploying your store.
                    </p>
                    <button
                      disabled
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-400 cursor-not-allowed"
                    >
                      <RocketLaunchIcon className="w-5 h-5 mr-2" />
                      Deploy Store
                    </button>
                  </div>
                )}
              </div>
            )}

            {deploymentStatus === 'deploying' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Deploying Your Store...
                </h3>
                <p className="text-gray-600">
                  This may take a few moments. Please don't close this page.
                </p>
              </div>
            )}

            {deploymentStatus === 'deployed' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Store Deployed Successfully!
                </h3>
                <p className="text-gray-600 mb-6">
                  Your store is now live and accessible to customers.
                </p>
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-gray-600 mb-2">Your store URL:</p>
                  <p className="text-lg font-mono text-blue-600">https://your-store.dstores.app</p>
                </div>
                <div className="flex justify-center space-x-4">
                  <button className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    <GlobeAltIcon className="w-5 h-5 mr-2" />
                    Visit Store
                  </button>
                  <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                    Share Store
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 