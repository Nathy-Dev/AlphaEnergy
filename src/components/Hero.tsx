interface Props {
  addToRefs: (el: HTMLElement | null) => void
}

const Hero = ({ addToRefs }: Props) => {
  return (
    <section id="home" className="hero">
      <div className="hero-bg" />

      <div className="hero-content reveal" ref={addToRefs}>
        <div className="hero-label">
          <i className="fas fa-solar-panel" />
          Smart Home Services
        </div>
        <h1 className="hero-title">
          SOLAR ENGINEERING<br />
          FOR THE <span>FUTURE</span>
        </h1>
        <p className="hero-subtitle">
          Nigeria's trusted solar installation, CCTV security & smart home automation experts — powering homes and businesses with clean, reliable energy.
        </p>
        <div className="hero-ctas">
          <a href="#services" className="btn btn-primary">
            <i className="fas fa-bolt" /> Our Services
          </a>
          <a href="#portfolio" className="btn btn-outline">
            <i className="fas fa-images" /> View Our Work
          </a>
        </div>
      </div>

      <div className="scroll-indicator">Scroll</div>
    </section>
  )
}

export default Hero
