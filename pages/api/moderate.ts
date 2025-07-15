import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/db';
import moderateContent from '@/lib/aiModeration';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  const client = await clientPromise;
  const db = client.db();
  const reports = await db.collection('reports').find({ status: 'pending' }).toArray();

  for (const report of reports) {
    const result = await moderateContent(report.message, report.image);
    await db.collection('reports').updateOne(
      { _id: report._id },
      { $set: { status: result.status, aiConfidence: result.confidence } }
    );
  }

  res.json({ success: true });
}
// moderate.ts placeholder
