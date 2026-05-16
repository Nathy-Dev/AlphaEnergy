import { useState, useEffect } from 'react'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-logo">
        <img src="/logo.svg" alt="Alpha Energy" />
      </div>

      <div className={`hamburger ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
        <span /><span /><span />
      </div>

      <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <li><a href="#home" onClick={close}>Home</a></li>
        <li><a href="#services" onClick={close}>Services</a></li>
        <li><a href="#portfolio" onClick={close}>Portfolio</a></li>
        <li><a href="#contact" onClick={close} className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '0.85rem' }}>Get a Quote</a></li>
      </ul>
    </nav>
  )
}

export default Navbar
