import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  image: string;
  images: string[];
  stock: number;
  inStock: boolean;
  category: string;
  slug: string;
}

interface TemplateData {
  templateId: string;
  products: Product[];
  featuredProducts: Product[];
  categories: string[];
  totalProducts: number;
  totalValue: number;
  inStockCount: number;
}

export default function TemplateProductsPage() {
  const router = useRouter();
  const { templateId } = router.query;
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [currentPage, setCurrentPage] = useState(1);
  const [cart, setCart] = useState<any[]>([]);
  
  const productsPerPage = 12;

  // Debug logging
  useEffect(() => {
    console.log('Router isReady:', router.isReady);
    console.log('Template ID:', templateId);
  }, [router.isReady, templateId]);

  // Load cart from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && templateId) {
      const savedCart = localStorage.getItem(`cart_${templateId}_1`);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to load cart:', e);
        }
      }
    }
  }, [templateId]);

  // Save cart to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined' && cart.length >= 0 && templateId) {
      localStorage.setItem(`cart_${templateId}_1`, JSON.stringify(cart));
    }
  }, [cart, templateId]);

  useEffect(() => {
    if (router.isReady && templateId) {
      console.log('Fetching template data for:', templateId);
      fetchTemplateData();
    }
  }, [router.isReady, templateId]);

  const fetchTemplateData = async () => {
    try {
      setLoading(true);
      console.log(`Fetching: /api/templates/${templateId}/products?storeId=1`);
      const response = await fetch(`/api/templates/${templateId}/products?storeId=1`);
      if (!response.ok) {
        throw new Error(`Failed to fetch template data: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      console.log('Template data received:', data);
      setTemplateData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching template data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });

    // Show toast notification
    console.log(`${product.name} added to cart!`);
  };

  const navigateToTemplate = (page?: string) => {
    if (page === 'cart') {
      router.push(`/dashboard/templates/cart/${templateId}`);
    } else {
      router.push(`/dashboard/templates/${templateId}`);
    }
  };

  const navigateToProductDetail = (product: Product) => {
    router.push(`/dashboard/templates/${templateId}?productId=${product.id}`);
  };

  // Filter and sort products
  const filteredProducts = templateData?.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Don't render until router is ready
  if (!router.isReady) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading router...</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading products for {templateId}...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#dc2626', marginBottom: '16px' }}>{error}</p>
          <button 
            onClick={fetchTemplateData}
            style={{ padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!templateData) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#6b7280' }}>Template data not found for {templateId}</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => navigateToTemplate()}
                style={{ color: '#6b7280', cursor: 'pointer', border: 'none', background: 'none', fontSize: '16px' }}
              >
                ← Back to Store
              </button>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                {templateId} - Products ({templateData.totalProducts} items)
              </h1>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button
                onClick={() => navigateToTemplate('cart')}
                style={{ position: 'relative', padding: '8px', color: '#6b7280', cursor: 'pointer', border: 'none', background: 'none' }}
              >
                🛒
                {getCartItemCount() > 0 && (
                  <span style={{ 
                    position: 'absolute', 
                    top: '-4px', 
                    right: '-4px', 
                    backgroundColor: '#2563eb', 
                    color: 'white', 
                    fontSize: '12px', 
                    borderRadius: '50%', 
                    width: '20px', 
                    height: '20px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    {getCartItemCount()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px' }}>
        {/* Filters */}
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '24px', marginBottom: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {/* Search */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search products..."
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="all">All Categories</option>
                {templateData.categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '8px 12px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Results Count */}
            <div style={{ display: 'flex', alignItems: 'end' }}>
              <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>
                Showing {paginatedProducts.length} of {filteredProducts.length} products
              </p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {paginatedProducts.map((product) => (
            <div
              key={product.id}
              style={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              <div
                style={{ aspectRatio: '1', overflow: 'hidden' }}
                onClick={() => navigateToProductDetail(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '16px' }}>
                <h3
                  style={{ fontWeight: '600', color: '#111827', marginBottom: '8px', cursor: 'pointer', fontSize: '16px' }}
                  onClick={() => navigateToProductDetail(product)}
                >
                  {product.name}
                </h3>
                <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px', lineHeight: '1.4' }}>
                  {product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827' }}>{product.formattedPrice}</span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={!product.inStock}
                    style={{ 
                      padding: '8px 16px', 
                      borderRadius: '8px', 
                      fontWeight: '500',
                      border: 'none',
                      cursor: product.inStock ? 'pointer' : 'not-allowed',
                      backgroundColor: product.inStock ? '#2563eb' : '#d1d5db',
                      color: product.inStock ? 'white' : '#6b7280'
                    }}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '32px' }}>
            <nav style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{ 
                  padding: '8px 12px', 
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  backgroundColor: currentPage === 1 ? '#f3f4f6' : 'white',
                  color: currentPage === 1 ? '#6b7280' : '#374151',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  style={{ 
                    padding: '8px 12px', 
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    backgroundColor: currentPage === page ? '#2563eb' : 'white',
                    color: currentPage === page ? 'white' : '#374151',
                    cursor: 'pointer'
                  }}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{ 
                  padding: '8px 12px', 
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  backgroundColor: currentPage === totalPages ? '#f3f4f6' : 'white',
                  color: currentPage === totalPages ? '#6b7280' : '#374151',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
} 