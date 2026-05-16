/**
 * Gets a secure pre-signed upload URL from the Vercel backend
 * and uploads the file directly to Internet Archive.
 * 
 * @param file The File object to upload
 * @param title A unique identifier/bucket name for the item
 * @returns The public URL of the uploaded file
 */
export const uploadToInternetArchive = async (file: File, title: string): Promise<string> => {
  // 1. Get the secure presigned URL from our Vercel backend
  const bucketName = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  
  const response = await fetch('/api/get-upload-url', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      bucketName: bucketName
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to get upload URL from backend');
  }

  const { presignedUrl, publicUrl } = await response.json();

  // 2. Upload the file directly to Internet Archive using the presigned URL
  const uploadResponse = await fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      // Internet archive requires specific headers to auto-create buckets
      'x-archive-meta-mediatype': file.type.startsWith('video/') ? 'movies' : 'image',
      'x-archive-meta-title': `Alpha Energy Portfolio - ${file.name}`
    },
    body: file
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload file to Internet Archive');
  }

  // 3. Return the public URL
  return publicUrl;
};
