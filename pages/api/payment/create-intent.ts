import { NextApiRequest, NextApiResponse } from 'next';
import { processPayment, calculateShipping, calculateTax } from '../../../lib/payments';
import { storeOperations, initializeDatabase } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure database is initialized
    await initializeDatabase();

    const {
      store_id,
      customer_email,
      customer_name,
      customer_address,
      items,
      payment_method,
      shipping_method = 'standard'
    } = req.body;

    // Validation
    if (!store_id || !customer_email || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer_email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    if (!['stripe', 'crypto'].includes(payment_method)) {
      return res.status(400).json({ error: 'Invalid payment method' });
    }

    // Verify store exists
    const store = await storeOperations.findById(store_id);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = await calculateShipping(items, customer_address, shipping_method);
    const tax = await calculateTax(items, customer_address);
    const total = subtotal + shipping + tax;

    // Add calculated amounts to items for order processing
    const orderItems = items.map(item => ({
      ...item,
      subtotal: item.price * item.quantity
    }));

    // Process payment
    const result = await processPayment({
      store_id,
      customer_email,
      customer_name,
      customer_address: {
        ...customer_address,
        shipping_method
      },
      items: orderItems,
      payment_method,
      metadata: {
        subtotal,
        shipping,
        tax,
        total
      }
    });

    return res.status(200).json({
      order: result.order,
      payment: result.payment,
      totals: {
        subtotal,
        shipping,
        tax,
        total
      }
    });
  } catch (error: any) {
    console.error('Payment intent creation error:', error);
    return res.status(500).json({ error: 'Failed to create payment intent' });
  }
} 