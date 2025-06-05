import { NextApiRequest, NextApiResponse } from 'next';
import { productOperations, initializeDatabase } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await initializeDatabase();

    const { name, source, storeId } = req.body;
    
    console.log(`🔍 Checking for duplicate: "${name}" from source: "${source}" in store: ${storeId}`);

    if (!name || !storeId) {
      return res.status(400).json({ error: 'Name and storeId are required' });
    }

    // Get all products for the store
    const products = await productOperations.findByStoreId(storeId);
    console.log(`📊 Found ${products.length} total products in database`);
    
    // Check for duplicates by name and source
    const existingProduct = products.find(product => {
      const productSource = product.metadata?.source || 'unknown';
      const nameMatch = product.name.toLowerCase().trim() === name.toLowerCase().trim();
      const sourceMatch = productSource === (source || 'manual');
      
      console.log(`🔍 Comparing: "${product.name}" (${productSource}) vs "${name}" (${source}) - Name match: ${nameMatch}, Source match: ${sourceMatch}`);
      
      return nameMatch && sourceMatch;
    });

    if (existingProduct) {
      console.log(`✅ Found duplicate: ID ${existingProduct.id}, Name: "${existingProduct.name}", Source: ${existingProduct.metadata?.source}`);
      return res.status(200).json({
        exists: true,
        product: {
          id: existingProduct.id,
          name: existingProduct.name,
          source: existingProduct.metadata?.source || 'unknown'
        }
      });
    }

    console.log(`❌ No duplicate found for "${name}" from "${source}"`);
    return res.status(200).json({
      exists: false,
      product: null
    });

  } catch (error: any) {
    console.error('Check duplicate API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 