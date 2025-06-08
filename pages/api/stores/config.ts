import { NextApiRequest, NextApiResponse } from 'next';

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  type: 'custom' | 'fulfillment' | 'platform';
  isManual: boolean;
  platform?: string;
  provider?: string;
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

// Platform-specific shipping info
const platformShipping: Record<string, ShippingOption[]> = {
  'amazon': [
    {
      id: 'amazon-standard',
      name: 'Amazon Standard',
      description: 'Standard Amazon shipping',
      price: 0,
      estimatedDays: '5-7 days',
      type: 'platform',
      isManual: false,
      platform: 'amazon'
    },
    {
      id: 'amazon-prime',
      name: 'Amazon Prime',
      description: 'Fast delivery with Prime benefits',
      price: 0,
      estimatedDays: '1-2 days',
      type: 'platform',
      isManual: false,
      platform: 'amazon'
    },
    {
      id: 'amazon-same-day',
      name: 'Amazon Same Day',
      description: 'Same day delivery in select areas',
      price: 4.99,
      estimatedDays: 'Same day',
      type: 'platform',
      isManual: false,
      platform: 'amazon'
    }
  ],
  'alibaba': [
    {
      id: 'alibaba-standard',
      name: 'Alibaba Standard',
      description: 'Standard international shipping',
      price: 15.99,
      estimatedDays: '7-15 days',
      type: 'platform',
      isManual: false,
      platform: 'alibaba'
    },
    {
      id: 'alibaba-express',
      name: 'Alibaba Express',
      description: 'Faster international delivery',
      price: 25.99,
      estimatedDays: '3-7 days',
      type: 'platform',
      isManual: false,
      platform: 'alibaba'
    },
    {
      id: 'alibaba-premium',
      name: 'Alibaba Premium',
      description: 'Premium shipping with tracking',
      price: 35.99,
      estimatedDays: '5-10 days',
      type: 'platform',
      isManual: false,
      platform: 'alibaba'
    }
  ],
  'dstores': [
    {
      id: 'dstores-standard',
      name: 'Network Standard',
      description: 'Standard dStores network shipping',
      price: 8.99,
      estimatedDays: '3-5 days',
      type: 'platform',
      isManual: false,
      platform: 'dstores'
    },
    {
      id: 'dstores-express',
      name: 'Network Express',
      description: 'Express delivery via dStores network',
      price: 15.99,
      estimatedDays: '1-2 days',
      type: 'platform',
      isManual: false,
      platform: 'dstores'
    }
  ]
};

