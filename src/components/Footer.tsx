const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="nav-logo" style={{ marginBottom: '12px' }}>
            <img src="/logo.svg" alt="Alpha Energy" style={{ height: '32px' }} />
          </div>
          <p>Smart Home Services — powering homes and businesses with clean, reliable solar energy and advanced security systems.</p>
          <div className="social-links" style={{ marginTop: '20px' }}>
            <a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter" /></a>
            <a href="#" aria-label="WhatsApp"><i className="fab fa-whatsapp" /></a>
          </div>
        </div>

        <div>
          <h4>Quick Links</h4>
          <div className="footer-links">
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#portfolio">Portfolio</a>
            <a href="#contact">Contact</a>
          </div>
        </div>

        <div>
          <h4>Services</h4>
          <div className="footer-links">
            <a href="#services">Solar Installation</a>
            <a href="#services">CCTV & Security</a>
            <a href="#services">Smart Home</a>
            <a href="#services">Energy Audit</a>
          </div>
        </div>

        <div>
          <h4>Contact</h4>
          <div className="footer-links">
            <a href="tel:+234XXXXXXXXXX">+234 XXX XXX XXXX</a>
            <a href="mailto:info@alphaenergy.ng">info@alphaenergy.ng</a>
            <a href="#">Lagos, Nigeria</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Alpha Energy. All Rights Reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
