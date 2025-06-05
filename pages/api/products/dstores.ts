import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchDstoresProducts, getMockDstoresProducts } from '@/lib/dstores';

// Temporary in-memory token store (should be replaced with DB or session)
const tokenStore: Record<string, string> = {
  'demo-store.mydstores.com': 'your-access-token' // replace with real token for testing
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const shop = req.query.shop?.toString();
  
  // For demo purposes, return mock products if no shop is specified or if it's a demo shop
  if (!shop || shop === 'demo-store') {
    const mockProducts = getMockDstoresProducts();
    return res.status(200).json({ 
      products: mockProducts,
      count: mockProducts.length,
      shop: 'demo-store',
      message: 'Demo products loaded successfully' 
    });
  }

  const accessToken = tokenStore[shop];
  if (!accessToken) {
    return res.status(403).json({ 
      error: 'Shop not authorized',
      message: 'Please authorize your Dstores store first' 
    });
  }

  try {
    const products = await fetchDstoresProducts(shop, accessToken);
    res.status(200).json({ 
      products,
      count: products.length,
      shop,
      message: 'Products loaded successfully' 
    });
  } catch (error) {
    console.error('Dstores API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch products from Dstores',
      message: 'Please try again later' 
    });
  }
}
