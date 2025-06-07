import type { NextApiRequest, NextApiResponse } from 'next';

interface CustomShippingOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: number;
  description: string;
}

interface ShippingConfiguration {
  storeId: string;
  customOptions: CustomShippingOption[];
  fulfillmentProviders: string[];
  lastUpdated: string;
}

// Platform-specific shipping definitions
const platformShipping = {
  amazon: {
    name: 'Amazon Shipping',
    methods: [
      { id: 'amazon-standard', name: 'Amazon Standard', estimatedDays: '5-7 days' },
      { id: 'amazon-prime', name: 'Amazon Prime', estimatedDays: '1-2 days' },
      { id: 'amazon-same-day', name: 'Amazon Same Day', estimatedDays: 'Same day' }
    ]
  },
  alibaba: {
    name: 'Alibaba Shipping',
    methods: [
      { id: 'alibaba-standard', name: 'Alibaba Standard', estimatedDays: '7-15 days' },
      { id: 'alibaba-express', name: 'Alibaba Express', estimatedDays: '3-7 days' },
      { id: 'alibaba-premium', name: 'Alibaba Premium', estimatedDays: '5-10 days' }
    ]
  },
  dstores: {
    name: 'dStores Network',
    methods: [
      { id: 'dstores-standard', name: 'Network Standard', estimatedDays: '3-5 days' },
      { id: 'dstores-express', name: 'Network Express', estimatedDays: '1-2 days' }
    ]
  }
};

// Fulfillment provider configurations
const fulfillmentProviders = {
  fedex: {
    name: 'FedEx',
    apiEndpoint: 'https://apis.fedex.com',
    setupInstructions: 'Sign up for FedEx Developer account and obtain API credentials',
    supportedServices: ['Ground', 'Express', 'International', 'Freight']
  },
  ups: {
    name: 'UPS',
    apiEndpoint: 'https://developer.ups.com',
    setupInstructions: 'Register UPS Developer Kit and get access key',
    supportedServices: ['Ground', 'Air', 'International', 'Freight']
  },
  usps: {
    name: 'USPS',
    apiEndpoint: 'https://www.usps.com/business/web-tools-apis',
    setupInstructions: 'Register for USPS Web Tools API',
    supportedServices: ['First-Class', 'Priority', 'Express', 'Media Mail']
  },
  dhl: {
    name: 'DHL',
    apiEndpoint: 'https://developer.dhl.com',
    setupInstructions: 'Create DHL Developer Portal account',
    supportedServices: ['Express', 'International', 'eCommerce', 'Supply Chain']
  },
  shipstation: {
    name: 'ShipStation',
    apiEndpoint: 'https://www.shipstation.com/docs/api',
    setupInstructions: 'Sign up for ShipStation account and generate API key',
    supportedServices: ['All major carriers', 'International', 'Local delivery', 'Custom rates']
  },
  easypost: {
    name: 'EasyPost',
    apiEndpoint: 'https://www.easypost.com/docs/api',
    setupInstructions: 'Create EasyPost account and obtain API keys',
    supportedServices: ['100+ carriers', 'International', 'Last-mile delivery', 'Freight']
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
      const platformData = platformShipping[productSource as keyof typeof platformShipping];
      return res.status(200).json({
        shipping: {
          isManaged: false,
          platform: productSource,
          platformName: platformData.name,
          message: `Shipping is handled by ${platformData.name}`,
          methods: platformData.methods
        }
      });
    }

    // For manual products, return configured shipping methods
    const shippingConfig = getStoredShippingConfig(storeId as string);
    
    return res.status(200).json({
      shipping: {
        isManaged: true,
        platform: 'store',
        message: 'Shipping managed by store',
        customOptions: shippingConfig.customOptions,
        fulfillmentProviders: shippingConfig.fulfillmentProviders.map(providerId => ({
          id: providerId,
          name: fulfillmentProviders[providerId as keyof typeof fulfillmentProviders]?.name || providerId,
          ...fulfillmentProviders[providerId as keyof typeof fulfillmentProviders]
        }))
      },
      customOptions: shippingConfig.customOptions,
      fulfillmentProviders: shippingConfig.fulfillmentProviders
    });

  } catch (error) {
    console.error('Error fetching shipping:', error);
    return res.status(500).json({ error: 'Failed to fetch shipping configuration' });
  }
}

async function handleUpdateShipping(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { storeId } = req.query;
    const { customOptions = [], fulfillmentProviders: providers = [] } = req.body;

    // Validate custom options
    if (!Array.isArray(customOptions)) {
      return res.status(400).json({ error: 'customOptions must be an array' });
    }

    // Validate fulfillment providers
    if (!Array.isArray(providers)) {
      return res.status(400).json({ error: 'fulfillmentProviders must be an array' });
    }

    // Validate custom shipping options structure
    for (const option of customOptions) {
      if (!option.name || typeof option.price !== 'number' || typeof option.estimatedDays !== 'number') {
        return res.status(400).json({ 
          error: 'Each custom option must have name, price (number), and estimatedDays (number)' 
        });
      }
    }

    // Validate fulfillment providers exist
    const invalidProviders = providers.filter(providerId => !fulfillmentProviders[providerId as keyof typeof fulfillmentProviders]);
    if (invalidProviders.length > 0) {
      return res.status(400).json({ 
        error: `Invalid fulfillment providers: ${invalidProviders.join(', ')}` 
      });
    }

    // Create shipping configuration
    const shippingConfig: ShippingConfiguration = {
      storeId: storeId as string,
      customOptions,
      fulfillmentProviders: providers,
      lastUpdated: new Date().toISOString()
    };

    // Store configuration (in a real app, this would go to a database)
    storeShippingConfig(storeId as string, shippingConfig);

    return res.status(200).json({
      success: true,
      message: 'Shipping configuration updated successfully',
      configuration: shippingConfig,
      integrationInstructions: providers.map(providerId => ({
        provider: providerId,
        name: fulfillmentProviders[providerId as keyof typeof fulfillmentProviders]?.name,
        setupInstructions: fulfillmentProviders[providerId as keyof typeof fulfillmentProviders]?.setupInstructions,
        apiEndpoint: fulfillmentProviders[providerId as keyof typeof fulfillmentProviders]?.apiEndpoint
      }))
    });

  } catch (error) {
    console.error('Error updating shipping:', error);
    return res.status(500).json({ error: 'Failed to update shipping configuration' });
  }
}

// Simulate storage functions (in a real app, these would interact with a database)
let shippingConfigurations: Record<string, ShippingConfiguration> = {};

function getStoredShippingConfig(storeId: string): ShippingConfiguration {
  // This would normally come from a database
  // For demo purposes, we'll return stored configuration or defaults
  return shippingConfigurations[storeId] || {
    storeId,
    customOptions: [],
    fulfillmentProviders: [],
    lastUpdated: new Date().toISOString()
  };
}

function storeShippingConfig(storeId: string, config: ShippingConfiguration): void {
  // This would normally save to a database
  // For demo purposes, we'll store in memory
  shippingConfigurations[storeId] = config;
  console.log(`Stored shipping config for store ${storeId}:`, config);
}

// Export types for use in other files
export type { CustomShippingOption, ShippingConfiguration }; 