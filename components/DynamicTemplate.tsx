import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TEMPLATES } from './templatesData';

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

interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: {
    size?: string;
    color?: string;
    material?: string;
  };
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

interface DynamicTemplateProps {
  templateId: string;
  storeId?: number;
}

export default function DynamicTemplate({ templateId, storeId = 1 }: DynamicTemplateProps) {
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const router = useRouter();

  // Get template definition
  const template = TEMPLATES.find(t => t.id === templateId);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(`cart_${templateId}_${storeId}`);
    const savedWishlist = localStorage.getItem(`wishlist_${templateId}_${storeId}`);

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to load cart from localStorage:', e);
      }
    }

    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (e) {
        console.error('Failed to load wishlist from localStorage:', e);
      }
    }
  }, [templateId, storeId]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`cart_${templateId}_${storeId}`, JSON.stringify(cart));
  }, [cart, templateId, storeId]);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`wishlist_${templateId}_${storeId}`, JSON.stringify(wishlist));
  }, [wishlist, templateId, storeId]);

  useEffect(() => {
    fetchTemplateData();

    // Set up polling for real-time updates
    const interval = setInterval(fetchTemplateData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
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

  // Enhanced cart management functions
  const handleAddToCart = (product: Product, quantity: number = 1, variant?: any) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item =>
        item.product.id === product.id &&
        JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += quantity;
        return newCart;
      }

      return [...prevCart, { product, quantity, selectedVariant: variant }];
    });

    // Show success feedback
    showToast(`${product.name} added to cart!`, 'success');
  };

  const handleUpdateCartQuantity = (productId: number, newQuantity: number, variant?: any) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId, variant);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId &&
          JSON.stringify(item.selectedVariant) === JSON.stringify(variant)
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveFromCart = (productId: number, variant?: any) => {
    setCart(prevCart =>
      prevCart.filter(item =>
        !(item.product.id === productId &&
          JSON.stringify(item.selectedVariant) === JSON.stringify(variant))
      )
    );
    showToast('Item removed from cart', 'info');
  };

  const handleClearCart = () => {
    setCart([]);
    showToast('Cart cleared', 'info');
  };

  // Wishlist functions
  const handleAddToWishlist = (product: Product) => {
    setWishlist(prev => {
      if (prev.find(item => item.id === product.id)) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some(item => item.id === productId);
  };

  // Navigation functions
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setCurrentPage('product-details');
  };

  const handlePageNavigation = (pageKey: string, product?: Product) => {
    if (pageKey === 'products') {
      // Navigate to dedicated products page
      router.push(`/dashboard/templates/products/${templateId}`);
      return;
    }

    if (pageKey === 'cart') {
      // Navigate to dedicated cart page
      router.push(`/dashboard/templates/cart/${templateId}`);
      return;
    }

    if (product) {
      setSelectedProduct(product);
    }
    setCurrentPage(pageKey);
  };

  // Cart calculations
  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getShippingCost = () => {
    const subtotal = getCartSubtotal();
    return subtotal >= 50 ? 0 : 9.99; // Free shipping over $50
  };

  const getTaxAmount = () => {
    return getCartSubtotal() * 0.08; // 8% tax
  };

  const getCartTotal = () => {
    return getCartSubtotal() + getShippingCost() + getTaxAmount();
  };

  // Checkout functions
  const handleStartCheckout = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }
    setIsCheckingOut(true);
    setCheckoutStep(1);
    setCurrentPage('checkout');
  };

  const handleCheckoutNext = () => {
    setCheckoutStep(prev => Math.min(prev + 1, 4));
  };

  const handleCheckoutPrev = () => {
    setCheckoutStep(prev => Math.max(prev - 1, 1));
  };

  const handlePlaceOrder = async () => {
    try {
      // Simulate order processing
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 2000));

      const newOrderNumber = `ORD-${Date.now()}`;
      setOrderNumber(newOrderNumber);
      setOrderPlaced(true);
      setCart([]);
      setCurrentPage('order-success');

      showToast('Order placed successfully!', 'success');
    } catch (error) {
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Toast notification system
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    // Implementation would depend on your toast library
    console.log(`${type.toUpperCase()}: ${message}`);
  };

  if (loading && !templateData) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', color: '#6b7280', marginBottom: '16px' }}>Loading {templateId}...</div>
          <div style={{ fontSize: '14px', color: '#9ca3af' }}>Preparing your store experience</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#dc2626', marginBottom: '16px', fontSize: '18px' }}>Error loading template</p>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>{error}</p>
          <button
            onClick={fetchTemplateData}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
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
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#6b7280', fontSize: '18px' }}>No data available for template: {templateId}</p>
          <button
            onClick={fetchTemplateData}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              marginTop: '16px'
            }}
          >
            Load Template
          </button>
        </div>
      </div>
    );
  }

  // Enhanced template props with comprehensive functionality
  const templateProps = {
    data: templateData,
    onProductClick: handleProductClick,
    onAddToCart: handleAddToCart,
    onUpdateCartQuantity: handleUpdateCartQuantity,
    onRemoveFromCart: handleRemoveFromCart,
    onClearCart: handleClearCart,
    onAddToWishlist: handleAddToWishlist,
    isInWishlist,
    currentPage,
    onNavigate: handlePageNavigation,
    cart,
    cartItemCount: getCartItemCount(),
    cartSubtotal: getCartSubtotal(),
    cartTotal: getCartTotal(),
    shippingCost: getShippingCost(),
    taxAmount: getTaxAmount(),
    wishlist,
    selectedProduct,
    template: template!,
    isCheckingOut,
    checkoutStep,
    onStartCheckout: handleStartCheckout,
    onCheckoutNext: handleCheckoutNext,
    onCheckoutPrev: handleCheckoutPrev,
    onPlaceOrder: handlePlaceOrder,
    orderPlaced,
    orderNumber
  };

  // Render different templates based on templateId
  switch (templateId) {
    case 'avenda-skincare':
      return <AvendaSkincareTemplate {...templateProps} />;
    case 'bella-fashion':
      return <BellaFashionTemplate {...templateProps} />;
    case 'minimal-zen':
      return <MinimalZenTemplate {...templateProps} />;
    case 'pro-store-marketplace':
      return <ProStoreMarketplaceTemplate {...templateProps} />;
    case 'tech-gadgets':
      return <TechGadgetsTemplate {...templateProps} />;
    case 'modern-dropshipping':
      return <ModernDropshippingTemplate {...templateProps} />;

    // New world-class templates
    case 'nexus-futuristic':
      return <NexusFuturisticTemplate {...templateProps} />;
    case 'lumina-glow':
      return <LuminaGlowTemplate {...templateProps} />;
    case 'velocity-interactive':
      return <VelocityInteractiveTemplate {...templateProps} />;
    case 'aurora-ai-art':
      return <AuroraAIArtTemplate {...templateProps} />;
    case 'zenith-minimal':
      return <ZenithMinimalTemplate {...templateProps} />;
    case 'prisma-3d-surreal':
      return <PrismaSurrealTemplate {...templateProps} />;

    default:
      return <DefaultTemplate {...templateProps} />;
  }
}

