import { useState } from 'react';
import { useTestimonials, Testimonial } from '../../hooks/useTestimonials';

interface Props {
  item: Testimonial | null;
  onClose: () => void;
}

export default function TestimonialForm({ item, onClose }: Props) {
  const { addTestimonial, updateTestimonial } = useTestimonials();

  const [name, setName] = useState(item?.name || '');
  const [portfolio, setPortfolio] = useState(item?.portfolio || '');
  const [testimonial, setTestimonial] = useState(item?.testimonial || '');
  const [rating, setRating] = useState(item?.rating || 5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data: Omit<Testimonial, 'id' | 'createdAt'> = {
        name,
        portfolio,
        testimonial,
        rating,
      };

      if (item?.id) {
        await updateTestimonial(item.id, data);
      } else {
        await addTestimonial(data);
      }

      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save testimonial.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form" style={{ padding: 0, gap: '16px' }}>
      {error && <div style={{ color: '#ff4444', fontSize: '0.9rem' }}>{error}</div>}

      <div className="form-row">
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="John Doe" required />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Portfolio / Title</label>
          <input type="text" value={portfolio} onChange={e => setPortfolio(e.target.value)} placeholder="CEO, NathyDev" required />
        </div>
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Testimonial</label>
        <textarea value={testimonial} onChange={e => setTestimonial(e.target.value)} placeholder="What did the client say?" required rows={4} />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>Star Rating</label>
        <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1.5rem',
                color: star <= rating ? 'var(--color-accent)' : 'rgba(255,255,255,0.15)',
                transition: 'color 0.2s',
                padding: '4px',
              }}
            >
              <i className="fas fa-star" />
            </button>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', maxWidth: '200px' }}>
        {loading ? 'Saving...' : (item ? 'Update' : 'Add Testimonial')}
      </button>
    </form>
  );
}
