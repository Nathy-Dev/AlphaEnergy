import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { fileName, fileType, bucketName } = req.body;

  if (!fileName || !fileType || !bucketName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const accessKeyId = process.env.IA_ACCESS_KEY;
  const secretAccessKey = process.env.IA_SECRET_KEY;

  if (!accessKeyId || !secretAccessKey) {
    return res.status(500).json({ error: 'Server configuration error: Missing IA keys' });
  }

  try {
    const s3Client = new S3Client({
      endpoint: 'https://s3.us.archive.org',
      region: 'us-east-1',
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      forcePathStyle: true,
    });

    const uniqueIdentifier = `alpha-energy-portfolio-${bucketName}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const safeFileName = fileName.replace(/[^a-zA-Z0-9.\-_]/g, '_');

    const command = new PutObjectCommand({
      Bucket: uniqueIdentifier,
      Key: safeFileName,
      ContentType: fileType,
    });

    // Generate a presigned URL valid for 1 hour
    const presignedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    // Also return the final public URL where the file will be accessible after upload
    const publicUrl = `https://archive.org/download/${uniqueIdentifier}/${safeFileName}`;

    res.status(200).json({ presignedUrl, publicUrl });
  } catch (error: any) {
    console.error('Error generating presigned URL:', error);
    res.status(500).json({ error: 'Failed to generate upload URL', details: error.message });
  }
}
