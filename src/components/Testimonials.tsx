import { useState, useEffect, useRef } from 'react'
import { useTestimonials, Testimonial } from '../hooks/useTestimonials'

interface Props {
  addToRefs: (el: HTMLElement | null) => void
}

const Testimonials = ({ addToRefs }: Props) => {
  const { testimonials, loading } = useTestimonials();
  const [displayItems, setDisplayItems] = useState<Testimonial[]>([]);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const animationRef = useRef<number>();
  const isHovered = useRef(false);

  useEffect(() => {
    if (testimonials.length > 0) {
      setDisplayItems(testimonials);
    }
  }, [testimonials]);

  useEffect(() => {
    if (displayItems.length < 2) return;

    const cardWidth = 400; // 380px width + 20px margin
    
    const animate = () => {
      if (!isHovered.current) {
        offsetRef.current += 0.8; // Speed

        if (offsetRef.current >= cardWidth) {
          offsetRef.current = 0;
          setDisplayItems(prev => {
            const newItems = [...prev];
            const lastItem = newItems.pop();
            if (lastItem) newItems.unshift(lastItem);
            return newItems;
          });
        }

        if (trackRef.current) {
          trackRef.current.style.transform = `translateX(${offsetRef.current - cardWidth}px)`;
        }
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [displayItems.length]);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className="fas fa-star"
        style={{ color: i < rating ? 'var(--color-accent)' : 'rgba(255,255,255,0.08)', fontSize: '0.8rem' }}
      />
    ));
  };

  return (
    <section id="testimonials" style={{ overflow: 'hidden' }}>
      <div className="container">
        <div className="reveal" ref={addToRefs} style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div className="section-label">Testimonials</div>
          <h2 className="section-title">What Our <span>Clients</span> Say</h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Hear from homeowners and businesses who trust Alpha Energy with their solar and smart home solutions.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-dim)' }}>Loading testimonials...</div>
        ) : displayItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-dim)' }}>No testimonials yet.</div>
        ) : (
          <div 
            className="testimonials-marquee-container reveal" 
            ref={addToRefs}
            onMouseEnter={() => isHovered.current = true}
            onMouseLeave={() => isHovered.current = false}
          >
            <div 
              className="testimonials-marquee-track" 
              ref={trackRef}
              style={{ transform: `translateX(-400px)` }}
            >
              {displayItems.map((t, i) => (
                <div key={t.id || i} className="testimonial-card glass">
                  <div className="testimonial-quote-icon">
                    <i className="fas fa-quote-left" />
                  </div>
                  <div style={{ display: 'flex', gap: '3px', marginBottom: '16px' }}>
                    {renderStars(t.rating)}
                  </div>
                  <p className="testimonial-text">"{t.testimonial}"</p>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">
                      {t.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="testimonial-name">{t.name}</h4>
                      <p className="testimonial-role">{t.portfolio}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Testimonials
