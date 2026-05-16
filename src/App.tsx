import { useEffect, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'

import AdminLogin from './components/admin/AdminLogin'
import AdminLayout from './components/admin/AdminLayout'
import PortfolioManager from './components/admin/PortfolioManager'
import TestimonialManager from './components/admin/TestimonialManager'

function PublicApp() {
  const revealRefs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('active')
        })
      },
      { threshold: 0.1 }
    )

    revealRefs.current.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el)
    }
  }

  return (
    <>
      <Navbar />
      <main>
        <Hero addToRefs={addToRefs} />
        <Stats addToRefs={addToRefs} />
        <Services addToRefs={addToRefs} />
        <Portfolio addToRefs={addToRefs} />
        <Testimonials addToRefs={addToRefs} />
        <Contact addToRefs={addToRefs} />
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicApp />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<PortfolioManager />} />
        <Route path="testimonials" element={<TestimonialManager />} />
      </Route>
    </Routes>
  )
}

export default App
