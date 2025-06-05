import DashboardLayout from '@/components/DashboardLayout';
import { useStoreOptional } from '@/contexts/StoreContext';
import { SafeStoreWrapper } from '@/components/withStoreProvider';
import { useState, useEffect } from 'react';

function LaunchContent() {
  const store = useStoreOptional();
  const [customDomain, setCustomDomain] = useState('');
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    if (store?.domainName) {
      setCustomDomain(store.domainName);
    }
  }, [store?.domainName]);

  const handleDomainChange = (domain: string) => {
    setCustomDomain(domain);
    store?.setDomainName(domain);
  };

  const handleLaunch = async () => {
    setIsLaunching(true);
    // Simulate launch process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLaunching(false);
    alert('Store launched successfully!');
  };

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading launch settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Launch Your Store</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-6 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Domain Configuration</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Domain (optional)
              </label>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => handleDomainChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="yourdomain.com"
              />
              <p className="mt-2 text-sm text-gray-500">
                Leave blank to use the default subdomain
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Store Summary</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Template:</span>
              <span className="font-medium">{store.templateOption || 'Not selected'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Products:</span>
              <span className="font-medium">{store.products.length} items</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium">{store.shippingProvider || 'Not configured'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Payment Methods:</span>
              <span className="font-medium">{store.paymentProviders.length || 0} methods</span>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleLaunch}
            disabled={isLaunching}
            className={`px-8 py-3 rounded-lg font-medium text-white ${
              isLaunching 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isLaunching ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Launching...
              </div>
            ) : (
              'Launch Store'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Launch() {
  return (
    <DashboardLayout>
      <SafeStoreWrapper>
        <LaunchContent />
      </SafeStoreWrapper>
    </DashboardLayout>
  );
}
