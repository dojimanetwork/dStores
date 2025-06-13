import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { limit = 20, category = 'electronics' } = req.query;
        const apiUrl = `https://web3fy-go.dojima.network/api/products?trending=amazon&category=${category}&limit=${limit}&force=false`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        // Return only the products array in a flat structure
        res.status(200).json({ products: data.data?.products || [] });
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Failed to fetch Amazon products' });
    }
} 