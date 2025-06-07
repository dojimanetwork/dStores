import { NextApiRequest, NextApiResponse } from 'next';

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  type: 'standard' | 'express' | 'overnight' | 'free' | 'local-delivery' | 'international';
  isManual: boolean;
  platform?: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay' | 'bank_transfer';
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

// Default shipping options mapping
const shippingMethodsMap: Record<string, Omit<ShippingOption, 'isManual' | 'platform'>> = {
  'standard': {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Delivery in 5-7 business days',
    price: 9.99,
    estimatedDays: '5-7 days',
    type: 'standard'
  },
  'express': {
    id: 'express',
    name: 'Express Shipping',
    description: 'Delivery in 2-3 business days',
    price: 19.99,
    estimatedDays: '2-3 days',
    type: 'express'
  },
  'overnight': {
    id: 'overnight',
    name: 'Overnight Delivery',
    description: 'Next business day delivery',
    price: 29.99,
    estimatedDays: '1 day',
    type: 'overnight'
  },
  'international': {
    id: 'international',
    name: 'International Shipping',
    description: 'Worldwide delivery with customs handling',
    price: 24.99,
    estimatedDays: '7-21 days',
    type: 'international'
  },
  'local-delivery': {
    id: 'local-delivery',
    name: 'Local Delivery',
    description: 'Same-day delivery within local area',
    price: 12.99,
    estimatedDays: 'Same day',
    type: 'local-delivery'
  },
  'free-shipping': {
    id: 'free-shipping',
    name: 'Free Shipping',
    description: 'Free delivery on orders over $50',
    price: 0,
    estimatedDays: '5-10 days',
    type: 'free'
  }
};

// Platform-specific shipping info
const platformShipping: Record<string, ShippingOption> = {
  'amazon': {
    id: 'amazon-prime',
    name: 'Amazon Prime Shipping',
    description: 'Handled by Amazon with Prime benefits',
    price: 0,
    estimatedDays: '1-2 days',
    type: 'express',
    isManual: false,
    platform: 'amazon'
  },
  'alibaba': {
    id: 'alibaba-shipping',
    name: 'Alibaba Global Shipping',
    description: 'International shipping via Alibaba',
    price: 15.99,
    estimatedDays: '15-30 days',
    type: 'international',
    isManual: false,
    platform: 'alibaba'
  },
  'dstores': {
    id: 'dstores-shipping',
    name: 'Dstores Network Shipping',
    description: 'Shipping via Dstores network',
    price: 8.99,
    estimatedDays: '3-5 days',
    type: 'standard',
    isManual: false,
    platform: 'dstores'
  }
};

// Mock store configuration - in a real app, this would come from a database
const defaultStoreConfig: Omit<StoreConfig, 'shippingOptions'> = {
  id: 1,
  name: "Modern Store",
  currency: "USD",
  taxRate: 0.08, // 8% tax
  freeShippingThreshold: 50,
  shippingOptions: [], // Will be populated dynamically
  paymentMethods: [
    {
      id: 'credit_card',
      name: 'Credit/Debit Card',
      type: 'credit_card',
      enabled: true,
      description: 'Visa, Mastercard, American Express'
    },
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'paypal',
      enabled: true,
      description: 'Pay with your PayPal account'
    },
    {
      id: 'apple_pay',
      name: 'Apple Pay',
      type: 'apple_pay',
      enabled: true,
      description: 'Quick and secure payment with Apple Pay'
    },
    {
      id: 'google_pay',
      name: 'Google Pay',
      type: 'google_pay',
      enabled: true,
      description: 'Pay with Google Pay'
    }
  ],
  businessInfo: {
    address: "123 Commerce Street, Business City, BC 12345",
    phone: "+1 (555) 123-4567",
    email: "support@modernstore.com",
    website: "https://modernstore.com"
  },
  policies: {
    returnPolicy: "30-day return policy on all items. Items must be in original condition.",
    shippingPolicy: "We ship worldwide. Processing time is 1-2 business days.",
    privacyPolicy: "We protect your privacy and never share your personal information."
  }
};

async function getConfiguredShippingMethods(storeId: string): Promise<string[]> {
  // In a real app, this would query the database for the store's configured shipping methods
  // For demo purposes, we'll simulate this with localStorage-like behavior
  try {
    // Try to get from shipping configuration API
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/shipping?storeId=${storeId}`, {
      method: 'GET',
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.shipping?.methods?.map((method: any) => method.id) || [];
    }
  } catch (error) {
    console.error('Error fetching configured shipping methods:', error);
  }
  
  // Fallback to default methods
  return ['standard', 'express'];
}

async function getCartProductSources(storeId: string): Promise<string[]> {
  // In a real app, this would check the current cart contents
  // For demo purposes, we'll return common sources
  try {
    // Try to get current cart or recent products
    const response = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/products?storeId=${storeId}`, {
      method: 'GET',
    });
    
    if (response.ok) {
      const products = await response.json();
      const sources = [...new Set(products.map((p: any) => p.source || 'manual'))];
      return sources;
    }
  } catch (error) {
    console.error('Error fetching product sources:', error);
  }
  
  // Fallback to manual products only
  return ['manual'];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { storeId = '1', cartProducts } = req.query;
    
    // Get configured shipping methods for manual products
    const configuredMethods = await getConfiguredShippingMethods(storeId as string);
    
    // Get product sources (manual vs imported)
    let productSources: string[] = ['manual']; // Default
    
    if (cartProducts) {
      try {
        productSources = JSON.parse(cartProducts as string);
      } catch (error) {
        console.error('Error parsing cart products:', error);
      }
    } else {
      productSources = await getCartProductSources(storeId as string);
    }
    
    // Build shipping options based on product sources
    const shippingOptions: ShippingOption[] = [];
    
    // Add manual shipping options if there are manual products
    const hasManualProducts = productSources.includes('manual') || productSources.includes('seed');
    if (hasManualProducts && configuredMethods.length > 0) {
      configuredMethods.forEach(methodId => {
        if (shippingMethodsMap[methodId]) {
          shippingOptions.push({
            ...shippingMethodsMap[methodId],
            isManual: true
          });
        }
      });
    }
    
    // Add platform-specific shipping for imported products
    productSources.forEach(source => {
      if (platformShipping[source]) {
        shippingOptions.push(platformShipping[source]);
      }
    });
    
    // If no shipping options configured yet, provide defaults for manual products
    if (shippingOptions.length === 0 && hasManualProducts) {
      shippingOptions.push(
        { ...shippingMethodsMap.standard, isManual: true },
        { ...shippingMethodsMap.express, isManual: true }
      );
    }
    
    const config: StoreConfig = {
      ...defaultStoreConfig,
      id: parseInt(storeId as string),
      shippingOptions
    };
    
    res.status(200).json(config);
  } catch (error) {
    console.error('Error fetching store config:', error);
    res.status(500).json({ error: 'Failed to fetch store configuration' });
  }
} 