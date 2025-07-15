import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ success: false, message: 'Report ID required' });
  const client = await clientPromise;
  const db = client.db();
  const report = await db.collection('reports').findOne({ _id: typeof id === 'string' ? new (await import('mongodb')).ObjectId(id) : id });
  if (!report) return res.status(404).json({ success: false, message: 'Report not found' });
  res.json({ success: true, report });
}