// Default Template Component (fallback)
function DefaultTemplate(props: any) {
  const { data } = props;
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Default Template - {data.templateId}</h1>
        {data.products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {data.products.map((product: any) => (
              <div key={product.id} className="bg-white p-6 rounded-lg shadow">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 mb-2">{product.description}</p>
                <p className="text-xl font-bold text-blue-600">{product.formattedPrice}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No products available. Add some products to see them here!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Avenda Skincare Template - Complete E-commerce Experience  
function AvendaSkincareTemplate(props: any) {
  const {
    data,
    onProductClick,
    onAddToCart,
    onUpdateCartQuantity,
    onRemoveFromCart,
    onClearCart,
    onAddToWishlist,
    isInWishlist,
    currentPage,
    onNavigate,
    cart,
    cartItemCount,
    cartSubtotal,
    cartTotal,
    shippingCost,
    taxAmount,
    wishlist,
    selectedProduct,
    template,
    isCheckingOut,
    checkoutStep,
    onStartCheckout,
    onCheckoutNext,
    onCheckoutPrev,
    onPlaceOrder,
    orderPlaced,
    orderNumber
  } = props;

  const [showMiniCart, setShowMiniCart] = useState(false);

  // Handle navigation actions
  const handleNavClick = (pageKey: string, product?: Product) => {
    onNavigate(pageKey, product);
    setShowMiniCart(false);
  };

  // Cart management
  const toggleMiniCart = () => {
    setShowMiniCart(!showMiniCart);
  };

  // Render different pages based on currentPage
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return renderHomePage();
      case 'products':
        return renderProductsPage();
      case 'product-details':
        return renderProductDetailsPage();
      case 'cart':
        return renderCartPage();
      case 'checkout':
        return renderCheckoutPage();
      case 'about':
        return renderAboutPage();
      default:
        return renderHomePage();
    }
  };

  const renderHomePage = () => (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-yellow-50 py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Radiant <br />
                <span className="text-green-700">Healthy Skin</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover {data.totalProducts} premium skincare products with clean ingredients,
                proven results, and personalized routines that work for your unique skin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button
                  onClick={() => handleNavClick('products')}
                  className="bg-green-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Shop Collection
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                {data.featuredProducts[0] && (
                  <img
                    src={data.featuredProducts[0].image}
                    alt="Featured skincare product"
                    className="w-full max-w-md mx-auto rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {data.products.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Skincare Essentials</h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Curated products with clean ingredients and proven results for healthy, glowing skin
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.products.slice(0, 6).map((product: any) => (
                <div
                  key={product.id}
                  className="group cursor-pointer bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <div className="relative overflow-hidden rounded-t-2xl bg-gray-50">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToWishlist(product);
                        }}
                        className={`p-2 rounded-full shadow-md transition-colors ${isInWishlist(product.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white text-gray-400 hover:text-red-500'
                          }`}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3
                      className="font-semibold text-gray-900 mb-2 cursor-pointer hover:text-green-700 transition-colors"
                      onClick={() => handleNavClick('product-details', product)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-2xl font-bold text-gray-900">{product.formattedPrice}</span>
                    </div>
                    <div className="space-y-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product, 1);
                        }}
                        className="w-full bg-green-700 text-white py-3 rounded-full font-medium hover:bg-green-800 transition-colors"
                        disabled={!product.inStock}
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleNavClick('product-details', product)}
                        className="w-full border border-green-700 text-green-700 py-3 rounded-full font-medium hover:bg-green-50 transition-colors"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-12">
              <button
                onClick={() => handleNavClick('products')}
                className="bg-green-700 text-white px-8 py-4 rounded-full font-semibold hover:bg-green-800 transition-colors shadow-lg"
              >
                View All Products
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );

  const renderProductsPage = () => (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">All Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.products.map((product: any) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleNavClick('product-details', product)}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-700">{product.formattedPrice}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );

  const renderProductDetailsPage = () => (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {selectedProduct && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedProduct.name}</h1>
              <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
              <div className="text-3xl font-bold text-green-700 mb-6">{selectedProduct.formattedPrice}</div>
              <div className="space-y-4">
                <button
                  onClick={() => onAddToCart(selectedProduct)}
                  className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => handleNavClick('products')}
                  className="w-full border border-green-700 text-green-700 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
                >
                  Back to Products
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );

  const renderCartPage = () => (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        {cart.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cart.map((item: CartItem, index: number) => (
                <div key={index} className="flex items-center space-x-4 bg-white p-4 rounded-lg shadow-sm mb-4">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.product.name}</h3>
                    <p className="text-gray-600">{item.product.formattedPrice}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => onUpdateCartQuantity(item.product.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => onUpdateCartQuantity(item.product.id, item.quantity + 1)}>+</button>
                  </div>
                  <button onClick={() => onRemoveFromCart(item.product.id)} className="text-red-500">Remove</button>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm h-fit">
              <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${cartSubtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax:</span>
                  <span>${taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              <button
                onClick={onStartCheckout}
                className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => handleNavClick('products')}
              className="bg-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </section>
  );

  const renderCheckoutPage = () => (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Checkout</h1>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
            <div className="space-y-2 mb-6">
              {cart.map((item: CartItem, index: number) => (
                <div key={index} className="flex justify-between">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={onPlaceOrder}
              className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition-colors"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  const renderAboutPage = () => (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About Avenda</h1>
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-gray-600 mb-6">
            At Avenda, we believe that healthy, radiant skin is the foundation of confidence.
            Our mission is to provide clean, effective skincare solutions that work for all skin types.
          </p>
          <p className="text-lg text-gray-600">
            Founded by dermatologists and skincare experts, we use only the finest natural ingredients
            combined with cutting-edge science to create products that deliver visible results.
          </p>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Avenda</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => handleNavClick('home')}
                className={`text-gray-700 hover:text-green-700 font-medium transition-colors ${currentPage === 'home' ? 'text-green-700 border-b-2 border-green-700' : ''}`}
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('products')}
                className={`text-gray-700 hover:text-green-700 font-medium transition-colors ${currentPage === 'products' ? 'text-green-700 border-b-2 border-green-700' : ''}`}
              >
                Shop
              </button>
              <button
                onClick={() => handleNavClick('about')}
                className={`text-gray-700 hover:text-green-700 font-medium transition-colors ${currentPage === 'about' ? 'text-green-700 border-b-2 border-green-700' : ''}`}
              >
                About
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              {/* Wishlist */}
              <button className="relative p-2 text-gray-700 hover:text-green-700 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </button>

              {/* Cart */}
              <div className="relative">
                <button
                  onClick={() => handleNavClick('cart')}
                  className="relative p-2 text-gray-700 hover:text-green-700 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartItemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      {renderPage()}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center space-x-2 justify-center mb-4">
              <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold">Avenda</span>
            </div>
            <p className="text-gray-300 mb-4">
              Premium skincare with clean ingredients and proven results for healthy, glowing skin.
            </p>
            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
              <p>&copy; 2024 Avenda Skincare. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Placeholder components for other templates
function BellaFashionTemplate(props: any) {
  const { data, cart, onAddToCart, onProductClick, onNavigate, currentPage, cartItemCount } = props;

  if (!data) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-gray-800 text-xl">Loading Bella Fashion...</div>
  </div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Bella Fashion</h1>
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-center mb-12">Fashion Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.products.map((product: any) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onProductClick(product)}>
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                  <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                    className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function MinimalZenTemplate(props: any) {
  const { data, cart, onAddToCart, onProductClick, onNavigate, currentPage, cartItemCount } = props;

  if (!data) return <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-gray-800 text-xl">Loading Minimal Zen...</div>
  </div>;

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-light">Minimal Zen</h1>
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-gray-800 hover:text-black transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-light text-center mb-16">Collection</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {data.products.map((product: any) => (
            <div key={product.id} className="group cursor-pointer" onClick={() => onProductClick(product)}>
              <div className="aspect-square mb-6 overflow-hidden bg-gray-50">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div>
                <h3 className="text-lg font-light mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-light">${product.price}</span>
                  <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                    className="px-4 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors">
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function ProStoreMarketplaceTemplate(props: any) {
  const { data, cart, onAddToCart, onProductClick, onNavigate, currentPage, cartItemCount } = props;

  if (!data) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-gray-800 text-xl">Loading Pro Store...</div>
  </div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Pro Store</h1>
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-white hover:text-blue-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-center mb-12">Professional Marketplace</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.products.map((product: any) => (
            <div key={product.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => onProductClick(product)}>
              <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-t-lg" />
              <div className="p-4">
                <h3 className="font-semibold mb-2 truncate">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">${product.price}</span>
                  <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function TechGadgetsTemplate(props: any) {
  const { data, cart, onAddToCart, onProductClick, onNavigate, currentPage, cartItemCount } = props;

  if (!data) return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-blue-400 text-xl">Loading Tech Gadgets...</div>
  </div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-black">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-blue-400">TechGadgets</h1>
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-blue-400 hover:text-blue-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-4xl font-bold text-center mb-12 text-blue-400">Latest Tech</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.products.map((product: any) => (
            <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 transition-colors cursor-pointer"
              onClick={() => onProductClick(product)}>
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="font-semibold mb-2 text-white">{product.name}</h3>
                <p className="text-gray-300 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-blue-400">${product.price}</span>
                  <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function ModernDropshippingTemplate(props: any) {
  const { data, cart, onAddToCart, onProductClick, onNavigate, currentPage, cartItemCount } = props;

  if (!data) return <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-gray-800 text-xl">Loading Modern Store...</div>
  </div>;

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Modern Store</h1>
            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Products</h2>
          <p className="text-gray-600">Discover our curated collection</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.products.map((product: any) => (
            <div key={product.id} className="group cursor-pointer" onClick={() => onProductClick(product)}>
              <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:scale-105 transition-transform font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

// NEXUS - Futuristic Commerce Template
function NexusFuturisticTemplate(props: any) {
  const { data, cart, onAddToCart, onProductClick, onNavigate, currentPage, cartItemCount } = props;

  // console.log('NexusFuturisticTemplate rendering with data:', data);

  if (!data) return (
    <div style={{ minHeight: '100vh', backgroundColor: 'black', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: '#00ffff', fontSize: '24px', marginBottom: '16px' }}>⚡ NEXUS LOADING ⚡</div>
        <div style={{ color: '#ff00ff', fontSize: '16px' }}>Initializing futuristic commerce...</div>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'black', color: 'white', position: 'relative', overflow: 'hidden' }}>
      {/* Futuristic Background Effects */}
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 1 }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0,255,255,0.1) 0%, rgba(0,0,0,1) 50%, rgba(255,0,255,0.1) 100%)'
        }}></div>
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '256px',
          height: '256px',
          background: 'radial-gradient(circle, rgba(0,255,255,0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 3s infinite'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: '384px',
          height: '384px',
          background: 'radial-gradient(circle, rgba(255,0,255,0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'pulse 3s infinite 1s'
        }}></div>
      </div>

      {/* Futuristic Header */}
      <header style={{
        position: 'relative',
        zIndex: 50,
        padding: '24px',
        borderBottom: '1px solid rgba(0,255,255,0.3)',
        backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ width: '24px', height: '24px', backgroundColor: 'black', borderRadius: '4px' }}></div>
            </div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              NEXUS
            </h1>
          </div>

          <nav style={{ display: 'flex', gap: '32px' }}>
            <button
              onClick={() => onNavigate('home')}
              style={{ color: '#00ffff', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('products')}
              style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' }}
            >
              Products
            </button>
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => onNavigate('cart')}
              style={{
                position: 'relative',
                padding: '8px',
                color: '#00ffff',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '24px'
              }}
            >
              🛒
              {cartItemCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#ff00ff',
                  color: 'white',
                  fontSize: '12px',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ position: 'relative', zIndex: 10, paddingTop: '80px', paddingBottom: '128px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '96px',
            fontWeight: 'bold',
            marginBottom: '24px',
            background: 'linear-gradient(45deg, #00ffff, white, #ff00ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: '1.1',
            margin: '0 0 24px 0'
          }}>
            FUTURE
          </h2>
          <p style={{
            fontSize: '20px',
            color: '#d1d5db',
            marginBottom: '32px',
            maxWidth: '800px',
            margin: '0 auto 32px auto',
            lineHeight: '1.6'
          }}>
            Experience the next generation of commerce with holographic displays,
            quantum-level security, and neural interface integration.
          </p>
          <button
            onClick={() => onNavigate('products')}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
              color: 'white',
              borderRadius: '25px',
              fontWeight: 'bold',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              boxShadow: '0 0 20px rgba(0,255,255,0.5)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255,0,255,0.8)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(0,255,255,0.5)';
            }}
          >
            ⚡ SHOP NOW ⚡
          </button>
        </div>
      </section>

      {/* Holographic Products Grid */}
      {data.featuredProducts && data.featuredProducts.length > 0 && (
        <section style={{ position: 'relative', zIndex: 10, padding: '80px 0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
            <h3 style={{
              fontSize: '48px',
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: '64px',
              color: '#00ffff',
              margin: '0 0 64px 0'
            }}>
              Featured Products
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
              {data.featuredProducts.slice(0, 6).map((product: any) => (
                <div
                  key={product.id}
                  style={{
                    position: 'relative',
                    background: 'linear-gradient(135deg, rgba(25,25,25,0.8) 0%, rgba(0,0,0,0.8) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0,255,255,0.3)',
                    borderRadius: '16px',
                    padding: '24px',
                    cursor: 'pointer',
                    transition: 'all 0.5s ease'
                  }}
                  onClick={() => onProductClick(product)}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = '#00ffff';
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,255,255,0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,255,255,0.3)';
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ position: 'relative', zIndex: 10 }}>
                    <div style={{ aspectRatio: '1', marginBottom: '16px', overflow: 'hidden', borderRadius: '12px', backgroundColor: '#1f2937' }}>
                      <img
                        src={product.image || product.images?.[0]}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.7s ease' }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'scale(1.1)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      />
                    </div>

                    <h4 style={{ fontSize: '20px', fontWeight: '600', color: 'white', marginBottom: '8px', margin: '0 0 8px 0' }}>
                      {product.name}
                    </h4>
                    <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '16px', lineHeight: '1.4', margin: '0 0 16px 0' }}>
                      {product.description.length > 80 ? `${product.description.substring(0, 80)}...` : product.description}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#00ffff' }}>
                        ${product.price}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart(product);
                        }}
                        style={{
                          padding: '8px 16px',
                          background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
                          color: 'white',
                          borderRadius: '8px',
                          fontWeight: '500',
                          border: 'none',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      {data && (
        <section style={{ position: 'relative', zIndex: 10, padding: '80px 0', borderTop: '1px solid rgba(0,255,255,0.3)' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '32px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#00ffff', marginBottom: '8px' }}>
                  {data.totalProducts || 0}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '16px' }}>Products</div>
              </div>
              <div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#ff00ff', marginBottom: '8px' }}>
                  {data.inStockCount || 0}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '16px' }}>In Stock</div>
              </div>
              <div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#00ffff', marginBottom: '8px' }}>
                  ${(data.totalValue || 0).toLocaleString()}
                </div>
                <div style={{ color: '#9ca3af', fontSize: '16px' }}>Total Value</div>
              </div>
              <div>
                <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#ff00ff', marginBottom: '8px' }}>
                  99.9%
                </div>
                <div style={{ color: '#9ca3af', fontSize: '16px' }}>Uptime</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        padding: '40px 0',
        borderTop: '1px solid rgba(0,255,255,0.3)',
        backgroundColor: 'rgba(0,0,0,0.8)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <div style={{ marginBottom: '16px' }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0
            }}>
              NEXUS
            </h1>
          </div>
          <p style={{ color: '#9ca3af', marginBottom: '32px', margin: '0 0 32px 0' }}>
            The future of commerce is here. Experience next-generation shopping with holographic displays and quantum security.
          </p>
          <div style={{ borderTop: '1px solid rgba(0,255,255,0.3)', paddingTop: '32px', color: '#6b7280' }}>
            <p style={{ margin: 0 }}>© 2024 NEXUS Futuristic Commerce. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Add CSS animation keyframes */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

// LUMINA - Luxury Glow Template
function LuminaGlowTemplate(props: any) {
  const { data, cart, onAddToCart, onProductClick, onNavigate, currentPage, cartItemCount } = props;

  if (!data) return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-gray-800 text-xl">Loading Lumina...</div>
  </div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 text-gray-800">
      {/* Elegant Header */}
      <header className="relative bg-white/80 backdrop-blur-sm border-b border-amber-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-full"></div>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">LUMINA</h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => onNavigate('home')}
                className="text-gray-800 hover:text-amber-600 font-medium"
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="text-gray-600 hover:text-amber-600"
              >
                Products
              </button>
            </nav>

            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-gray-800 hover:text-amber-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Luxury Hero */}
      <section className="relative py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/50 to-orange-100/50 blur-3xl"></div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl font-light mb-6 text-gray-800">
            Crafted for
            <span className="block font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Perfection
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Where luxury meets innovation. Each piece is meticulously crafted
            with premium materials and uncompromising attention to detail.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300"
          >
            Shop Collection
          </button>
        </div>
      </section>

      {/* Curated Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-light text-center mb-16 text-gray-800">
            Featured Products
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {data.featuredProducts.slice(0, 6).map((product: any) => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onClick={() => onProductClick(product)}
              >
                <div className="relative mb-6">
                  <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-white shadow-lg">
                    <img
                      src={product.image || product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>

                <div className="text-center">
                  <h4 className="text-xl font-medium text-gray-800 mb-2">{product.name}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-light text-amber-600">${product.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="px-6 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full hover:shadow-lg hover:shadow-amber-500/25 transition-all duration-300 font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// VELOCITY - Interactive Experience Template
function VelocityInteractiveTemplate(props: any) {
  const { data, cart, onAddToCart, onProductClick, onNavigate, currentPage, cartItemCount } = props;

  if (!data) return <div className="min-h-screen bg-gray-100 flex items-center justify-center">
    <div className="text-gray-800 text-xl animate-pulse">Loading Velocity...</div>
  </div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50">
      {/* Dynamic Header */}
      <header className="relative bg-white/90 backdrop-blur-md border-b border-red-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center transform rotate-45">
                <div className="w-6 h-6 bg-purple-900 rounded-full transform -rotate-45"></div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                VELOCITY
              </h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => onNavigate('home')}
                className="text-red-600 hover:text-red-800 font-medium transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="text-gray-400 hover:text-red-600 transition-colors"
              >
                Products
              </button>
            </nav>

            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-red-600 hover:text-red-800 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-spin">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Interactive Hero */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-red-300 rounded-full blur-2xl animate-ping"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-pink-300 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-purple-300 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
            VELOCITY
          </h2>
          <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Experience interactive commerce like never before.
            Flash-era nostalgia meets cutting-edge technology.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="px-10 py-5 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-black text-lg hover:scale-110 hover:rotate-3 transition-all duration-300 shadow-xl"
          >
            Enter Experience
          </button>
        </div>
      </section>

      {/* Interactive Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-5xl font-black text-center mb-16 bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
            Interactive Collection
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.featuredProducts.slice(0, 6).map((product: any, index: number) => (
              <div
                key={product.id}
                className="group relative bg-gradient-to-br from-pink-900/50 to-purple-900/50 backdrop-blur-sm border border-red-500/30 rounded-3xl p-6 hover:border-red-500 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:rotate-1"
                style={{
                  transform: `rotate(${(index % 3 - 1) * 2}deg)`,
                  animationDelay: `${index * 0.2}s`
                }}
                onClick={() => onProductClick(product)}
              >
                <div className="aspect-square mb-4 overflow-hidden rounded-2xl transform hover:skew-x-2 transition-transform duration-700">
                  <img
                    src={product.image || product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 group-hover:hue-rotate-30 transition-all duration-700"
                  />
                </div>

                <h4 className="text-xl font-bold text-white mb-2 transform group-hover:skew-x-1 transition-transform">
                  {product.name}
                </h4>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-red-500 transform group-hover:scale-110 transition-transform">
                    ${product.price}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:scale-110 hover:rotate-12 transition-all font-bold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// AURORA - AI Art Gallery Template
function AuroraAIArtTemplate(props: any) {
  const { data, cart, onAddToCart, onProductClick, onNavigate, currentPage, cartItemCount } = props;

  if (!data) return <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="text-purple-400 text-xl">Initializing Aurora AI...</div>
  </div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900 text-white">
      {/* AI Header */}
      <header className="relative bg-black/50 backdrop-blur-md border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                AURORA
              </h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => onNavigate('home')}
                className="text-purple-400 hover:text-white transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Products
              </button>
            </nav>

            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-purple-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* AI Hero */}
      <section className="relative py-32">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-purple-500/10 to-indigo-500/10 blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
            AI GALLERY
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover unique digital art powered by artificial intelligence.
            Each piece is algorithmically generated and one-of-a-kind.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-lg"
          >
            Generate Art
          </button>
        </div>
      </section>

      {/* AI Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-4xl font-bold text-center mb-16 text-purple-400">
            AI-Generated Collection
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.featuredProducts.slice(0, 6).map((product: any) => (
              <div
                key={product.id}
                className="group relative bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400 transition-all duration-500 cursor-pointer"
                onClick={() => onProductClick(product)}
              >
                <div className="aspect-square mb-4 overflow-hidden rounded-xl">
                  <img
                    src={product.image || product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <h4 className="text-xl font-semibold text-white mb-2">{product.name}</h4>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-400">${product.price}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:scale-105 transition-transform font-bold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ZENITH - Elevated Minimal Template
function ZenithMinimalTemplate(props: any) {
  const { data, cart, onAddToCart, onProductClick, onNavigate, currentPage, cartItemCount } = props;

  if (!data) return <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-gray-800 text-xl">Loading Zenith...</div>
  </div>;

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Minimal Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-light tracking-wide">ZENITH</h1>

            <nav className="hidden md:flex space-x-12">
              <button
                onClick={() => onNavigate('home')}
                className="text-gray-800 font-medium hover:text-black transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="text-gray-500 hover:text-gray-800 transition-colors"
              >
                Products
              </button>
            </nav>

            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-gray-800 hover:text-black transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Minimal Hero */}
      <section className="py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-6xl md:text-8xl font-light mb-8 leading-tight">
            Less is
            <br />
            <span className="font-black">More</span>
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Sophisticated minimalism meets premium quality.
            Every element serves a purpose.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="px-8 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
          >
            Explore Collection
          </button>
        </div>
      </section>

      {/* Minimal Products */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {data.featuredProducts.slice(0, 6).map((product: any) => (
              <div
                key={product.id}
                className="group cursor-pointer"
                onClick={() => onProductClick(product)}
              >
                <div className="aspect-[4/5] mb-6 overflow-hidden bg-gray-50">
                  <img
                    src={product.image || product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                <div>
                  <h4 className="text-xl font-light mb-2">{product.name}</h4>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-light">${product.price}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(product);
                      }}
                      className="px-6 py-2 border border-black text-black hover:bg-black hover:text-white transition-colors font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// PRISMA - 3D Surreal Template
function PrismaSurrealTemplate(props: any) {
  const { data, cart, onAddToCart, onProductClick, onNavigate, currentPage, cartItemCount } = props;

  if (!data) return <div className="min-h-screen bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
    <div className="text-yellow-400 text-xl animate-pulse">Warping Reality...</div>
  </div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-indigo-900 text-white overflow-hidden">
      {/* Surreal Header */}
      <header className="relative bg-black/30 backdrop-blur-md border-b border-yellow-400/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-yellow-400 rounded-full flex items-center justify-center transform rotate-45">
                <div className="w-6 h-6 bg-purple-900 rounded-full transform -rotate-45"></div>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
                PRISMA
              </h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => onNavigate('home')}
                className="text-yellow-400 hover:text-white transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('products')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Products
              </button>
            </nav>

            <button
              onClick={() => onNavigate('cart')}
              className="relative p-2 text-yellow-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-purple-900 text-xs rounded-full w-5 h-5 flex items-center justify-center animate-spin">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Surreal Hero */}
      <section className="relative py-32">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-20 w-40 h-40 bg-pink-500/20 rounded-full blur-2xl animate-ping"></div>
          <div className="absolute bottom-20 right-10 w-60 h-60 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-purple-500/20 transform -translate-x-1/2 -translate-y-1/2 skew-x-12 blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-pink-400 via-yellow-400 to-purple-400 bg-clip-text text-transparent transform skew-y-1">
            IMPOSSIBLE
          </h2>
          <p className="text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Welcome to the impossible marketplace where dreams become reality
            and geometry defies logic.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="px-10 py-5 bg-gradient-to-r from-pink-500 to-yellow-400 text-purple-900 rounded-full font-black text-lg hover:scale-110 hover:rotate-3 transition-all duration-300 shadow-xl"
          >
            Enter Dreamscape
          </button>
        </div>
      </section>

      {/* Surreal Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-5xl font-black text-center mb-16 bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent transform skew-y-1">
            Impossible Objects
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.featuredProducts.slice(0, 6).map((product: any, index: number) => (
              <div
                key={product.id}
                className="group relative bg-gradient-to-br from-pink-900/50 to-purple-900/50 backdrop-blur-sm border border-yellow-400/30 rounded-3xl p-6 hover:border-yellow-400 transition-all duration-500 cursor-pointer transform hover:scale-105 hover:rotate-1"
                style={{
                  transform: `rotate(${(index % 3 - 1) * 2}deg)`,
                  animationDelay: `${index * 0.2}s`
                }}
                onClick={() => onProductClick(product)}
              >
                <div className="aspect-square mb-4 overflow-hidden rounded-2xl transform hover:skew-x-2 transition-transform duration-700">
                  <img
                    src={product.image || product.images?.[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 group-hover:hue-rotate-30 transition-all duration-700"
                  />
                </div>

                <h4 className="text-xl font-bold text-white mb-2 transform group-hover:skew-x-1 transition-transform">
                  {product.name}
                </h4>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{product.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-yellow-400 transform group-hover:scale-110 transition-transform">
                    ${product.price}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAddToCart(product);
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-400 text-purple-900 rounded-full hover:scale-105 transition-transform font-bold"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 