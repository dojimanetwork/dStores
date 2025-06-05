import { NextApiRequest, NextApiResponse } from 'next';
import { initializeDatabase, storeOperations, userOperations } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Initialize database first
    await initializeDatabase();

    // Check if default store exists
    const existingStore = await storeOperations.findById(1);
    
    if (existingStore) {
      return res.status(200).json({ 
        message: 'Default store already exists', 
        store: existingStore 
      });
    }

    // If store doesn't exist, the initializeDatabase function should have created it
    // Let's check again
    const store = await storeOperations.findById(1);
    
    if (store) {
      return res.status(200).json({ 
        message: 'Default store initialized successfully', 
        store 
      });
    } else {
      return res.status(500).json({ 
        error: 'Failed to initialize default store' 
      });
    }

  } catch (error: any) {
    console.error('Store initialization error:', error);
    return res.status(500).json({ 
      error: 'Failed to initialize store', 
      details: error.message 
    });
  }
} 