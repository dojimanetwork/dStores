import DashboardLayout from '@/components/DashboardLayout';
import { useState } from 'react';

const shippingProviders = [
  { name: 'Standard Shipping', id: 'standard' },
  { name: 'Express Shipping', id: 'express' },
  { name: 'International Shipping', id: 'international' },
  { name: 'Local Delivery', id: 'local' },
];

export default function Shipping() {
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);

  const handleToggle = (id: string) => {
    setSelectedProviders(prev => 
      prev.includes(id) 
        ? prev.filter(p => p !== id)
        : [...prev, id]
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Configure Shipping</h1>
        
        <div className="space-y-4">
          {shippingProviders.map((provider) => (
            <div
              key={provider.id}
              onClick={() => handleToggle(provider.id)}
              className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                selectedProviders.includes(provider.id) ? 'border-blue-500 bg-blue-50' : ''
              }`}
            >
              <h2 className="text-lg font-semibold">{provider.name}</h2>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
