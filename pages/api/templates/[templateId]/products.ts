import { NextApiRequest, NextApiResponse } from 'next';
import { productOperations, initializeDatabase } from '../../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Ensure database is initialized
    await initializeDatabase();

    const { method } = req;
    const { templateId } = req.query;
    const storeId = req.query.storeId ? parseInt(req.query.storeId as string) : 1; // Default store ID for demo

    if (method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get all active products for the store
    const dbProducts = await productOperations.findByStoreId(storeId);
    
    // Transform products to template-friendly format
    const products = dbProducts
      .filter(product => {
        const status = product.metadata?.status || 'draft';
        return status === 'active'; // Only show active products in templates
      })
      .map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        image: product.images?.[0] || 'https://placehold.co/400x400/e5e7eb/6b7280?text=No+Image',
        images: product.images || [],
        sku: product.sku,
        stock: product.stock_quantity,
        status: product.metadata?.status || 'draft',
        inStock: product.stock_quantity > 0,
        formattedPrice: `$${parseFloat(product.price).toFixed(2)}`,
        slug: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        category: product.metadata?.category || 'General'
      }));

    // Template-specific product organization
    const templateData = {
      templateId,
      products,
      featuredProducts: products.slice(0, 4), // First 4 products as featured
      categories: [...new Set(products.map(p => p.category))],
      totalProducts: products.length,
      totalValue: products.reduce((sum, p) => sum + p.price, 0),
      inStockCount: products.filter(p => p.inStock).length
    };

    return res.status(200).json(templateData);

  } catch (error: any) {
    console.error('Template products API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 