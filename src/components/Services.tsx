interface Props {
  addToRefs: (el: HTMLElement | null) => void
}

const services = [
  {
    icon: 'fa-solar-panel',
    title: 'Solar Installation',
    desc: 'Complete solar power systems — panels, inverters, and batteries for residential and commercial properties.'
  },
  {
    icon: 'fa-video',
    title: 'CCTV & Surveillance',
    desc: 'HD security camera systems with remote monitoring, motion detection, and 24/7 recording capabilities.'
  },
  {
    icon: 'fa-bolt',
    title: 'Energy Audit & Optimization',
    desc: 'Comprehensive power consumption analysis to reduce costs and maximize your solar investment.'
  },
  {
    icon: 'fa-house-signal',
    title: 'Smart Home Automation',
    desc: 'Intelligent lighting, climate control, and automated systems for modern connected living.'
  },
  {
    icon: 'fa-phone-volume',
    title: 'Intercom Systems',
    desc: 'Video intercom and access control solutions for secure residential and office buildings.'
  },
  {
    icon: 'fa-tools',
    title: 'Maintenance & Support',
    desc: 'Ongoing system maintenance, panel cleaning, battery checks and 24/7 technical support.'
  },
]

const Services = ({ addToRefs }: Props) => {
  return (
    <section id="services">
      <div className="container">
        <div className="reveal" ref={addToRefs} style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div className="section-label">What We Do</div>
          <h2 className="section-title">Engineered <span>Solutions</span></h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            From solar power systems to advanced security — we deliver reliable, future-proof installations.
          </p>
        </div>

        <div className="services-grid">
          {services.map((s, i) => (
            <div key={i} className={`service-card reveal reveal-delay-${i % 3 + 1}`} ref={addToRefs}>
              <div className="service-icon">
                <i className={`fas ${s.icon}`} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
