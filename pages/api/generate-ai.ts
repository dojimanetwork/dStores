import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { preferences } = req.body;
    
    // Add your AI generation logic here
    // This is a placeholder response
    const generatedWebsite = {
      id: 'ai-generated',
      name: 'AI Generated Store',
      content: {
        // Add generated content here
      },
    };

    res.status(200).json(generatedWebsite);
  } catch (error) {
    res.status(500).json({ message: 'Error generating website' });
  }
} 