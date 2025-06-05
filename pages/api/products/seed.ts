import { NextApiRequest, NextApiResponse } from 'next';
import { productOperations, initializeDatabase } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await initializeDatabase();

    const storeId = 1; // Default store ID

    const sampleProducts = [
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'Premium quality wireless headphones with noise cancellation and 30-hour battery life.',
        price: 199.99,
        images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop'],
        sku: 'WBH-001',
        stock_quantity: 25,
        metadata: {
          status: 'active',
          category: 'Electronics',
          source: 'seed'
        }
      },
      {
        name: 'Organic Cotton T-Shirt',
        description: 'Comfortable and sustainable organic cotton t-shirt available in multiple colors.',
        price: 39.99,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'],
        sku: 'OCT-001',
        stock_quantity: 50,
        metadata: {
          status: 'active',
          category: 'Fashion',
          source: 'seed'
        }
      },
      {
        name: 'Smart Fitness Watch',
        description: 'Track your health and fitness goals with this advanced smartwatch featuring GPS and heart rate monitoring.',
        price: 299.99,
        images: ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop'],
        sku: 'SFW-001',
        stock_quantity: 15,
        metadata: {
          status: 'active',
          category: 'Electronics',
          source: 'seed'
        }
      },
      {
        name: 'Handcrafted Ceramic Mug',
        description: 'Beautiful handcrafted ceramic mug perfect for your morning coffee or evening tea.',
        price: 24.99,
        images: ['https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop'],
        sku: 'HCM-001',
        stock_quantity: 30,
        metadata: {
          status: 'active',
          category: 'Home & Garden',
          source: 'seed'
        }
      },
      {
        name: 'Premium Yoga Mat',
        description: 'Non-slip premium yoga mat made from eco-friendly materials, perfect for all yoga practices.',
        price: 79.99,
        images: ['https://images.unsplash.com/photo-1506003094589-53954a27b17e?w=400&h=400&fit=crop'],
        sku: 'PYM-001',
        stock_quantity: 20,
        metadata: {
          status: 'active',
          category: 'Fitness',
          source: 'seed'
        }
      },
      {
        name: 'Artisan Coffee Beans',
        description: 'Single-origin artisan coffee beans, medium roast with notes of chocolate and caramel.',
        price: 18.99,
        images: ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop'],
        sku: 'ACB-001',
        stock_quantity: 0,
        metadata: {
          status: 'out_of_stock',
          category: 'Food & Beverage',
          source: 'seed'
        }
      }
    ];

    const createdProducts = [];

    for (const productData of sampleProducts) {
      const product = await productOperations.create(storeId, productData);
      createdProducts.push(product);
    }

    return res.status(201).json({
      message: 'Sample products created successfully',
      products: createdProducts,
      count: createdProducts.length
    });

  } catch (error: any) {
    console.error('Seed products error:', error);
    return res.status(500).json({ error: 'Failed to create sample products' });
  }
} 