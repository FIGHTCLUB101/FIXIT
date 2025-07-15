import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const page = parseInt((req.query.page as string) || '1', 10);
  const pageSize = parseInt((req.query.pageSize as string) || '5', 10);
  const skip = (page - 1) * pageSize;
  const client = await clientPromise;
  const db = client.db();
  const total = await db.collection('reports').countDocuments();
  const reports = await db.collection('reports')
    .find({})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .toArray();
  res.json({ reports, total });
}
// reports.ts placeholder
