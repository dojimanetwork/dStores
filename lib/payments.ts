import Stripe from 'stripe';
import { orderOperations } from './database';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

export interface PaymentIntent {
  id: string;
  client_secret: string;
  amount: number;
  currency: string;
  status: string;
}

export interface Order {
  id: number;
  store_id: number;
  customer_email: string;
  customer_name?: string;
  total_amount: number;
  items: any[];
  status: string;
  payment_method: string;
  payment_status: string;
}

// Create Stripe payment intent
export async function createPaymentIntent(
  amount: number,
  currency: string = 'usd',
  metadata?: Record<string, string>
): Promise<PaymentIntent> {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: currency.toLowerCase(),
      metadata: metadata || {},
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      id: paymentIntent.id,
      client_secret: paymentIntent.client_secret!,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
    };
  } catch (error) {
    console.error('Stripe payment intent creation failed:', error);
    throw new Error('Failed to create payment intent');
  }
}

// Confirm payment
export async function confirmPayment(paymentIntentId: string): Promise<boolean> {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent.status === 'succeeded';
  } catch (error) {
    console.error('Payment confirmation failed:', error);
    return false;
  }
}

// Create order
export async function createOrder(orderData: {
  store_id: number;
  customer_email: string;
  customer_name?: string;
  customer_address?: any;
  items: any[];
  payment_method: string;
  metadata?: any;
}): Promise<Order> {
  try {
    // Calculate total amount
    const total_amount = orderData.items.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);

    const order = await orderOperations.create({
      ...orderData,
      total_amount,
    });

    return order;
  } catch (error) {
    console.error('Order creation failed:', error);
    throw new Error('Failed to create order');
  }
}

// Process payment and create order
export async function processPayment(orderData: {
  store_id: number;
  customer_email: string;
  customer_name?: string;
  customer_address?: any;
  items: any[];
  payment_method: 'stripe' | 'crypto';
  metadata?: any;
}): Promise<{ order: Order; payment?: PaymentIntent }> {
  try {
    // Create order first
    const order = await createOrder(orderData);

    if (orderData.payment_method === 'stripe') {
      // Create Stripe payment intent
      const paymentIntent = await createPaymentIntent(
        order.total_amount,
        'usd',
        {
          order_id: order.id.toString(),
          store_id: order.store_id.toString(),
        }
      );

      return { order, payment: paymentIntent };
    } else if (orderData.payment_method === 'crypto') {
      // Handle crypto payment logic here
      // For now, we'll mark it as pending
      await orderOperations.updateStatus(order.id, 'pending', 'awaiting_crypto_payment');
      return { order };
    }

    throw new Error('Invalid payment method');
  } catch (error) {
    console.error('Payment processing failed:', error);
    throw error;
  }
}

// Handle Stripe webhook
export async function handleStripeWebhook(
  body: string,
  signature: string
): Promise<void> {
  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.order_id;
        
        if (orderId) {
          await orderOperations.updateStatus(
            parseInt(orderId),
            'processing',
            'paid'
          );
          
          // Send confirmation email here
          await sendOrderConfirmationEmail(parseInt(orderId));
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        const failedOrderId = failedPayment.metadata.order_id;
        
        if (failedOrderId) {
          await orderOperations.updateStatus(
            parseInt(failedOrderId),
            'failed',
            'failed'
          );
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Webhook handling failed:', error);
    throw error;
  }
}

// Crypto payment verification (placeholder)
export async function verifyCryptoPayment(
  transactionHash: string,
  expectedAmount: number,
  walletAddress: string
): Promise<boolean> {
  // This would integrate with a blockchain API to verify the transaction
  // For demo purposes, we'll simulate verification
  try {
    // In a real implementation, you would:
    // 1. Connect to blockchain API (Ethereum, Bitcoin, etc.)
    // 2. Verify transaction hash exists
    // 3. Check transaction amount matches expected amount
    // 4. Verify destination address matches your wallet
    // 5. Check transaction confirmations
    
    console.log('Verifying crypto payment:', {
      transactionHash,
      expectedAmount,
      walletAddress
    });
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return true for demo (in real app, implement actual verification)
    return true;
  } catch (error) {
    console.error('Crypto payment verification failed:', error);
    return false;
  }
}

// Send order confirmation email
export async function sendOrderConfirmationEmail(orderId: number): Promise<void> {
  try {
    // This would integrate with an email service like SendGrid, Resend, etc.
    // For now, we'll just log it
    console.log(`Sending order confirmation email for order ${orderId}`);
    
    // In a real implementation:
    // 1. Get order details from database
    // 2. Generate email template with order information
    // 3. Send email using your preferred email service
    // 4. Log email sending status
  } catch (error) {
    console.error('Failed to send order confirmation email:', error);
  }
}

// Refund order
export async function refundOrder(orderId: number, amount?: number): Promise<boolean> {
  try {
    const order = await orderOperations.findById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.payment_method === 'stripe') {
      // Find the payment intent and refund it
      const paymentIntents = await stripe.paymentIntents.list({
        limit: 100,
      });

      const paymentIntent = paymentIntents.data.find(
        pi => pi.metadata.order_id === orderId.toString()
      );

      if (paymentIntent) {
        const refund = await stripe.refunds.create({
          payment_intent: paymentIntent.id,
          amount: amount ? Math.round(amount * 100) : undefined,
        });

        if (refund.status === 'succeeded') {
          await orderOperations.updateStatus(orderId, 'refunded', 'refunded');
          return true;
        }
      }
    } else if (order.payment_method === 'crypto') {
      // Handle crypto refunds (more complex, usually manual)
      await orderOperations.updateStatus(orderId, 'refund_requested', 'refund_pending');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Refund failed:', error);
    throw error;
  }
}

// Get payment methods for store
export async function getPaymentMethods(storeId: number): Promise<string[]> {
  // This would typically be stored in the store settings
  // For now, return default payment methods
  return ['stripe', 'crypto'];
}

// Calculate shipping cost (placeholder)
export async function calculateShipping(
  items: any[],
  shippingAddress: any,
  shippingMethod: string
): Promise<number> {
  // This would integrate with shipping providers like FedEx, UPS, USPS
  // For demo purposes, return a flat rate
  
  const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1) * item.quantity, 0);
  
  switch (shippingMethod) {
    case 'standard':
      return Math.max(5.99, totalWeight * 0.5);
    case 'express':
      return Math.max(12.99, totalWeight * 1.0);
    case 'overnight':
      return Math.max(24.99, totalWeight * 2.0);
    default:
      return 0;
  }
}

// Tax calculation (placeholder)
export async function calculateTax(
  items: any[],
  shippingAddress: any
): Promise<number> {
  // This would integrate with tax calculation services
  // For demo purposes, apply a simple tax rate
  
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.08; // 8% tax rate
  
  return subtotal * taxRate;
} 