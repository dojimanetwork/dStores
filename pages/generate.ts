import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { brand, industry } = req.body;

  const prompt = `Generate HTML layout with branding for a Web3 store called '${brand}' in the '${industry}' industry. Include a hero section, product grid, and contact form.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: prompt }],
  });

  res.status(200).json({ result: completion.choices[0].message.content });
}
