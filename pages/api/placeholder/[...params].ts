import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { params } = req.query;
  
  // Extract dimensions and text from params
  let width = 300;
  let height = 200;
  let text = 'Placeholder';
  
  if (Array.isArray(params) && params.length > 0) {
    const dimensions = params[0].split('?')[0]; // Remove query params
    const [w, h] = dimensions.split('x').map(Number);
    if (w) width = w;
    if (h) height = h;
    
    // Extract text from query params
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const textParam = url.searchParams.get('text');
    if (textParam) {
      text = textParam.replace(/\+/g, ' ');
    }
  }
  
  // Create SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#e5e7eb"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16" fill="#6b7280" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
  res.status(200).send(svg);
} 