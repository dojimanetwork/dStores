import { NextApiRequest, NextApiResponse } from 'next';
import { registerUser } from '../../../lib/auth';
import { initializeDatabase } from '../../../lib/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure database is initialized
    await initializeDatabase();

    const { email, password, name } = req.body;

    // Validation
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Register user
    const result = await registerUser(email, password, name);

    res.status(201).json({
      message: 'User registered successfully',
      user: result.user,
      token: result.token
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    if (error.message === 'User already exists') {
      return res.status(409).json({ error: 'User already exists' });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
} 