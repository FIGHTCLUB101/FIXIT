import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/db';
import moderateContent from '@/lib/aiModeration';
import twilio from 'twilio';
import { ObjectId } from 'mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { Body, From, MediaUrl0 } = req.body;
  const phone = From;
  const message = Body;
  const image = MediaUrl0 || '';

  try {
    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection('reports').insertOne({
      message,
      image,
      phone,
      createdAt: new Date(),
      status: 'pending',
    });
    const insertedId = result.insertedId;

    // AI moderation
    const moderationResult = await moderateContent(message, image);
    await db.collection('reports').updateOne(
      { _id: insertedId },
      { $set: { status: moderationResult.status, aiConfidence: moderationResult.confidence } }
    );

    // Twilio auto-response
    const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: phone,
      body: 'Thanks for your report. We have received your message and it will be reviewed shortly.',
    });

    res.status(200).json({ success: true, id: insertedId });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, error: 'Failed to process report.' });
  }
}
// twilio-webhook.ts placeholder
