import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { message, image, captchaToken } = req.body;

  if (!message || !image) {
    return res.status(400).json({ success: false, message: 'Message and image are required.' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();

    const { insertedId } = await db.collection('reports').insertOne({
      message,
      image,
      createdAt: new Date(),
      status: 'pending',
    });

    return res.status(201).json({ success: true, id: insertedId });
  } catch (error) {
    console.error('Error submitting report:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}