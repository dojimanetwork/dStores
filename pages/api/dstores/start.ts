import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const shop = req.query.shop?.toString();
  if (!shop) return res.status(400).send('Missing shop parameter');

  const redirectUri = process.env.DSTORES_REDIRECT_URI;
  const apiKey = process.env.DSTORES_API_KEY;
  const scopes = 'read_products';

  const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${apiKey}&scope=${scopes}&redirect_uri=${redirectUri}`;

  res.redirect(authUrl);
}
