import { NextApiRequest, NextApiResponse } from 'next';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN!;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID || ''; // Optional
const VERCEL_PROJECT_NAME = 'web3-store'; // Can be dynamic later

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { html, name } = req.body;

  try {
    const response = await fetch('https://api.vercel.com/v13/deployments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        files: [
          {
            file: 'index.html',
            data: html,
          },
        ],
        projectSettings: {
          framework: null,
        },
        target: 'production',
        ...(VERCEL_TEAM_ID && { teamId: VERCEL_TEAM_ID }),
      }),
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ url: `https://${data.alias?.[0] || data.url}` });
    } else {
      console.error('Vercel error:', data);
      res.status(500).json({ error: 'Deployment failed', details: data });
    }
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: 'Unexpected error', details: err });
  }
}
