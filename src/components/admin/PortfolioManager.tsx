import { useState } from 'react';
import { usePortfolio, PortfolioItem } from '../../hooks/usePortfolio';
import PortfolioForm from './PortfolioForm';

export default function PortfolioManager() {
  const { items, loading, deleteItem } = usePortfolio();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  if (loading) {
    return <div style={{ color: 'var(--color-text-dim)' }}>Loading portfolio items...</div>;
  }

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        await deleteItem(id);
      } catch (err) {
        console.error('Failed to delete', err);
        alert('Failed to delete item.');
      }
    }
  };

  const handleAddNew = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  return (
    <div>
      <div className="admin-page-header">
        <h2>Portfolio Manager</h2>
        <button onClick={handleAddNew} className="btn btn-primary">
          <i className="fas fa-plus"></i> Add New Item
        </button>
      </div>

      {isFormOpen ? (
        <div className="glass" style={{ padding: '24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3>{editingItem ? 'Edit Item' : 'Create New Item'}</h3>
            <button onClick={() => setIsFormOpen(false)} className="btn btn-outline" style={{ padding: '8px 16px' }}>Cancel</button>
          </div>
          <PortfolioForm item={editingItem} onClose={() => setIsFormOpen(false)} />
        </div>
      ) : null}

      <div className="admin-grid">
        {items.map(item => (
          <div key={item.id} className="glass admin-card">
            <div className="admin-card-media">
              {item.mediaType === 'video' ? (
                <video src={item.mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
              ) : (
                <img src={item.mediaUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
              <div className="tag" style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--color-accent)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 'bold' }}>
                {item.tag}
              </div>
            </div>
            
            <div className="admin-card-content">
              <h4 style={{ marginBottom: '4px' }}>{item.title}</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-dim)' }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '6px' }}></i>
                {item.location}
              </p>
            </div>
            
            <div className="admin-card-actions">
              <button onClick={() => handleEdit(item)} className="btn btn-outline" style={{ flex: 1, padding: '8px' }}>Edit</button>
              <button onClick={() => item.id && handleDelete(item.id)} className="btn btn-outline" style={{ flex: 1, padding: '8px', borderColor: '#ff4444', color: '#ff4444' }}>Delete</button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <p style={{ color: 'var(--color-text-dim)' }}>No portfolio items found. Add some!</p>
        )}
      </div>
    </div>
  );
}
