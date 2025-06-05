import DashboardLayout from '@/components/DashboardLayout';
import { useStore, useStoreOptional } from '@/contexts/StoreContext';
import { SafeStoreWrapper } from '@/components/withStoreProvider';
import { useState, useEffect } from 'react';

const paymentOptions = [
  { id: 'stripe', name: 'Stripe', description: 'Accept credit cards' },
  { id: 'paypal', name: 'PayPal', description: 'PayPal payments' },
  { id: 'crypto', name: 'Crypto Payments', description: 'Accept cryptocurrency' },
];

function PaymentsContent() {
  const store = useStoreOptional();
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  useEffect(() => {
    if (store?.paymentProviders) {
      setSelectedProviders(store.paymentProviders);
    }
  }, [store?.paymentProviders]);

  const handleProviderToggle = (providerId: string) => {
    const newProviders = selectedProviders.includes(providerId)
      ? selectedProviders.filter(id => id !== providerId)
      : [...selectedProviders, providerId];
    
    setSelectedProviders(newProviders);
    store?.setPaymentProviders(newProviders);
  };

  if (!store) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Payment Setup</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentOptions.map((option) => (
          <div
            key={option.id}
            className={`p-6 border rounded-lg cursor-pointer transition-all ${
              selectedProviders.includes(option.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleProviderToggle(option.id)}
          >
            <h3 className="font-semibold mb-2">{option.name}</h3>
            <p className="text-gray-600 text-sm">{option.description}</p>
          </div>
        ))}
      </div>

      {selectedProviders.length > 0 && (
        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="font-medium text-green-800 mb-2">Selected Payment Providers:</h3>
          <ul className="list-disc list-inside text-green-700">
            {selectedProviders.map(providerId => {
              const provider = paymentOptions.find(p => p.id === providerId);
              return <li key={providerId}>{provider?.name}</li>;
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function Payments() {
  return (
    <DashboardLayout>
      <SafeStoreWrapper>
        <PaymentsContent />
      </SafeStoreWrapper>
    </DashboardLayout>
  );
}
