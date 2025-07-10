import type { NextApiRequest, NextApiResponse } from 'next';
import { upload, uploadToCloudinary } from '../../../lib/upload';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    upload.single('signature')(req as any, res as any, async (err: any) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      const file = (req as any).file;
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      try {
        const result: any = await uploadToCloudinary(file.buffer, 'employee-signatures');
        
        return res.status(200).json({
          url: result.secure_url,
          public_id: result.public_id,
        });
      } catch (uploadError) {
        return res.status(500).json({ error: 'Failed to upload signature' });
      }
    });
  } catch (error) {
    return res.status(500).json({ error: 'Server error' });
  }
} 