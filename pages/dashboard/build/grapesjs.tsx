import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/DashboardLayout';
import { ArrowLeftIcon, ArrowTopRightOnSquareIcon, BookmarkSquareIcon } from '@heroicons/react/24/outline';
import { BuilderComponent, builder, useIsPreviewing } from '@builder.io/react';
import { 
  ProductCard, 
  ProductGrid, 
  HeroSection, 
  CartWidget, 
  CategoryCard,
  NewsletterSignup,
  FeatureHighlight,
  registerBuilderComponents 
} from '@/components/builder/EcommerceComponents';

// Initialize Builder with your API key
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || 'YOUR_BUILDER_API_KEY');

// Register all e-commerce components
registerBuilderComponents();

export default function VisualBuilder() {
  const router = useRouter();
  const [builderContent, setBuilderContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentModel, setCurrentModel] = useState('page');
  const isPreviewing = useIsPreviewing();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Try to get existing content or create a new page
        const content = await builder
          .get(currentModel, {
            userAttributes: {
              urlPath: '/store-builder',
            },
          })
          .toPromise();
        
        setBuilderContent(content);
      } catch (error) {
        console.error('Error fetching Builder content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [currentModel]);

  const handleSaveProject = async () => {
    try {
      // In a real implementation, you would save the current state
      console.log('Saving project...', builderContent);
      // You could make an API call to save to your database here
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project');
    }
  };

  const handlePreview = () => {
    // Open preview in new tab
    const previewUrl = `/store-preview?model=${currentModel}`;
    window.open(previewUrl, '_blank');
  };

  const handleCreateNew = () => {
    setBuilderContent(null);
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              Back
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Store Builder</h1>
              <p className="text-sm text-gray-500">Drag and drop to build your store</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <select 
              value={currentModel} 
              onChange={(e) => setCurrentModel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="page">Full Page</option>
              <option value="section">Page Section</option>
              <option value="product-page">Product Page</option>
            </select>

            <button
              onClick={handleCreateNew}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New
            </button>
            
            <button
              onClick={handleSaveProject}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <BookmarkSquareIcon className="w-4 h-4" />
              Save
            </button>
            
            <button
              onClick={handlePreview}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowTopRightOnSquareIcon className="w-4 h-4" />
              Preview
            </button>
          </div>
        </div>

        {/* Builder Interface */}
        <div className="flex-1 bg-gray-50 flex">
          {/* Component Palette - Left Sidebar */}
          <div className="w-64 bg-white border-r border-gray-200 p-4 overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Components</h3>
            
            <div className="space-y-4">
              {/* Layout Components */}
              <div>
                <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Layout</h4>
                <div className="space-y-2">
                  <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors group">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Hero Section</span>
                    </div>
                  </div>

                  <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-green-50 hover:border-green-300 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Product Grid</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* E-commerce Components */}
              <div>
                <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">E-commerce</h4>
                <div className="space-y-2">
                  <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 hover:border-purple-300 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Product Card</span>
                    </div>
                  </div>

                  <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-orange-50 hover:border-orange-300 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Cart Widget</span>
                    </div>
                  </div>

                  <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Category Card</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Marketing Components */}
              <div>
                <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Marketing</h4>
                <div className="space-y-2">
                  <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-pink-50 hover:border-pink-300 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-pink-100 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Newsletter</span>
                    </div>
                  </div>

                  <div className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-teal-50 hover:border-teal-300 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-teal-100 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">Features</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Builder Area */}
          <div className="flex-1 p-6">
            {!builderContent && !isPreviewing ? (
              // Default content when no Builder content exists
              <div className="h-full flex items-center justify-center">
                <div className="text-center max-w-2xl">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Start Building Your Store</h2>
                  <p className="text-gray-600 mb-8">Use the components on the left to create your perfect e-commerce experience. Drag and drop to get started!</p>
                  
                  {/* Sample builder interface */}
                  <div className="bg-white rounded-lg shadow-sm border p-6 space-y-8">
                    <HeroSection />
                    <ProductGrid />
                    <FeatureHighlight />
                    <NewsletterSignup />
                  </div>
                  
                  <CartWidget itemCount={3} />
                </div>
              </div>
            ) : (
              // Render Builder content
              <div className="h-full bg-white rounded-lg shadow-sm border overflow-hidden">
                <BuilderComponent 
                  model={currentModel} 
                  content={builderContent || undefined}
                  apiKey={process.env.NEXT_PUBLIC_BUILDER_API_KEY}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 