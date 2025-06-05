// This is a placeholder utility file for Dstores integration
// and then fetch their product list using Dstores's Admin API.

import axios from 'axios';

const DSTORES_API_VERSION = '2024-01';

interface DstoresProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  handle: string;
  status: string;
  images: Array<{
    id: number;
    src: string;
    alt?: string;
    width: number;
    height: number;
  }>;
  variants: Array<{
    id: number;
    title: string;
    price: string;
    inventory_quantity: number;
    sku: string;
  }>;
  dstores_id: number;
}

interface FormattedProduct {
  name: string;
  description: string;
  price: number;
  images: string[];
  sku: string;
  stock_quantity: number;
  metadata: {
    source: string;
    dstores_id: number;
    vendor: string;
    product_type: string;
    handle: string;
    status: string;
  };
}

export async function fetchDstoresProducts(shopName: string, accessToken: string): Promise<FormattedProduct[]> {
  try {
    const response = await axios.get(
      `https://${shopName}.mydstores.com/admin/api/${DSTORES_API_VERSION}/products.json`,
      {
        headers: {
          'X-Dstores-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      }
    );

    const dstoresProducts: DstoresProduct[] = response.data.products;
    
    // Format products for our system
    return dstoresProducts.map(product => formatDstoresProduct(product));
  } catch (error) {
    console.error('Failed to fetch Dstores products:', error);
    return [];
  }
}

export function formatDstoresProduct(product: DstoresProduct): FormattedProduct {
  // Get the first variant for price and stock info
  const primaryVariant = product.variants[0];
  
  // Extract all image URLs
  const images = product.images.map(img => img.src).filter(Boolean);
  
  // Clean HTML from description
  const description = product.body_html
    ? product.body_html.replace(/<[^>]*>/g, '').trim()
    : '';

  return {
    name: product.title,
    description,
    price: parseFloat(primaryVariant?.price || '0'),
    images,
    sku: primaryVariant?.sku || `DSTORES-${product.id}`,
    stock_quantity: primaryVariant?.inventory_quantity || 0,
    metadata: {
      source: 'dstores',
      dstores_id: product.id,
      vendor: product.vendor,
      product_type: product.product_type,
      handle: product.handle,
      status: product.status
    }
  };
}

// Mock Dstores products for demo purposes
export function getMockDstoresProducts(): FormattedProduct[] {
  return [
    {
      name: "Premium Wireless Headphones",
      description: "High-quality wireless headphones with noise cancellation and 30-hour battery life. Perfect for music lovers and professionals.",
      price: 299.99,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500"
      ],
      sku: "PWH-001",
      stock_quantity: 25,
      metadata: {
        source: 'dstores',
        dstores_id: 7891234567890,
        vendor: 'AudioTech',
        product_type: 'Electronics',
        handle: 'premium-wireless-headphones',
        status: 'active'
      }
    },
    {
      name: "Smart Fitness Tracker",
      description: "Advanced fitness tracker with heart rate monitoring, GPS, and 7-day battery life. Track your health and fitness goals.",
      price: 249.99,
      images: [
        "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=500",
        "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=500"
      ],
      sku: "SFT-002",
      stock_quantity: 40,
      metadata: {
        source: 'dstores',
        dstores_id: 7891234567891,
        vendor: 'FitTech',
        product_type: 'Electronics',
        handle: 'smart-fitness-tracker',
        status: 'active'
      }
    },
    {
      name: "Organic Cotton T-Shirt",
      description: "Soft and comfortable organic cotton t-shirt. Sustainably made with eco-friendly materials. Available in multiple colors.",
      price: 39.99,
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
        "https://images.unsplash.com/photo-1583743814966-8936f37f9982?w=500"
      ],
      sku: "OCT-003",
      stock_quantity: 100,
      metadata: {
        source: 'dstores',
        dstores_id: 7891234567892,
        vendor: 'EcoWear',
        product_type: 'Apparel',
        handle: 'organic-cotton-t-shirt',
        status: 'active'
      }
    },
    {
      name: "Minimalist Desk Lamp",
      description: "Modern LED desk lamp with adjustable brightness and color temperature. Perfect for office or study spaces.",
      price: 89.99,
      images: [
        "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=500",
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500"
      ],
      sku: "MDL-004",
      stock_quantity: 15,
      metadata: {
        source: 'dstores',
        dstores_id: 7891234567893,
        vendor: 'LightCraft',
        product_type: 'Home & Garden',
        handle: 'minimalist-desk-lamp',
        status: 'active'
      }
    },
    {
      name: "Portable Bluetooth Speaker",
      description: "Compact waterproof Bluetooth speaker with 360-degree sound and 12-hour battery. Perfect for outdoor adventures.",
      price: 89.99,
      images: [
        "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500",
        "https://images.unsplash.com/photo-1589003077984-894e133dabab?w=500"
      ],
      sku: "PBS-005",
      stock_quantity: 30,
      metadata: {
        source: 'dstores',
        dstores_id: 7891234567894,
        vendor: 'SoundWave',
        product_type: 'Electronics',
        handle: 'portable-bluetooth-speaker',
        status: 'active'
      }
    }
  ];
} 