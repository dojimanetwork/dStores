import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  image: string;
  inStock: boolean;
  category: string;
}

interface TemplateData {
  templateId: string;
  products: Product[];
  featuredProducts: Product[];
  totalProducts: number;
}

interface DynamicTemplateProps {
  templateId: string;
  storeId?: number;
}

export default function SimpleDynamicTemplate({ templateId, storeId = 1 }: DynamicTemplateProps) {
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplateData();
  }, [templateId, storeId]);

  const fetchTemplateData = async () => {
    try {
      const response = await fetch(`/api/templates/${templateId}/products?storeId=${storeId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch template data');
      }
      const data = await response.json();
      setTemplateData(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your store...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchTemplateData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!templateData) {
    return null;
  }

  // Render different templates based on templateId
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="text-xl font-bold">Web3 Store</span>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">Products</a>
            <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
          </nav>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Connect Wallet</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to the Future</h1>
          <p className="text-xl mb-8">Discover amazing Web3 products and experiences</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold">
            Explore Products
          </button>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Products</h2>
          {templateData.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {templateData.products.slice(0, 6).map((product) => (
                <div key={product.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-blue-600">{product.formattedPrice}</span>
                      <button 
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        disabled={!product.inStock}
                      >
                        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No products available. Add some products to see them here!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center space-x-2 justify-center mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg"></div>
            <span className="text-xl font-bold">Web3 Store</span>
          </div>
          <p className="text-gray-300 mb-4">
            Building the future of commerce with Web3 technology
          </p>
          <div className="border-t border-gray-800 mt-8 pt-8">
            <p className="text-gray-400">&copy; 2024 Web3 Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 