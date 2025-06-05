import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { domain, userEmail } = req.body;

  if (!domain || !userEmail) {
    return res.status(400).json({ error: 'Missing domain or user email' });
  }

  try {
    // NOTE: Replace with your actual Namecheap credentials
    const params = new URLSearchParams({
      ApiUser: process.env.NAMECHEAP_API_USER || '',
      ApiKey: process.env.NAMECHEAP_API_KEY || '',
      UserName: process.env.NAMECHEAP_USERNAME || '',
      Command: 'namecheap.domains.create',
      ClientIp: '0.0.0.0', // Must be whitelisted in Namecheap API panel
      DomainName: domain,
      RegistrantFirstName: 'Web3',
      RegistrantLastName: 'Builder',
      RegistrantEmailAddress: userEmail,
      RegistrantPhone: '+91.1234567890',
      RegistrantAddress1: '123 Dojima St',
      RegistrantCity: 'Metaverse',
      RegistrantStateProvince: 'NA',
      RegistrantPostalCode: '12345',
      RegistrantCountry: 'IN',
    });

    const response = await axios.get(`https://api.namecheap.com/xml.response?${params.toString()}`);

    res.status(200).json({ message: 'Domain registration attempted', xml: response.data });
  } catch (error) {
    console.error('Domain registration error:', error);
    res.status(500).json({ error: 'Failed to register domain' });
  }
}
