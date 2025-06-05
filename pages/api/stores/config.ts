import { NextApiRequest, NextApiResponse } from 'next';

interface ShippingOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  type: 'standard' | 'express' | 'overnight' | 'free';
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

// Mock store configuration - in a real app, this would come from a database
const defaultStoreConfig: StoreConfig = {
  id: 1,
  name: "Modern Store",
  currency: "USD",
  taxRate: 0.08, // 8% tax
  freeShippingThreshold: 50,
  shippingOptions: [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Delivery in 5-7 business days',
      price: 9.99,
      estimatedDays: '5-7 days',
      type: 'standard'
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Delivery in 2-3 business days',
      price: 19.99,
      estimatedDays: '2-3 days',
      type: 'express'
    },
    {
      id: 'overnight',
      name: 'Overnight Shipping',
      description: 'Next business day delivery',
      price: 29.99,
      estimatedDays: '1 day',
      type: 'overnight'
    },
    {
      id: 'free',
      name: 'Free Shipping',
      description: 'Free delivery on orders over $50',
      price: 0,
      estimatedDays: '7-10 days',
      type: 'free'
    }
  ],
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

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { storeId = '1' } = req.query;
    
    // In a real app, you'd fetch this from a database based on storeId
    const config = { ...defaultStoreConfig, id: parseInt(storeId as string) };
    
    res.status(200).json(config);
  } catch (error) {
    console.error('Error fetching store config:', error);
    res.status(500).json({ error: 'Failed to fetch store configuration' });
  }
} 