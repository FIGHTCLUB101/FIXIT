// import type { NextApiRequest, NextApiResponse } from 'next';
// import clientPromise from '@/lib/db';
// import { sendMail } from '@/lib/mailer';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   // console.log('API /api/submit-report body:', req.body);
//   if (req.method !== 'POST') {
//     return res.status(405).json({ success: false, message: 'Method Not Allowed' });
//   }

//   const { message, image, language, category, email } = req.body;

//   if (!message || !image || !category || !email) {
//     return res.status(400).json({ success: false, message: 'Message, image, category, and email are required.' });
//   }

//   try {
//     const client = await clientPromise;
//     const db = client.db();


//     const { insertedId } = await db.collection('reports').insertOne({
//       message,
//       image,
//       language: language || 'en',
//       category,
//       email,
//       status: 'Pending',
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });

//     // Send email notification
//     await sendMail({
//       to: email,
//       subject: 'Report Submitted',
//       text: `Your report has been submitted. Your Report ID is: ${insertedId}`,
//       html: `<p>Your report has been submitted.</p><p><b>Report ID:</b> ${insertedId}</p>`
//     });

//     return res.status(201).json({ success: true, id: insertedId });
//   } catch (error) {
//     console.error('Error submitting report:', error);
//     return res.status(500).json({ success: false, message: 'Internal Server Error' });
//   }
// }


import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/db';
import { sendMail } from '@/lib/mailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { message, image, language, category, email, captchaToken } = req.body;

    // Validate required fields
    if (!message || !category || !email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Message, category, and email are required.' 
      });
    }

    // Validate email format
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide a valid email address.' 
      });
    }

    // In production, you would verify the captcha token here
    // For development, we'll skip this check
    if (process.env.NODE_ENV === 'production' && !captchaToken) {
      return res.status(400).json({ 
        success: false, 
        message: 'Captcha verification required.' 
      });
    }

    const client = await clientPromise;
    const db = client.db();

    // Insert the report
    const { insertedId } = await db.collection('reports').insertOne({
      message,
      image: image || '',
      language: language || 'en',
      category,
      email,
      status: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Send email notification (with error handling)
    try {
      await sendMail({
        to: email,
        subject: 'Report Submitted Successfully',
        text: `Your report has been submitted successfully. Your Report ID is: ${insertedId}`,
        html: `
          <h2>Report Submitted Successfully</h2>
          <p>Thank you for submitting your report. We will review it and get back to you.</p>
          <p><strong>Report ID:</strong> ${insertedId}</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Status:</strong> Pending</p>
          <p>You can track your report status using the Report ID above.</p>
        `
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the request if email fails
    }

    return res.status(201).json({ 
      success: true, 
      id: insertedId,
      message: 'Report submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting report:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal Server Error. Please try again later.' 
    });
  }
}
