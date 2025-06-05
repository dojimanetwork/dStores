import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { shop, code } = req.query;
  if (!shop || !code) return res.status(400).send('Missing required query parameters');

  try {
    const response = await axios.post(`https://${shop}/admin/oauth/access_token`, {
      client_id: process.env.DSTORES_API_KEY,
      client_secret: process.env.DSTORES_API_SECRET,
      code,
    });

    const accessToken = response.data.access_token;
    // Save this access token in session/database for later use

    res.status(200).json({ message: 'Dstores connected!', accessToken });
  } catch (err) {
    console.error(err);
    res.status(500).send('OAuth exchange failed');
  }
}
