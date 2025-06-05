import { NextApiRequest, NextApiResponse } from 'next';
import { productOperations, initializeDatabase } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Ensure database is initialized
    await initializeDatabase();

    const { method } = req;
    const storeId = req.query.storeId ? parseInt(req.query.storeId as string) : 1; // Default store ID for demo

    switch (method) {
      case 'GET':
        // Get all products for a store
        const products = await productOperations.findByStoreId(storeId);
        return res.status(200).json({ products });

      case 'POST':
        // Create new product
        const { name, description, price, images, sku, stock_quantity, status, metadata } = req.body;

        // Validation
        if (!name || !price) {
          return res.status(400).json({ error: 'Name and price are required' });
        }

        // Map frontend status to database structure
        const productData = {
          name,
          description,
          price: parseFloat(price),
          images: images || [],
          sku,
          stock_quantity: stock_quantity || 0,
          metadata: {
            status: status || 'draft',
            ...metadata
          }
        };

        const product = await productOperations.create(storeId, productData);
        return res.status(201).json({ message: 'Product created successfully', product });

      case 'PUT':
        // Update product
        const productId = parseInt(req.query.id as string);
        if (!productId) {
          return res.status(400).json({ error: 'Product ID is required' });
        }

        const updates = { ...req.body };
        if (updates.status) {
          // Move status to metadata
          updates.metadata = { ...updates.metadata, status: updates.status };
          delete updates.status;
        }

        const updatedProduct = await productOperations.update(productId, updates);
        return res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });

      case 'DELETE':
        // Soft delete product
        const deleteId = parseInt(req.query.id as string);
        if (!deleteId) {
          return res.status(400).json({ error: 'Product ID is required' });
        }

        await productOperations.delete(deleteId);
        return res.status(200).json({ message: 'Product deleted successfully' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Products API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 