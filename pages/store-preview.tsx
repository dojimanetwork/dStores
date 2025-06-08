import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useBuilderStore } from '@/stores/builderStore';
import { 
  ProductCard, 
  ProductGrid, 
  HeroSection, 
  CartWidget, 
  CategoryCard,
  NewsletterSignup,
  FeatureHighlight,
  ThemeProvider
} from '@/components/builder/EcommerceComponents';

// Component registry for rendering
const COMPONENT_REGISTRY = {
  'hero': HeroSection,
  'product-grid': ProductGrid,
  'product-card': ProductCard,
  'cart-widget': CartWidget,
  'category-card': CategoryCard,
  'newsletter': NewsletterSignup,
  'features': FeatureHighlight
};

// Sample navigation header
const StoreHeader = ({ theme, onNavigate, currentView, cart, onToggleCart, search, onSearch, onToggleSearch }) => {
  const themeColors = theme?.colors || {
    background: '#ffffff',
    text: '#1f2937',
    primary: '#2563eb'
  };

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
    onNavigate('search');
  };

  return (
    <header className="shadow-sm border-b" style={{ backgroundColor: themeColors.background }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={() => onNavigate('home')}
              className="text-xl font-bold cursor-pointer hover:opacity-80 transition-colors"
              style={{ color: themeColors.text }}
            >
              dStores
            </button>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            {[
              { key: 'home', label: 'Home' },
              { key: 'products', label: 'Products' },
              { key: 'about', label: 'About' },
              { key: 'contact', label: 'Contact' }
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`hover:opacity-80 transition-colors ${
                  currentView === item.key ? 'font-semibold' : ''
                }`}
                style={{ 
                  color: currentView === item.key ? themeColors.primary : themeColors.text 
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden sm:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-64 px-3 py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  style={{ color: themeColors.text }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </form>
            
            {/* Mobile search button */}
            <button 
              onClick={onToggleSearch}
              className="sm:hidden hover:opacity-80 transition-colors"
              style={{ color: themeColors.text }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Cart */}
            <button 
              onClick={onToggleCart}
              className="relative hover:opacity-80 transition-colors"
              style={{ color: themeColors.text }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
              </svg>
              {cart.totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cart.totalItems > 99 ? '99+' : cart.totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile search overlay */}
      {search.isOpen && (
        <div className="sm:hidden border-t border-gray-200 p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      )}
    </header>
  );
};

// Sample footer
const StoreFooter = ({ theme }) => {
  const themeColors = theme?.colors || {
    background: '#111827',
    text: '#f9fafb'
  };

  return (
    <footer className="text-white mt-16" style={{ backgroundColor: themeColors.background }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4" style={{ color: themeColors.text }}>
              dStores
            </h3>
            <p className="text-gray-400">Building amazing e-commerce experiences with drag and drop simplicity.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: themeColors.text }}>Products</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Featured</a></li>
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sale Items</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: themeColors.text }}>Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: themeColors.text }}>Connect</h4>
            <div className="flex space-x-4">
              {['Facebook', 'Instagram', 'Twitter'].map((social) => (
                <a key={social} href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">{social}</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>&copy; 2025 dStores. All rights reserved. Built with ❤️</p>
        </div>
      </div>
    </footer>
  );
};

// Products Page Component
const ProductsPage = ({ theme, products, onAddToCart }) => {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];

  useEffect(() => {
    let filtered = selectedCategory === 'all' 
      ? products 
      : products.filter(p => p.category === selectedCategory);

    // Sort products
    filtered = filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'name': return a.name.localeCompare(b.name);
        default: return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, sortBy]);

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4" style={{ color: theme.colors.text }}>
            Our Products
          </h1>
          <p className="text-gray-600 mb-6">Discover our complete collection of amazing products</p>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Category:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group">
              <ProductCard 
                product={product}
                theme={theme}
              />
              <button
                onClick={() => onAddToCart(product)}
                className="w-full mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// About Page Component
const AboutPage = ({ theme, storeInfo }) => (
  <div className="py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ color: theme.colors.text }}>
          About {storeInfo.name || 'Our Store'}
        </h1>
        
        <div className="prose prose-lg">
          {storeInfo.description && (
            <p className="text-gray-600 mb-6">
              {storeInfo.description}
            </p>
          )}
          
          <div className="grid md:grid-cols-2 gap-8 mt-8">
            <div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: theme.colors.text }}>Our Mission</h3>
              <p className="text-gray-600">
                To provide exceptional products and outstanding customer service while building lasting relationships with our community.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: theme.colors.text }}>Our Values</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Quality products at fair prices</li>
                <li>Exceptional customer service</li>
                <li>Fast and reliable shipping</li>
                <li>Community engagement</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Contact Page Component
const ContactPage = ({ theme, storeInfo }) => (
  <div className="py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ color: theme.colors.text }}>
          Contact Us
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4" style={{ color: theme.colors.text }}>Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">{storeInfo.email || 'contact@yourstore.com'}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-600">{storeInfo.phone || '+1 (555) 123-4567'}</span>
              </div>
              
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600">{storeInfo.address || '123 Main St, City, State 12345'}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4" style={{ color: theme.colors.text }}>Send a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Your message..."
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Search Results Component
const SearchPage = ({ theme, searchResults, searchQuery }) => (
  <div className="py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6" style={{ color: theme.colors.text }}>
        Search Results
      </h1>
      
      {searchQuery && (
        <p className="text-gray-600 mb-6">
          Showing results for "{searchQuery}" ({searchResults.length} items found)
        </p>
      )}
      
      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {searchResults.map((product) => (
            <ProductCard 
              key={product.id}
              product={product}
              theme={theme}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {searchQuery ? 'No products found matching your search.' : 'Enter a search term to find products.'}
          </p>
        </div>
      )}
    </div>
  </div>
);

// Cart Sidebar Component
const CartSidebar = ({ isOpen, onClose, cart, theme, onUpdateQuantity, onRemoveFromCart, onClearCart }) => {
  const themeColors = theme?.colors || {
    background: '#ffffff',
    text: '#1f2937',
    primary: '#2563eb'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="fixed right-0 top-0 h-full w-96 max-w-full bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold" style={{ color: themeColors.text }}>
              Shopping Cart ({cart.totalItems})
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.items.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 1.5M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" />
                </svg>
                <p>Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex gap-3 border-b pb-4">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm" style={{ color: themeColors.text }}>
                        {item.name}
                      </h4>
                      <p className="text-sm" style={{ color: themeColors.primary }}>
                        ${item.price}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) - 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          -
                        </button>
                        <span className="text-sm px-2">{item.quantity || 1}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, (item.quantity || 1) + 1)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          +
                        </button>
                        <button
                          onClick={() => onRemoveFromCart(item.id)}
                          className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Footer */}
          {cart.items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span style={{ color: themeColors.primary }}>${cart.totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <button
                  className="w-full py-3 text-white rounded-md hover:opacity-90 transition-colors"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  Checkout
                </button>
                <button
                  onClick={onClearCart}
                  className="w-full py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function StorePreview() {
  const router = useRouter();
  const { 
    currentTheme, 
    setProducts, 
    products,
    cart,
    search,
    storeInfo,
    currentView,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    toggleCart,
    clearCart,
    setSearchQuery,
    performSearch,
    toggleSearch,
    setCurrentView
  } = useBuilderStore();
  
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { page = 'home' } = router.query;

  useEffect(() => {
    const loadPageData = () => {
      try {
        // Load from localStorage (saved by visual builder)
        const savedCurrentPage = localStorage.getItem('currentPage');
        if (savedCurrentPage) {
          const pageData = JSON.parse(savedCurrentPage);
          setPageData(pageData);
        }
        
        // Load store info from localStorage
        const savedStoreInfo = localStorage.getItem('storeInfo');
        if (savedStoreInfo) {
          const storeInfoData = JSON.parse(savedStoreInfo);
          // Update the builder store with the saved store info
          const { updateStoreInfo } = useBuilderStore.getState();
          updateStoreInfo(storeInfoData);
        }
      } catch (error) {
        console.error('Error loading page data:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products?storeId=1');
        if (response.ok) {
          const data = await response.json();
          // Ensure data is an array before setting
          setProducts(Array.isArray(data) ? data : []);
        } else {
          console.warn('Failed to fetch products, using empty array');
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      }
    };

    loadPageData();
    fetchProducts();
    setIsLoading(false);
  }, [page, setProducts]);

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    performSearch();
  };

  const handleAddToCart = (product) => {
    addToCart({ ...product, quantity: 1 });
  };

  const handleUpdateCartQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateCartQuantity(productId, quantity);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'products':
        return (
          <ProductsPage 
            theme={theme}
            products={products}
            onAddToCart={handleAddToCart}
          />
        );
      case 'about':
        return <AboutPage theme={theme} storeInfo={storeInfo} />;
      case 'contact':
        return <ContactPage theme={theme} storeInfo={storeInfo} />;
      case 'search':
        return (
          <SearchPage 
            theme={theme}
            searchResults={search.results}
            searchQuery={search.query}
          />
        );
      default:
        // Home page - render saved components or default layout
        if (pageData?.components && pageData.components.length > 0) {
          return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="space-y-8">
                {pageData.components.map((component) => {
                  const Component = COMPONENT_REGISTRY[component.type];
                  return Component ? (
                    <Component 
                      key={component.id}
                      {...component.props}
                      theme={theme}
                    />
                  ) : null;
                })}
              </div>
            </main>
          );
        } else {
          // Default store layout when no saved components
          return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="space-y-12">
                <HeroSection 
                  title="Welcome to Your Custom Store"
                  subtitle="Built with dStores drag-and-drop builder - customize everything to match your brand"
                  buttonText="Start Shopping"
                  secondaryButtonText="Learn More"
                  theme={theme}
                />
                
                {/* Category Grid */}
                <div className="py-8">
                  <h2 
                    className="text-2xl font-bold mb-6"
                    style={{ color: theme.colors.text }}
                  >
                    Shop by Category
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { name: 'Electronics', image: '/api/placeholder/300/200?text=Electronics', productCount: 245 },
                      { name: 'Fashion', image: '/api/placeholder/300/200?text=Fashion', productCount: 189 },
                      { name: 'Home & Garden', image: '/api/placeholder/300/200?text=Home', productCount: 156 },
                      { name: 'Sports', image: '/api/placeholder/300/200?text=Sports', productCount: 98 }
                    ].map((category, index) => (
                      <CategoryCard key={index} category={category} theme={theme} />
                    ))}
                  </div>
                </div>
                
                <ProductGrid 
                  title="Featured Products"
                  columns={3}
                  showViewAll={true}
                  showFromUserProducts={true}
                  theme={theme}
                />

                <FeatureHighlight theme={theme} />
                
                <ProductGrid 
                  title="Best Sellers"
                  columns={4}
                  showViewAll={true}
                  showFromUserProducts={true}
                  theme={theme}
                />
                
                <NewsletterSignup 
                  title="Get Exclusive Deals"
                  subtitle="Subscribe to our newsletter and be the first to know about sales and new arrivals"
                  backgroundColor="bg-gradient-to-r from-blue-50 to-indigo-50"
                  theme={theme}
                />
              </div>
            </main>
          );
        }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Use the saved theme or default theme
  const theme = pageData?.theme || currentTheme;

  return (
    <>
      <Head>
        <title>{pageData?.meta?.title || 'Store Preview'} - dStores</title>
        <meta name="description" content={pageData?.meta?.description || 'Preview of your custom e-commerce store'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <ThemeProvider theme={theme}>
        <div className="min-h-screen" style={{ backgroundColor: theme.colors.background }}>
          <StoreHeader 
            theme={theme}
            onNavigate={handleNavigate}
            currentView={currentView}
            cart={cart}
            onToggleCart={toggleCart}
            search={search}
            onSearch={handleSearch}
            onToggleSearch={toggleSearch}
          />
          
          {renderCurrentView()}
          
          <CartWidget itemCount={cart.totalItems} theme={theme} />
          <StoreFooter theme={theme} />
          
          {/* Cart Sidebar */}
          <CartSidebar
            isOpen={cart.isOpen}
            onClose={toggleCart}
            cart={cart}
            theme={theme}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveFromCart={removeFromCart}
            onClearCart={clearCart}
          />
        </div>
      </ThemeProvider>
    </>
  );
} 