// Fulfillment provider shipping estimates
const fulfillmentProviderShipping: Record<string, ShippingOption[]> = {
  'fedex': [
    {
      id: 'fedex-ground',
      name: 'FedEx Ground',
      description: 'Reliable ground shipping',
      price: 12.99,
      estimatedDays: '1-5 days',
      type: 'fulfillment',
      isManual: true,
      provider: 'fedex'
    },
    {
      id: 'fedex-express',
      name: 'FedEx Express',
      description: 'Fast overnight delivery',
      price: 24.99,
      estimatedDays: '1-2 days',
      type: 'fulfillment',
      isManual: true,
      provider: 'fedex'
    }
  ],
  'ups': [
    {
      id: 'ups-ground',
      name: 'UPS Ground',
      description: 'Economical ground delivery',
      price: 11.99,
      estimatedDays: '1-5 days',
      type: 'fulfillment',
      isManual: true,
      provider: 'ups'
    },
    {
      id: 'ups-air',
      name: 'UPS Next Day Air',
      description: 'Next business day delivery',
      price: 29.99,
      estimatedDays: '1 day',
      type: 'fulfillment',
      isManual: true,
      provider: 'ups'
    }
  ],
  'usps': [
    {
      id: 'usps-priority',
      name: 'USPS Priority Mail',
      description: 'Fast, reliable postal service',
      price: 8.99,
      estimatedDays: '1-3 days',
      type: 'fulfillment',
      isManual: true,
      provider: 'usps'
    },
    {
      id: 'usps-express',
      name: 'USPS Express',
      description: 'Overnight delivery guarantee',
      price: 22.99,
      estimatedDays: '1 day',
      type: 'fulfillment',
      isManual: true,
      provider: 'usps'
    }
  ],
  'dhl': [
    {
      id: 'dhl-express',
      name: 'DHL Express',
      description: 'International express delivery',
      price: 35.99,
      estimatedDays: '1-3 days',
      type: 'fulfillment',
      isManual: true,
      provider: 'dhl'
    }
  ],
  'shipstation': [
    {
      id: 'shipstation-economy',
      name: 'Economy Shipping',
      description: 'Cost-effective multi-carrier',
      price: 7.99,
      estimatedDays: '3-7 days',
      type: 'fulfillment',
      isManual: true,
      provider: 'shipstation'
    },
    {
      id: 'shipstation-priority',
      name: 'Priority Shipping',
      description: 'Fast multi-carrier delivery',
      price: 16.99,
      estimatedDays: '1-3 days',
      type: 'fulfillment',
      isManual: true,
      provider: 'shipstation'
    }
  ],
  'easypost': [
    {
      id: 'easypost-best-rate',
      name: 'Best Rate',
      description: 'Automatically selects cheapest option',
      price: 9.99,
      estimatedDays: '3-5 days',
      type: 'fulfillment',
      isManual: true,
      provider: 'easypost'
    },
    {
      id: 'easypost-fastest',
      name: 'Fastest Delivery',
      description: 'Automatically selects fastest option',
      price: 19.99,
      estimatedDays: '1-2 days',
      type: 'fulfillment',
      isManual: true,
      provider: 'easypost'
    }
  ]
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

async function getConfiguredShippingOptions(storeId: string): Promise<{ customOptions: any[], fulfillmentProviders: string[] }> {
  try {
    // Try to get from shipping configuration API
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/shipping?storeId=${storeId}`, {
      method: 'GET',
    });
    
    if (response.ok) {
      const data = await response.json();
      return {
        customOptions: data.customOptions || [],
        fulfillmentProviders: data.fulfillmentProviders || []
      };
    }
  } catch (error) {
    console.error('Error fetching configured shipping options:', error);
  }
  
  // Fallback to empty configuration
  return {
    customOptions: [],
    fulfillmentProviders: []
  };
}

async function getCartProductSources(storeId: string): Promise<string[]> {
  try {
    // Try to get current cart or recent products
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/api/products?storeId=${storeId}`, {
      method: 'GET',
    });
    
    if (response.ok) {
      const data = await response.json();
      const products = data.products || [];
      const sources = [...new Set(products.map((p: any) => {
        const source = p.source || p.metadata?.source;
        return source || 'manual';
      }))];
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
    
    // Get configured shipping options for manual products
    const { customOptions, fulfillmentProviders } = await getConfiguredShippingOptions(storeId as string);
    
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
    
    // Add custom shipping options if there are manual products
    const hasManualProducts = productSources.includes('manual') || productSources.includes('seed');
    if (hasManualProducts && customOptions.length > 0) {
      customOptions.forEach((option: any) => {
        shippingOptions.push({
          id: option.id,
          name: option.name,
          description: option.description || `Delivery in ${option.estimatedDays} business days`,
          price: option.price,
          estimatedDays: `${option.estimatedDays} business days`,
          type: 'custom',
          isManual: true
        });
      });
    }
    
    // Add fulfillment provider shipping options for manual products
    if (hasManualProducts && fulfillmentProviders.length > 0) {
      fulfillmentProviders.forEach((providerId: string) => {
        const providerOptions = fulfillmentProviderShipping[providerId];
        if (providerOptions) {
          shippingOptions.push(...providerOptions);
        }
      });
    }
    
    // Add platform-specific shipping for imported products
    productSources.forEach(source => {
      if (platformShipping[source]) {
        shippingOptions.push(...platformShipping[source]);
      }
    });
    
    // If no shipping options configured yet, provide a basic default for manual products
    if (shippingOptions.length === 0 && hasManualProducts) {
      shippingOptions.push({
        id: 'default-standard',
        name: 'Standard Shipping',
        description: 'Standard delivery service',
        price: 9.99,
        estimatedDays: '5-7 business days',
        type: 'custom',
        isManual: true
      });
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