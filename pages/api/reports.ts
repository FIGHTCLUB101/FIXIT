import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/db';
import { sendMail } from '@/lib/mailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PUT') {
    // Status, department, or priority update
    const { id, status, department, priority } = req.body;
    if (!id || (!status && !department && !priority)) return res.status(400).json({ success: false, message: 'ID and at least one field (status, department, priority) required' });
    const client = await clientPromise;
    const db = client.db();
    const oid = typeof id === 'string' ? new (await import('mongodb')).ObjectId(id) : id;
    const updateFields: any = { updatedAt: new Date() };
    if (status) updateFields.status = status;
    if (department) updateFields.department = department;
    if (priority) updateFields.priority = priority;
    await db.collection('reports').updateOne(
      { _id: oid },
      { $set: updateFields }
    );
    // Fetch email to notify
    const report = await db.collection('reports').findOne({ _id: oid });
    if (report?.email && status) {
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
  const department = req.query.department as string | undefined;
  const priority = req.query.priority as string | undefined;
  const email = req.query.email as string | undefined;
  const filter: any = {};
  if (category && category !== 'All') {
    filter.category = category;
  }
  if (department && department !== 'All') {
    filter.department = department;
  }
  if (priority && priority !== 'All') {
    filter.priority = priority;
  }
  if (email) {
    filter.email = email;
  }
  const client = await clientPromise;
  const db = client.db();
  const total = await db.collection('reports').countDocuments(filter);
  // Update isOverdue for all fetched reports
  const now = new Date();
  const reports = await db.collection('reports')
    .find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(pageSize)
    .toArray();
  // Update isOverdue in DB if needed
  for (const report of reports) {
    if (report.slaDue && !report.isOverdue && now > new Date(report.slaDue) && report.status !== 'Resolved') {
      await db.collection('reports').updateOne({ _id: report._id }, { $set: { isOverdue: true } });
      report.isOverdue = true;
    }
  }
  res.json({ reports, total });
}
// reports.ts placeholder
