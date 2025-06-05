// === SHOPIFY-STYLE UI WITH REAL AI LAYOUT GENERATION ===

import { ProductProvider, useProducts } from '../contexts/ProductContext';
import { ProductForm } from '../components/ProductForm';
import React, { useState, useEffect } from 'react';
import { useLayout } from '../contexts/LayoutContext';
import { DraggableElement } from '../components/DraggableElement';
import { 
  ShoppingBagIcon, 
  PhotoIcon, 
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { DroppableArea } from '../components/DroppableArea';
import { PreviewModal } from '../components/PreviewModal';
import { useRouter } from 'next/router';

const componentOptions = [
  { id: 'hero', label: 'Hero Section' },
  { id: 'featured-products', label: 'Featured Products (Home)' },
  { id: 'products-page', label: 'Products Page' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact Form' }
];

// Create a new component that uses the context
function StoreBuilder() {
  const { recentLayouts, addLayout } = useLayout();
  const [brand, setBrand] = useState("");
  const [industry, setIndustry] = useState("");
  const [layoutHTML, setLayoutHTML] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedComponents, setSelectedComponents] = useState<string[]>([
    'hero',
    'featured-products',
    'products-page'
  ]);
  const { products, removeProduct } = useProducts();
  const [activeTab, setActiveTab] = useState<'layout' | 'products'>('layout');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const toggleComponent = (type: string) => {
    setSelectedComponents(prev => 
      prev.includes(type) 
        ? prev.filter(comp => comp !== type)
        : [...prev, type]
    );
  };

  const generateLayout = async () => {
    if (!brand || !industry) {
      alert('Please fill in both brand name and industry');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          brand, 
          industry,
          components: selectedComponents,
          products
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate layout');
      }

      const data = await res.json();
      setLayoutHTML(data.result);
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('Error generating layout:', error);
      alert('Failed to generate layout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  

  const handleRegenerate = async (modifications: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          brand, 
          industry,
          components: selectedComponents,
          products,
          suggestedModifications: modifications
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to regenerate layout');
      }

      const data = await res.json();
      setLayoutHTML(data.result);
    } catch (error) {
      console.error('Error regenerating layout:', error);
      alert('Failed to regenerate layout. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const deployToVercel = async () => {
    const res = await fetch("/api/vercel-deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ html: layoutHTML, name: brand || "web3-store" }),
    });
    const data = await res.json();
    if (data.url) {
      window.open(data.url, "_blank");
    } else {
      alert("Deployment failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white border-r shadow-sm p-4">
        <h2 className="text-2xl font-semibold mb-6">Web3 Store Builder</h2>
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('layout')}
            className={`text-left w-full px-4 py-2 rounded ${activeTab === 'layout' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            Layout Builder
          </button>
          <button 
            onClick={() => setActiveTab('products')}
            className={`text-left w-full px-4 py-2 rounded ${activeTab === 'products' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
          >
            Products
          </button>
          <button className="text-left w-full px-4 py-2 hover:bg-gray-100 rounded">Templates</button>
        </nav>
      </aside>

      <main className="flex-1 p-10 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'layout' ? (
            <>
              <div className="mb-8 space-y-4">
                <input
                  type="text"
                  placeholder="Brand Name"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <h3 className="font-medium mb-4">Select Components</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {componentOptions.map(option => (
                      <button
                        key={option.id}
                        onClick={() => toggleComponent(option.id)}
                        className={`p-4 rounded-lg border flex items-center gap-2 ${
                          selectedComponents.includes(option.id) 
                            ? 'bg-blue-50 border-blue-500 text-blue-600' 
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <span>{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={generateLayout}
                  disabled={loading || selectedComponents.length === 0}
                  className={`w-full py-2 px-4 rounded ${
                    loading || selectedComponents.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {loading ? 'Generating...' : 'Generate Layout'}
                </button>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Layout Preview</h2>
                <div className="min-h-[600px] border-2 border-dashed border-gray-300 rounded-lg p-4">
                  {layoutHTML ? (
                    <div dangerouslySetInnerHTML={{ __html: layoutHTML }} />
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      Select components and generate layout to see preview
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold mb-6">Products Management</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Add Products</h2>
                  <ProductForm />
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h2 className="text-xl font-semibold mb-4">Product List</h2>
                  <div className="space-y-4">
                    {products.map(product => (
                      <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded">
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-gray-600">${product.price}</p>
                        </div>
                        <button 
                          onClick={() => removeProduct(product.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        layoutHTML={layoutHTML}
        onRegenerate={handleRegenerate}
        onConfirm={() => {
          setIsPreviewOpen(false);
          // Add any additional confirmation logic here
        }}
      />
    </div>
  );
}

// Main component that provides the context
export default function Home() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return null;
}
