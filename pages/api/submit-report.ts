import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/db';
import { sendMail } from '@/lib/mailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // console.log('API /api/submit-report body:', req.body);
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { message, image, language, category, email } = req.body;

  if (!message || !image || !category || !email) {
    return res.status(400).json({ success: false, message: 'Message, image, category, and email are required.' });
  }

  try {
    const client = await clientPromise;
    const db = client.db();


    const { insertedId } = await db.collection('reports').insertOne({
      message,
      image,
      language: language || 'en',
      category,
      email,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Send email notification
    await sendMail({
      to: email,
      subject: 'Report Submitted',
      text: `Your report has been submitted. Your Report ID is: ${insertedId}`,
      html: `<p>Your report has been submitted.</p><p><b>Report ID:</b> ${insertedId}</p>`
    });

    return res.status(201).json({ success: true, id: insertedId });
  } catch (error) {
    console.error('Error submitting report:', error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
}