import { useState } from 'react'
import { usePortfolio, PortfolioItem } from '../hooks/usePortfolio'

interface Props {
  addToRefs: (el: HTMLElement | null) => void
}

const Portfolio = ({ addToRefs }: Props) => {
  const { items, loading } = usePortfolio();
  const [lightbox, setLightbox] = useState<PortfolioItem | null>(null)
  const [videoModal, setVideoModal] = useState<PortfolioItem | null>(null)
  const [filter, setFilter] = useState<'All' | 'Residential' | 'Commercial' | 'Industrial'>('All')

  const filteredItems = items.filter(item => filter === 'All' || item.tag === filter);

  const imageItems = filteredItems.filter(item => item.mediaType === 'image');
  const videoItems = filteredItems.filter(item => item.mediaType === 'video');

  return (
    <section id="portfolio" style={{ background: 'var(--color-surface)' }}>
      <div className="container">
        <div className="reveal" ref={addToRefs} style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="section-label">Our Work</div>
          <h2 className="section-title">Project <span>Portfolio</span></h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Real installations across homes and businesses — see the quality that sets us apart.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="reveal portfolio-filters" ref={addToRefs} style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {['All', 'Residential', 'Commercial', 'Industrial'].map(tag => (
            <button 
              key={tag}
              onClick={() => setFilter(tag as any)}
              className={`btn ${filter === tag ? 'btn-primary' : 'btn-outline'}`}
              style={{ padding: '8px 20px', fontSize: '0.85rem' }}
            >
              {tag}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-dim)' }}>Loading portfolio...</div>
        ) : (
          <div className="portfolio-grid">
            {imageItems.map((p, i) => (
              <div
                key={p.id || i}
                className={`portfolio-item reveal reveal-delay-${i % 4 + 1}`}
                ref={addToRefs}
                onClick={() => setLightbox(p)}
              >
                <img src={p.mediaUrl} alt={p.title} loading="lazy" />
                <div className="portfolio-overlay">
                  <div className="tag">{p.tag}</div>
                  <h4>{p.title}</h4>
                  <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginTop: '4px' }}>
                    <i className="fas fa-map-marker-alt" style={{ marginRight: '4px' }}></i>{p.location}
                  </p>
                </div>
              </div>
            ))}

            {videoItems.map((v, i) => (
              <div
                key={v.id || `vid-${i}`}
                className={`portfolio-video-item reveal reveal-delay-${i % 4 + 1}`}
                ref={addToRefs}
                onClick={() => setVideoModal(v)}
              >
                {/* Fallback to video frame if no thumbnail available */}
                <video src={v.mediaUrl} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
                <div className="play-btn"><i className="fas fa-play" style={{ marginLeft: '3px' }} /></div>
                <div className="portfolio-overlay" style={{ opacity: 1, background: 'linear-gradient(to top, rgba(6,13,13,0.9) 0%, transparent 80%)' }}>
                  <div className="tag">{v.tag}</div>
                  <h4>{v.title}</h4>
                </div>
              </div>
            ))}
            
            {filteredItems.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--color-text-dim)' }}>
                No projects found for this category.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Lightbox */}
      <div className={`lightbox ${lightbox ? 'active' : ''}`} onClick={() => setLightbox(null)}>
        <button className="lightbox-close" onClick={() => setLightbox(null)}>
          <i className="fas fa-times" />
        </button>
        {lightbox && (
          <>
            <img src={lightbox.mediaUrl} alt={lightbox.title} onClick={(e) => e.stopPropagation()} />
            <div className="lightbox-caption">
              <div className="tag">{lightbox.tag}</div>
              <h3>{lightbox.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', margin: '4px 0' }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '4px' }}></i>{lightbox.location}
              </p>
              <p style={{ fontSize: '0.95rem', maxWidth: '600px', margin: '8px auto 0' }}>{lightbox.description}</p>
            </div>
          </>
        )}
      </div>

      {/* Video Modal */}
      <div className={`video-modal ${videoModal ? 'active' : ''}`} onClick={() => {
        setVideoModal(null);
        // Pause video on close
        const vids = document.querySelectorAll('video');
        vids.forEach(v => v.pause());
      }}>
        <button className="lightbox-close" onClick={() => setVideoModal(null)}>
          <i className="fas fa-times" />
        </button>
        <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
          {videoModal && (
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <video src={videoModal.mediaUrl} controls autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)', color: '#fff' }}>
                <div className="tag" style={{ color: 'var(--color-accent)', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{videoModal.tag}</div>
                <h3 style={{ margin: '4px 0' }}>{videoModal.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)' }}><i className="fas fa-map-marker-alt"></i> {videoModal.location}</p>
                <p style={{ fontSize: '0.95rem', marginTop: '8px' }}>{videoModal.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Portfolio
