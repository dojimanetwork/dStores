import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { TEMPLATES } from '../../../../components/templatesData';

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

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  type: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: string;
  enabled: boolean;
  description?: string;
}

interface StoreConfig {
  id: number;
  name: string;
  currency: string;
  taxRate: number;
  freeShippingThreshold: number;
  shippingOptions: ShippingOption[];
  paymentMethods: PaymentMethod[];
  businessInfo: {
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  policies: {
    returnPolicy: string;
    shippingPolicy: string;
    privacyPolicy: string;
  };
}

export default function TemplateCartPage() {
  const router = useRouter();
  const { templateId } = router.query;
  const [cart, setCart] = useState<CartItem[]>([]);
  const [storeConfig, setStoreConfig] = useState<StoreConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const [billingInfo, setBillingInfo] = useState({
    sameAsShipping: true,
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  const template = TEMPLATES.find(t => t.id === templateId);

  useEffect(() => {
    if (router.isReady && templateId) {
      // Load cart from localStorage
      const savedCart = localStorage.getItem(`cart_${templateId}_1`);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to load cart:', e);
        }
      }
      
      // Fetch store configuration
      fetchStoreConfig();
    }
  }, [router.isReady, templateId]);

  const fetchStoreConfig = async () => {
    try {
      const response = await fetch('/api/stores/config?storeId=1');
      if (!response.ok) {
        throw new Error('Failed to fetch store configuration');
      }
      const config = await response.json();
      setStoreConfig(config);
      
      // Set default shipping option
      if (config.shippingOptions.length > 0) {
        setSelectedShipping(config.shippingOptions[0]);
      }
      
      // Set default payment method
      const enabledPayments = config.paymentMethods.filter((pm: PaymentMethod) => pm.enabled);
      if (enabledPayments.length > 0) {
        setSelectedPayment(enabledPayments[0]);
      }
    } catch (error) {
      console.error('Error fetching store config:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined' && cart.length >= 0 && templateId) {
      localStorage.setItem(`cart_${templateId}_1`, JSON.stringify(cart));
    }
  }, [cart, templateId]);

  const navigateToTemplate = (page?: string) => {
    if (page === 'products') {
      router.push(`/dashboard/templates/products/${templateId}`);
    } else {
      router.push(`/dashboard/templates/${templateId}`);
    }
  };

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Cart calculations
  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getShippingCost = () => {
    if (!selectedShipping || !storeConfig) return 0;
    
    const subtotal = getSubtotal();
    if (selectedShipping.type === 'free' || subtotal >= storeConfig.freeShippingThreshold) {
      return 0;
    }
    return selectedShipping.price;
  };

  const getTaxAmount = () => {
    if (!storeConfig) return 0;
    return getSubtotal() * storeConfig.taxRate;
  };

  const getTotal = () => {
    return getSubtotal() + getShippingCost() + getTaxAmount();
  };

  const handleCheckoutNext = () => {
    setCheckoutStep(prev => Math.min(prev + 1, 4));
  };

  const handleCheckoutPrev = () => {
    setCheckoutStep(prev => Math.max(prev - 1, 1));
  };

  const handlePlaceOrder = async () => {
    try {
      setLoading(true);
      
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newOrderNumber = `ORD-${Date.now()}`;
      setOrderNumber(newOrderNumber);
      setOrderPlaced(true);
      clearCart();
      
      // Show success message
      console.log('Order placed successfully!');
    } catch (error) {
      console.error('Failed to place order:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't render until router is ready
  if (!router.isReady) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Order Confirmation</h1>
              <button
                onClick={() => navigateToTemplate()}
                className="text-blue-600 hover:text-blue-800"
              >
                Return to Store
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-6 py-12 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">Your order #{orderNumber} has been confirmed and will be processed shortly.</p>
            <div className="space-y-4">
              <button
                onClick={() => navigateToTemplate()}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigateToTemplate('products')}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                View Products
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateToTemplate()}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Back to Store
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{template?.name} - Shopping Cart</h1>
            </div>
            
            <button
              onClick={() => navigateToTemplate('products')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </header>

      {cart.length === 0 ? (
        <div className="max-w-2xl mx-auto px-6 py-12 text-center">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to get started!</p>
            <button
              onClick={() => navigateToTemplate('products')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {['Cart', 'Shipping', 'Payment', 'Review'].map((step, index) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                    index + 1 <= checkoutStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-300 text-gray-600'
                  }`}>
                    {index + 1}
                  </div>
                  <span className={`ml-2 font-medium ${
                    index + 1 <= checkoutStep ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                  {index < 3 && (
                    <div className={`h-1 w-16 mx-4 ${
                      index + 1 < checkoutStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {checkoutStep === 1 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">Shopping Cart</h2>
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.product.name}</h3>
                          <p className="text-gray-600">{item.product.formattedPrice}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"
                          >
                            -
                          </button>
                          <span className="w-12 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border flex items-center justify-center hover:bg-gray-50"
                          >
                            +
                          </button>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-red-500 text-sm hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {checkoutStep === 2 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                      <input
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                      <input
                        type="text"
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                      <input
                        type="text"
                        value={shippingInfo.address}
                        onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        type="text"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <input
                        type="text"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Shipping Options */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Shipping Options</h3>
                    <div className="space-y-3">
                      {storeConfig?.shippingOptions.map((option) => (
                        <label key={option.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="shipping"
                            value={option.id}
                            checked={selectedShipping?.id === option.id}
                            onChange={() => setSelectedShipping(option)}
                            className="text-blue-600"
                          />
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <div>
                                <div className="font-medium">{option.name}</div>
                                <div className="text-gray-600 text-sm">{option.description}</div>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">
                                  {option.price === 0 ? 'Free' : `$${option.price.toFixed(2)}`}
                                </div>
                                <div className="text-gray-600 text-sm">{option.estimatedDays}</div>
                              </div>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {checkoutStep === 3 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
                  
                  {/* Payment Methods */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                    <div className="space-y-3">
                      {storeConfig?.paymentMethods.filter(pm => pm.enabled).map((method) => (
                        <label key={method.id} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={selectedPayment?.id === method.id}
                            onChange={() => setSelectedPayment(method)}
                            className="text-blue-600"
                          />
                          <div className="ml-4">
                            <div className="font-medium">{method.name}</div>
                            {method.description && (
                              <div className="text-gray-600 text-sm">{method.description}</div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Card Details (if credit card selected) */}
                  {selectedPayment?.type === 'credit_card' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                        <input
                          type="text"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                        <input
                          type="text"
                          value={paymentInfo.expiryDate}
                          onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                        <input
                          type="text"
                          value={paymentInfo.cvv}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
                        <input
                          type="text"
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {checkoutStep === 4 && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-xl font-semibold mb-6">Order Review</h2>
                  
                  {/* Order Items */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-4">Items</h3>
                    <div className="space-y-3">
                      {cart.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <span>{item.product.name} x {item.quantity}</span>
                          <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Shipping Address</h3>
                    <p className="text-gray-600">
                      {shippingInfo.firstName} {shippingInfo.lastName}<br />
                      {shippingInfo.address}<br />
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                    </p>
                  </div>

                  {/* Payment Info */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-2">Payment Method</h3>
                    <p className="text-gray-600">{selectedPayment?.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${getShippingCost().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${getTaxAmount().toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {checkoutStep < 4 ? (
                    <button
                      onClick={handleCheckoutNext}
                      className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      {checkoutStep === 1 ? 'Proceed to Shipping' :
                       checkoutStep === 2 ? 'Proceed to Payment' :
                       'Review Order'}
                    </button>
                  ) : (
                    <button
                      onClick={handlePlaceOrder}
                      disabled={loading}
                      className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </button>
                  )}
                  
                  {checkoutStep > 1 && (
                    <button
                      onClick={handleCheckoutPrev}
                      className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 