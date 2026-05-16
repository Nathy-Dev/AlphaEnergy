const CLOUD_NAME = 'dswljcfjm';
const UPLOAD_PRESET = 'alpha_energy';

export async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);

  const resourceType = file.type.startsWith('video/') ? 'video' : 'image';
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  const response = await fetch(url, { method: 'POST', body: formData });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error?.message || 'Cloudinary upload failed');
  }

  const data = await response.json();
  return data.secure_url;
}
