import { useState, useRef } from 'react';
import { usePortfolio, PortfolioItem } from '../../hooks/usePortfolio';
import { uploadToInternetArchive } from '../../utils/archiveUpload';

interface Props {
  item: PortfolioItem | null;
  onClose: () => void;
}

export default function PortfolioForm({ item, onClose }: Props) {
  const { addItem, updateItem } = usePortfolio();
  
  const [title, setTitle] = useState(item?.title || '');
  const [description, setDescription] = useState(item?.description || '');
  const [location, setLocation] = useState(item?.location || '');
  const [tag, setTag] = useState<PortfolioItem['tag']>(item?.tag || 'Residential');
  const [mediaType, setMediaType] = useState<PortfolioItem['mediaType']>(item?.mediaType || 'image');
  const [mediaUrl, setMediaUrl] = useState(item?.mediaUrl || '');
  
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let finalMediaUrl = mediaUrl;

      if (file) {
        // Generate a safe bucket name based on the title
        const bucketName = title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
        finalMediaUrl = await uploadToInternetArchive(file, bucketName);
        setMediaUrl(finalMediaUrl);
      } else if (!finalMediaUrl) {
        throw new Error('Please provide a media file or URL.');
      }

      const itemData: Omit<PortfolioItem, 'id' | 'createdAt'> = {
        title,
        description,
        location,
        tag,
        mediaType,
        mediaUrl: finalMediaUrl,
      };

      if (item?.id) {
        await updateItem(item.id, itemData);
      } else {
        await addItem(itemData);
      }
      
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save portfolio item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form" style={{ padding: 0 }}>
      {error && <div style={{ color: '#ff4444', marginBottom: '16px', fontSize: '0.9rem' }}>{error}</div>}
      
      <div className="form-row">
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Location</label>
          <input type="text" value={location} onChange={e => setLocation(e.target.value)} required />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Category Tag</label>
          <select value={tag} onChange={e => setTag(e.target.value as any)} required>
            <option value="Residential">Residential</option>
            <option value="Commercial">Commercial</option>
            <option value="Industrial">Industrial</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Media Type</label>
          <select value={mediaType} onChange={e => setMediaType(e.target.value as any)} required>
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Description</label>
        <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={4} />
      </div>

      <div className="glass" style={{ padding: '20px', border: '1px dashed var(--color-accent)' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Upload Media File (Internet Archive)</label>
        <input 
          type="file" 
          ref={fileInputRef}
          accept={mediaType === 'image' ? 'image/*' : 'video/*'}
          onChange={e => setFile(e.target.files?.[0] || null)}
          style={{ background: 'transparent', border: 'none', padding: '0', cursor: 'pointer' }}
        />
        {file && <p style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--color-accent-light)' }}>Selected: {file.name}</p>}
        
        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-dim)' }}>OR PROVIDE URL</span>
          <div style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
        </div>
        
        <input 
          type="url" 
          placeholder="https://..." 
          value={mediaUrl} 
          onChange={e => setMediaUrl(e.target.value)}
          style={{ marginTop: '16px' }}
          disabled={!!file}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading} style={{ alignSelf: 'flex-start' }}>
        {loading ? 'Saving & Uploading...' : (item ? 'Update Item' : 'Create Item')}
      </button>
    </form>
  );
}
