import DashboardLayout from '@/components/DashboardLayout';
import { useStoreOptional } from '@/contexts/StoreContext';
import { SafeStoreWrapper } from '@/components/withStoreProvider';
import { useState } from 'react';

function ImportDstoresContent() {
  const store = useStoreOptional();
  const [storeUrl, setStoreUrl] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<string | null>(null);

  const handleImport = async () => {
    if (!store) {
      alert('Store context not available');
      return;
    }

    if (!storeUrl || !accessToken) {
      alert('Please fill in all fields');
      return;
    }

    setIsImporting(true);
    setImportResult(null);

    try {
      // Simulate import process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock imported products
      const mockProducts = [
        {
          id: 'shop-1',
          name: 'Imported Product 1',
          price: 29.99,
          source: 'dstores' as const,
          image: 'https://via.placeholder.com/150'
        },
        {
          id: 'shop-2', 
          name: 'Imported Product 2',
          price: 49.99,
          source: 'dstores' as const,
          image: 'https://via.placeholder.com/150'
        }
      ];

      // Add products to store
      mockProducts.forEach(product => store.addProduct(product));
      
      setImportResult(`Successfully imported ${mockProducts.length} products from Dstores`);
    } catch (error) {
      setImportResult('Failed to import products. Please check your credentials.');
    } finally {
      setIsImporting(false);
    }
  };

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Dstores import...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Import from Dstores</h1>
      
      <div className="bg-white p-6 border rounded-lg space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dstores Store URL
          </label>
          <input
            type="text"
            value={storeUrl}
            onChange={(e) => setStoreUrl(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://your-store.mydstores.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Private App Access Token
          </label>
          <input
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="shppa_xxxxxxxxxxxxxxxxx"
          />
          <p className="mt-2 text-sm text-gray-500">
            You can create a private app in your Dstores admin to get an access token
          </p>
        </div>

        <button
          onClick={handleImport}
          disabled={isImporting || !storeUrl || !accessToken}
          className={`w-full py-3 px-4 rounded-md font-medium text-white ${
            isImporting || !storeUrl || !accessToken
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isImporting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Importing Products...
            </div>
          ) : (
            'Import Products'
          )}
        </button>

        {importResult && (
          <div className={`p-4 rounded-md ${
            importResult.includes('Successfully') 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {importResult}
          </div>
        )}

        {store.products.length > 0 && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
            <h3 className="font-medium text-gray-900 mb-2">Current Products: {store.products.length}</h3>
            <div className="space-y-1 text-sm text-gray-600">
              {store.products.slice(0, 5).map(product => (
                <div key={product.id} className="flex justify-between">
                  <span>{product.name}</span>
                  <span>${product.price}</span>
                </div>
              ))}
              {store.products.length > 5 && (
                <div className="text-gray-500 italic">
                  ... and {store.products.length - 5} more
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <h3 className="font-medium text-blue-900 mb-2">Need Help?</h3>
        <p className="text-sm text-blue-700">
          To get your Dstores access token:
        </p>
        <ol className="list-decimal list-inside text-sm text-blue-700 mt-2 space-y-1">
          <li>Go to your Dstores admin</li>
          <li>Navigate to Apps → "Develop apps"</li>
          <li>Create a private app with appropriate permissions</li>
          <li>Copy the Admin API access token</li>
        </ol>
      </div>
    </div>
  );
}

export default function ImportDstores() {
  return (
    <DashboardLayout>
      <SafeStoreWrapper>
        <ImportDstoresContent />
      </SafeStoreWrapper>
    </DashboardLayout>
  );
}
