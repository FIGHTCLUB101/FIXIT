// import type { NextApiRequest, NextApiResponse } from 'next';
// import { v2 as cloudinary } from 'cloudinary';
// import { IncomingForm } from 'formidable';
// import fs from 'fs';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//   api_key: process.env.CLOUDINARY_API_KEY!,
//   api_secret: process.env.CLOUDINARY_API_SECRET!,
// });

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const form = new IncomingForm();
//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       res.status(500).json({ error: 'Error parsing file' });
//       return;
//     }
//     const file = Array.isArray(files.file) ? files.file[0] : files.file;
//     if (!file || !file.filepath) {
//       res.status(400).json({ error: 'No file uploaded.' });
//       return;
//     }
//     const result = await cloudinary.uploader.upload(file.filepath);
//     res.json({ url: result.secure_url });
//   });
// }
// // image-upload.ts placeholder



import type { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import { IncomingForm } from 'formidable';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const form = new IncomingForm({
      maxFileSize: 5 * 1024 * 1024, // 5MB limit
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parsing error:', err);
        return res.status(500).json({ error: 'Error parsing file' });
      }

      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      
      if (!file || !file.filepath) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }

      // Check file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.mimetype || '')) {
        return res.status(400).json({ error: 'Invalid file type. Only images are allowed.' });
      }

      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: 'civic-reports',
          resource_type: 'auto',
          transformation: [
            { width: 800, height: 600, crop: 'limit' },
            { quality: 'auto' }
          ]
        });

        // Clean up temporary file
        try {
          fs.unlinkSync(file.filepath);
        } catch (cleanupError) {
          console.error('Failed to clean up temporary file:', cleanupError);
        }

        return res.status(200).json({ 
          success: true,
          url: result.secure_url,
          public_id: result.public_id
        });

      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image' });
      }
    });

  } catch (error) {
    console.error('Image upload handler error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}