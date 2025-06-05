import React from 'react';
import { useRouter } from 'next/router';
import { Button } from '../components/ui/button';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ProductsPage() {
  const router = useRouter();
  const { products } = router.query;

  const parsedProducts = products ? JSON.parse(products as string) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          Back to Home
        </Button>

        <h1 className="text-3xl font-bold mb-8">All Products</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {parsedProducts.map((product: any, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-w-1 aspect-h-1 w-full">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-xl font-bold text-blue-600">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 