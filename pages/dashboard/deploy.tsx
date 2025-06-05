import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Button } from '../../components/ui/button';
import { useRouter } from 'next/router';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function DeploySetup() {
  const router = useRouter();
  const [domain, setDomain] = useState('');
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [isDomainAvailable, setIsDomainAvailable] = useState<boolean | null>(null);
  const [currentStep, setCurrentStep] = useState('website');

  const steps = [
    { id: 'website', label: 'Website Setup' },
    { id: 'products', label: 'Products' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'payments', label: 'Payments' },
    { id: 'deploy', label: 'Deploy' }
  ];

  const checkDomain = async () => {
    setIsCheckingDomain(true);
    // Add domain availability check logic here
    setTimeout(() => {
      setIsDomainAvailable(true);
      setIsCheckingDomain(false);
    }, 1000);
  };

  const handleNextStep = () => {
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Store Setup</h1>
        
        <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
          <TabsList className="grid grid-cols-5 mb-8">
            {steps.map((step) => (
              <TabsTrigger key={step.id} value={step.id}>
                {step.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="website">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Choose Your Website Setup Method</h2>
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => router.push('/dashboard/templates')} className="h-32">
                  Choose from Templates
                </Button>
                <Button onClick={() => router.push('/dashboard/ai-generate')} className="h-32">
                  Generate with AI
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Add Products</h2>
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={() => router.push('/dashboard/products/manual')} className="h-32">
                  Add Products Manually
                </Button>
                <Button onClick={() => router.push('/dashboard/products/import')} className="h-32">
                  Import from Existing Store
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="shipping">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Choose Shipping Provider</h2>
              {/* Add shipping provider selection UI here */}
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Payment Setup</h2>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold">Dojima Crypto Payments</h3>
                  <p className="text-sm text-gray-600">Default payment method</p>
                </div>
                <Button onClick={() => router.push('/dashboard/payments/add')}>
                  Add Additional Payment Methods
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="deploy">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Choose Your Domain</h2>
              
              <div className="flex gap-4 mb-6">
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="your-store-name"
                  className="flex-1 px-4 py-2 border rounded-lg"
                />
                <span className="flex items-center text-gray-500">.dojima.store</span>
              </div>

              <Button 
                onClick={checkDomain}
                disabled={!domain || isCheckingDomain}
                className="mb-4"
              >
                {isCheckingDomain ? 'Checking...' : 'Check Availability'}
              </Button>

              {isDomainAvailable !== null && (
                <div className={`p-4 rounded-lg ${
                  isDomainAvailable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {isDomainAvailable 
                    ? 'Domain is available!' 
                    : 'Domain is not available. Please try another name.'}
                </div>
              )}

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Preview Your Store</h3>
                <Button 
                  onClick={() => router.push('/preview')}
                  className="w-full mb-4"
                >
                  View Live Preview
                </Button>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Ready to Go Live?</h3>
                <Button 
                  onClick={() => router.push('/dashboard/deploy/confirm')}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!isDomainAvailable}
                >
                  Deploy Store
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {currentStep !== 'deploy' && (
          <div className="mt-6 flex justify-end">
            <Button onClick={handleNextStep}>
              Next Step
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
} 