import { useState } from 'react'

interface Props {
  addToRefs: (el: HTMLElement | null) => void
}

const Contact = ({ addToRefs }: Props) => {
  const [status, setStatus] = useState('Send Message')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('Sent ✓')
    setTimeout(() => setStatus('Send Message'), 3000)
  }

  return (
    <section id="contact">
      <div className="container">
        <div className="reveal" ref={addToRefs} style={{ textAlign: 'center', marginBottom: '8px' }}>
          <div className="section-label">Contact Us</div>
          <h2 className="section-title">Ready to <span>Go Solar?</span></h2>
          <p className="section-sub" style={{ margin: '0 auto' }}>
            Get a free consultation and quote for your solar, security or smart home project.
          </p>
        </div>

        <div className="contact-grid">
          <div className="reveal" ref={addToRefs}>
            <div className="contact-info-list">
              <div className="contact-info-item">
                <div className="icon"><i className="fas fa-phone" /></div>
                <div>
                  <h4>Phone</h4>
                  <p>+234 XXX XXX XXXX</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="icon"><i className="fas fa-envelope" /></div>
                <div>
                  <h4>Email</h4>
                  <p>info@alphaenergy.ng</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="icon"><i className="fas fa-map-marker-alt" /></div>
                <div>
                  <h4>Office</h4>
                  <p>Lagos, Nigeria</p>
                </div>
              </div>
              <div className="contact-info-item">
                <div className="icon"><i className="fas fa-clock" /></div>
                <div>
                  <h4>Hours</h4>
                  <p>Mon – Sat: 8AM – 6PM</p>
                </div>
              </div>
            </div>
            <div className="social-links">
              <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
              <a href="#" aria-label="Twitter"><i className="fab fa-twitter" /></a>
              <a href="#" aria-label="WhatsApp"><i className="fab fa-whatsapp" /></a>
              <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f" /></a>
            </div>
          </div>

          <form className="glass contact-form reveal" ref={addToRefs} onSubmit={handleSubmit}>
            <div className="form-row">
              <input type="text" placeholder="Full Name" required />
              <input type="email" placeholder="Email Address" required />
            </div>
            <div className="form-row">
              <input type="tel" placeholder="Phone Number" />
              <select defaultValue="">
                <option value="" disabled>Select Service</option>
                <option>Solar Installation</option>
                <option>CCTV & Security</option>
                <option>Smart Home Automation</option>
                <option>Energy Audit</option>
                <option>Intercom Systems</option>
                <option>Maintenance</option>
              </select>
            </div>
            <textarea placeholder="Tell us about your project..." rows={5} required />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{status}</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
