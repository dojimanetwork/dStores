import type { NextApiRequest, NextApiResponse } from 'next';

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  priceRange: string;
  isActive: boolean;
}

const defaultShippingMethods: Record<string, ShippingMethod> = {
  'standard': {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Reliable delivery for everyday orders',
    estimatedTime: '5-7 business days',
    priceRange: '$5.99 - $12.99',
    isActive: false
  },
  'express': {
    id: 'express',
    name: 'Express Shipping',
    description: 'Fast delivery for urgent orders',
    estimatedTime: '2-3 business days',
    priceRange: '$12.99 - $24.99',
    isActive: false
  },
  'overnight': {
    id: 'overnight',
    name: 'Overnight Delivery',
    description: 'Next-day delivery for critical orders',
    estimatedTime: '1 business day',
    priceRange: '$24.99 - $49.99',
    isActive: false
  },
  'international': {
    id: 'international',
    name: 'International Shipping',
    description: 'Worldwide delivery with customs handling',
    estimatedTime: '7-21 business days',
    priceRange: '$19.99 - $89.99',
    isActive: false
  },
  'local-delivery': {
    id: 'local-delivery',
    name: 'Local Delivery',
    description: 'Same-day delivery within local area',
    estimatedTime: 'Same day / 2-4 hours',
    priceRange: '$8.99 - $19.99',
    isActive: false
  },
  'free-shipping': {
    id: 'free-shipping',
    name: 'Free Shipping',
    description: 'Free delivery for qualifying orders',
    estimatedTime: '5-10 business days',
    priceRange: 'Free (min. order $50)',
    isActive: false
  }
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { storeId } = req.query;

  if (!storeId) {
    return res.status(400).json({ error: 'Store ID is required' });
  }

  switch (req.method) {
    case 'GET':
      return handleGetShipping(req, res);
    case 'POST':
    case 'PUT':
      return handleUpdateShipping(req, res);
    default:
      return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleGetShipping(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { storeId, productSource } = req.query;

    // For products imported from external platforms, return their respective shipping
    if (productSource && ['amazon', 'alibaba', 'dstores'].includes(productSource as string)) {
      return res.status(200).json({
        shipping: {
          isManaged: false,
          platform: productSource,
          message: `Shipping is handled by ${productSource}`,
          methods: []
        }
      });
    }

    // For manual products, return configured shipping methods
    // In a real app, this would come from a database
    // For now, we'll simulate this with localStorage-like behavior
    const configuredMethods = getStoredShippingConfig(storeId as string);
    
    return res.status(200).json({
      shipping: {
        isManaged: true,
        platform: 'manual',
        message: 'Shipping managed by store',
        methods: configuredMethods
      }
    });

  } catch (error) {
    console.error('Error fetching shipping:', error);
    return res.status(500).json({ error: 'Failed to fetch shipping configuration' });
  }
}

async function handleUpdateShipping(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { storeId } = req.query;
    const { shippingMethods } = req.body;

    if (!Array.isArray(shippingMethods)) {
      return res.status(400).json({ error: 'shippingMethods must be an array' });
    }

    // Validate that all provided methods exist
    const invalidMethods = shippingMethods.filter(methodId => !defaultShippingMethods[methodId]);
    if (invalidMethods.length > 0) {
      return res.status(400).json({ 
        error: `Invalid shipping methods: ${invalidMethods.join(', ')}` 
      });
    }

    // Update shipping configuration
    const updatedMethods = Object.keys(defaultShippingMethods).map(methodId => ({
      ...defaultShippingMethods[methodId],
      isActive: shippingMethods.includes(methodId)
    }));

    // Store configuration (in a real app, this would go to a database)
    storeShippingConfig(storeId as string, updatedMethods);

    return res.status(200).json({
      success: true,
      message: 'Shipping configuration updated successfully',
      methods: updatedMethods.filter(method => method.isActive)
    });

  } catch (error) {
    console.error('Error updating shipping:', error);
    return res.status(500).json({ error: 'Failed to update shipping configuration' });
  }
}

// Simulate storage functions (in a real app, these would interact with a database)
function getStoredShippingConfig(storeId: string): ShippingMethod[] {
  // This would normally come from a database
  // For demo purposes, we'll return a default configuration
  try {
    // In a real implementation, you'd query your database here
    // For now, we'll simulate with some default active methods
    return Object.values(defaultShippingMethods).filter(method => 
      ['standard', 'express'].includes(method.id)
    ).map(method => ({ ...method, isActive: true }));
  } catch (error) {
    return [];
  }
}

function storeShippingConfig(storeId: string, methods: ShippingMethod[]): void {
  // This would normally save to a database
  // For demo purposes, we'll just log it
  console.log(`Storing shipping config for store ${storeId}:`, methods);
}

// Export types for use in other files
export type { ShippingMethod }; 