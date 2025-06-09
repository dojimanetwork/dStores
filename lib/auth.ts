import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';
import { userOperations } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface AuthRequest extends NextApiRequest {
  user?: User;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN } as SignOptions
  );
}

// Verify JWT token
export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    return {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role
    };
  } catch (error) {
    return null;
  }
}

// Authentication middleware
export function requireAuth(handler: (req: AuthRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: AuthRequest, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' });
      }

      const token = authHeader.substring(7);
      const user = verifyToken(token);

      if (!user) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      // Verify user still exists in database
      const dbUser = await userOperations.findById(user.id);
      if (!dbUser) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = user;
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Authentication error' });
    }
  };
}

// Registration
export async function registerUser(email: string, password: string, name: string) {
  // Check if user already exists
  const existingUser = await userOperations.findByEmail(email);
  if (existingUser) {
    throw new Error('User already exists');
  }

  // Hash password and create user
  const passwordHash = await hashPassword(password);
  const user = await userOperations.create(email, passwordHash, name);

  // Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });

  return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
}

// Login
export async function loginUser(email: string, password: string) {
  // Find user
  const user = await userOperations.findByEmail(email);
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Generate token
  const token = generateToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  });

  return { user: { id: user.id, email: user.email, name: user.name, role: user.role }, token };
}

// Get user from token (for client-side)
export function getUserFromToken(token: string): User | null {
  return verifyToken(token);
}

// Check if user has permission
export function hasPermission(user: User, requiredRole: string): boolean {
  const roles = ['user', 'admin', 'super_admin'];
  const userRoleIndex = roles.indexOf(user.role);
  const requiredRoleIndex = roles.indexOf(requiredRole);

  return userRoleIndex >= requiredRoleIndex;
}

// Admin middleware
export function requireAdmin(handler: (req: AuthRequest, res: NextApiResponse) => Promise<void>) {
  return requireAuth(async (req: AuthRequest, res: NextApiResponse) => {
    if (!hasPermission(req.user!, 'admin')) {
      return res.status(403).json({ error: 'Admin access required' });
    }
    return handler(req, res);
  });
} 