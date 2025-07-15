import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/db';
import { sendMail } from '@/lib/mailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    // Status update
    const { id, status } = req.body;
    if (!id || !status) return res.status(400).json({ success: false, message: 'ID and status required' });
    const client = await clientPromise;
    const db = client.db();
    const oid = typeof id === 'string' ? new (await import('mongodb')).ObjectId(id) : id;
    await db.collection('reports').updateOne(
      { _id: oid },
      { $set: { status, updatedAt: new Date() } }
    );
    // Fetch email to notify
    const report = await db.collection('reports').findOne({ _id: oid });
    if (report?.email) {
      await sendMail({
        to: report.email,
        subject: 'Report Status Updated',
        text: `Your report status has been updated to: ${status}`,
        html: `<p>Your report status has been updated to: <b>${status}</b></p>`
      });
    }
    return res.json({ success: true });
  }

  // GET: paginated, filtered reports
  const page = parseInt((req.query.page as string) || '1', 10);
  const pageSize = parseInt((req.query.pageSize as string) || '5', 10);
  const skip = (page - 1) * pageSize;
  const category = req.query.category as string | undefined;
  const filter: any = {};
  if (category && category !== 'All') {
    filter.category = category;
  }
  const client = await clientPromise;
  const db = client.db();
  const total = await db.collection('reports').countDocuments(filter);
  const reports = await db.collection('reports')
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .toArray();
  res.json({ reports, total });
}
// reports.ts placeholder
