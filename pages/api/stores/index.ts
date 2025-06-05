import { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth, AuthRequest } from '../../../lib/auth';
import { storeOperations, initializeDatabase } from '../../../lib/database';

async function handler(req: AuthRequest, res: NextApiResponse) {
  try {
    // Ensure database is initialized
    await initializeDatabase();

    if (req.method === 'GET') {
      // Get user's stores
      const stores = await storeOperations.findByUserId(req.user!.id);
      return res.status(200).json({ stores });
    }

    if (req.method === 'POST') {
      // Create new store
      const { name, template_id } = req.body;

      // Validation
      if (!name) {
        return res.status(400).json({ error: 'Store name is required' });
      }

      if (name.length < 3 || name.length > 50) {
        return res.status(400).json({ error: 'Store name must be between 3 and 50 characters' });
      }

      // Create store
      const store = await storeOperations.create(req.user!.id, name, template_id);

      return res.status(201).json({
        message: 'Store created successfully',
        store
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('Stores API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default requireAuth(handler); 