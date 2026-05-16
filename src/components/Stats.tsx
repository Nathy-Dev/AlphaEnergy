import { useEffect, useRef, useState } from 'react'

interface Props {
  addToRefs: (el: HTMLElement | null) => void
}

const stats = [
  { value: 150, suffix: '+', label: 'Solar Projects' },
  { value: 8, suffix: '+', label: 'Years Experience' },
  { value: 200, suffix: '+', label: 'Happy Clients' },
  { value: 24, suffix: '/7', label: 'Support Available' },
]

const AnimatedNumber = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const counted = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true
        const duration = 1800
        const start = performance.now()
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(eased * target))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.5 })

    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref} className="stat-number">{count}{suffix}</span>
}

const Stats = ({ addToRefs }: Props) => {
  return (
    <div className="stats-bar reveal" ref={addToRefs}>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div key={i} className="stat-item">
            <AnimatedNumber target={s.value} suffix={s.suffix} />
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Stats
