import type { NextApiRequest, NextApiResponse } from 'next';

const templates = [
  { id: 'basic', name: 'Basic Store', preview: '/templates/basic.jpg' },
  { id: 'modern', name: 'Modern Shop', preview: '/templates/modern.jpg' },
  { id: 'minimal', name: 'Minimal Design', preview: '/templates/minimal.jpg' },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    res.status(200).json(templates);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 