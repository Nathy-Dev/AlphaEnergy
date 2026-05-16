import { useState } from 'react';
import { useTestimonials, Testimonial } from '../../hooks/useTestimonials';
import TestimonialForm from './TestimonialForm';

export default function TestimonialManager() {
  const { testimonials, loading, deleteTestimonial } = useTestimonials();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);

  if (loading) {
    return <div style={{ color: 'var(--color-text-dim)' }}>Loading testimonials...</div>;
  }

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this testimonial?')) {
      try {
        await deleteTestimonial(id);
      } catch (err) {
        console.error('Failed to delete', err);
        alert('Failed to delete testimonial.');
      }
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`fas fa-star`}
        style={{ color: i < rating ? 'var(--color-accent)' : 'rgba(255,255,255,0.1)', fontSize: '0.85rem' }}
      />
    ));
  };

  return (
    <div>
      <div className="admin-page-header">
        <h2>Testimonial Manager</h2>
        <button onClick={handleAddNew} className="btn btn-primary">
          <i className="fas fa-plus"></i> Add Testimonial
        </button>
      </div>

      {isFormOpen && (
        <div className="glass" style={{ padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3>{editingItem ? 'Edit Testimonial' : 'Add New Testimonial'}</h3>
            <button onClick={() => setIsFormOpen(false)} className="btn btn-outline" style={{ padding: '8px 16px' }}>Cancel</button>
          </div>
          <TestimonialForm item={editingItem} onClose={() => { setIsFormOpen(false); setEditingItem(null); }} />
        </div>
      )}

      <div className="admin-grid">
        {testimonials.map(t => (
          <div key={t.id} className="glass admin-card">
            <div className="admin-card-content">
              <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                {renderStars(t.rating)}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--color-text-dim)', fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.6 }}>
                "{t.testimonial}"
              </p>
              <h4 style={{ fontSize: '1rem', marginBottom: '2px' }}>{t.name}</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--color-accent)' }}>{t.portfolio}</p>
            </div>
            <div className="admin-card-actions">
              <button onClick={() => handleEdit(t)} className="btn btn-outline" style={{ flex: 1, padding: '8px' }}>Edit</button>
              <button onClick={() => t.id && handleDelete(t.id)} className="btn btn-outline" style={{ flex: 1, padding: '8px', borderColor: '#ff4444', color: '#ff4444' }}>Delete</button>
            </div>
          </div>
        ))}
        {testimonials.length === 0 && (
          <p style={{ color: 'var(--color-text-dim)' }}>No testimonials yet. Add some!</p>
        )}
      </div>
    </div>
  );
}
