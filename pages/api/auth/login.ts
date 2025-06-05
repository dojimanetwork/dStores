import { NextApiRequest, NextApiResponse } from 'next';
import { loginUser } from '../../../lib/auth';
import { initializeDatabase } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure database is initialized
    await initializeDatabase();

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Login user
    const result = await loginUser(email, password);

    res.status(200).json({
      message: 'Login successful',
      user: result.user,
      token: result.token
    });
  } catch (error: any) {
    console.error('Login error:', error);
    
    if (error.message === 'Invalid credentials') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
} 