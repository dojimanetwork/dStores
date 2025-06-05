import { NextApiRequest, NextApiResponse } from 'next';
import { addSampleProducts } from '../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const storeId = req.body.storeId || 1;
    const count = await addSampleProducts(storeId);
    
    res.status(200).json({ 
      success: true, 
      message: `Added ${count} sample products with images`,
      count 
    });
  } catch (error: any) {
    console.error('Error adding sample products:', error);
    res.status(500).json({ 
      error: 'Failed to add sample products',
      details: error.message 
    });
  }
} 