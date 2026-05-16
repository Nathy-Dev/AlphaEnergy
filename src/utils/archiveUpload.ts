import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const accessKeyId = import.meta.env.VITE_IA_ACCESS_KEY || '';
const secretAccessKey = import.meta.env.VITE_IA_SECRET_KEY || '';

// Initialize S3 Client pointing to Internet Archive
const s3Client = new S3Client({
  endpoint: 'https://s3.us.archive.org',
  region: 'us-east-1', // Region doesn't matter for IA, but SDK requires it
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  forcePathStyle: true,
});

/**
 * Uploads a file to Internet Archive
 * @param file The File object to upload
 * @param title A unique identifier/bucket name for the item
 * @param onProgress Optional callback for progress (AWS SDK v3 doesn't easily support native progress without Upload lib, but we can simulate or just wait)
 * @returns The public URL of the uploaded file
 */
export const uploadToInternetArchive = async (file: File, bucketName: string): Promise<string> => {
  if (!accessKeyId || !secretAccessKey) {
    throw new Error('Internet Archive S3 keys are not configured in environment variables.');
  }

  // Sanitize file name for URL
  const safeFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  
  // To upload to IA, the bucket name acts as the "identifier" of the IA item.
  // The identifier must be globally unique across all of Internet Archive.
  // We'll prefix it with 'alpha-energy-portfolio-' to help ensure uniqueness.
  const uniqueIdentifier = `alpha-energy-portfolio-${bucketName}-${Date.now()}`.toLowerCase().replace(/[^a-z0-9-]/g, '-');

  const command = new PutObjectCommand({
    Bucket: uniqueIdentifier,
    Key: safeFileName,
    Body: file,
    ContentType: file.type,
    // Internet archive requires specific headers to auto-create buckets
    Metadata: {
      'x-archive-meta-mediatype': file.type.startsWith('video/') ? 'movies' : 'image',
      'x-archive-meta-title': `Alpha Energy Portfolio - ${file.name}`,
    }
  });

  try {
    await s3Client.send(command);
    
    // Construct the public URL
    // Format: https://archive.org/download/{identifier}/{filename}
    return `https://archive.org/download/${uniqueIdentifier}/${safeFileName}`;
  } catch (error) {
    console.error('Error uploading to Internet Archive:', error);
    throw error;
  }
};
