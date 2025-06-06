import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { BuilderComponent, builder } from '@builder.io/react';
import Head from 'next/head';
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

// Initialize Builder with the same API key
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || 'YOUR_BUILDER_API_KEY');

// Register all e-commerce components
registerBuilderComponents();

// Sample navigation header
const StoreHeader = () => (
  <header className="bg-white shadow-sm border-b">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">dStores</h1>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Home</a>
          <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Products</a>
          <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">About</a>
          <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Contact</a>
        </nav>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-900 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <button className="text-gray-500 hover:text-gray-900 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
);

// Sample footer
const StoreFooter = () => (
  <footer className="bg-gray-900 text-white mt-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">dStores</h3>
          <p className="text-gray-400">Building amazing e-commerce experiences with drag and drop simplicity.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Products</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Featured</a></li>
            <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Sale Items</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
            <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-4">Connect</h4>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Instagram</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.326-1.297L3.938 16.9L2.771 15.734l1.07-1.181C3.053 13.8 2.771 12.649 2.771 11.352c0-1.297.282-2.448 1.07-3.326L2.771 6.845L3.938 5.679L5.123 6.845C6.001 6.057 7.152 5.775 8.449 5.775c1.297 0 2.448.282 3.326 1.07l1.181-1.166L14.121 6.845L12.955 8.026C13.743 8.904 14.025 10.055 14.025 11.352c0 1.297-.282 2.448-1.07 3.326l1.166 1.181L12.955 16.9L11.775 15.691C10.897 16.479 9.746 16.988 8.449 16.988z"/>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">Twitter</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
        <p>&copy; 2025 dStores. All rights reserved. Built with ❤️</p>
      </div>
    </div>
  </footer>
);

export default function StorePreview() {
  const router = useRouter();
  const [builderContent, setBuilderContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { model = 'page' } = router.query;

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const content = await builder
          .get(model, {
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

    if (model) {
      fetchContent();
    }
  }, [model]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Store Preview - dStores</title>
        <meta name="description" content="Preview of your custom e-commerce store" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <StoreHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {builderContent ? (
            <BuilderComponent 
              model={model} 
              content={builderContent}
              apiKey={process.env.NEXT_PUBLIC_BUILDER_API_KEY}
            />
          ) : (
            // Default store layout when no Builder content
            <div className="space-y-12">
              <HeroSection 
                title="Welcome to Your Custom Store"
                subtitle="Built with dStores drag-and-drop builder - customize everything to match your brand"
                buttonText="Start Shopping"
                secondaryButtonText="Learn More"
              />
              
              {/* Category Grid */}
              <div className="py-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { name: 'Electronics', image: '/api/placeholder/300/200?text=Electronics', productCount: 245 },
                    { name: 'Fashion', image: '/api/placeholder/300/200?text=Fashion', productCount: 189 },
                    { name: 'Home & Garden', image: '/api/placeholder/300/200?text=Home', productCount: 156 },
                    { name: 'Sports', image: '/api/placeholder/300/200?text=Sports', productCount: 98 }
                  ].map((category, index) => (
                    <CategoryCard key={index} category={category} />
                  ))}
                </div>
              </div>
              
              <ProductGrid 
                title="Featured Products"
                columns={3}
                showViewAll={true}
              />

              <FeatureHighlight />
              
              <ProductGrid 
                title="Best Sellers"
                columns={4}
                showViewAll={true}
              />
              
              <NewsletterSignup 
                title="Get Exclusive Deals"
                subtitle="Subscribe to our newsletter and be the first to know about sales and new arrivals"
                backgroundColor="bg-gradient-to-r from-blue-50 to-indigo-50"
              />
            </div>
          )}
        </main>
        
        <CartWidget itemCount={2} />
        <StoreFooter />
      </div>
    </>
  );
} 