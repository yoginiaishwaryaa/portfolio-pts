import { useEffect, useRef, useState } from 'react'
import './Hero.css'

const STEPS = [
  { prefix: 'Software', role: 'engineer.' },
  { prefix: 'Product', role: 'engineer.' },
  { prefix: 'Product', role: 'designer.' },
  { prefix: 'Product', role: 'engineer.' },
]

export default function Hero() {
  const [stepIdx, setStepIdx] = useState(0)
  const [prefixVisible, setPrefixVisible] = useState(true)
  const [roleVisible, setRoleVisible] = useState(true)
  const [phase, setPhase] = useState<'center' | 'moving' | 'done'>('center')
  const [scrollVisible, setScrollVisible] = useState(false)

  const sectionRef = useRef<HTMLElement>(null)
  const stepRef = useRef(0)

  // Name intro animation: center → logo position → rest fades in
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('moving'), 1400)
    const t2 = setTimeout(() => {
      setPhase('done')
      window.dispatchEvent(new CustomEvent('hero-ready'))
      setScrollVisible(true)
    }, 2200)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Hide scroll indicator when hero scrolls out of view
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const isInView = rect.bottom > 0
      setScrollVisible(phase === 'done' && isInView)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [phase])

  // Precision single-word rotating loop:
  // Step 0: Software Engineer -> (Software transitions to Product, Engineer stays)
  // Step 1: Product Engineer -> (Product stays, Engineer transitions to Designer)
  // Step 2: Product Designer -> (Product stays, Designer transitions to Engineer)
  // Step 3: Product Engineer -> (Product transitions to Software, Engineer stays)
  useEffect(() => {
    if (phase !== 'done') return

    const interval = setInterval(() => {
      const currIdx = stepRef.current
      const nextIdx = (currIdx + 1) % STEPS.length

      const currStep = STEPS[currIdx]
      const nextStep = STEPS[nextIdx]

      const prefixChanged = currStep.prefix !== nextStep.prefix
      const roleChanged = currStep.role !== nextStep.role

      if (prefixChanged) setPrefixVisible(false)
      if (roleChanged) setRoleVisible(false)

      setTimeout(() => {
        stepRef.current = nextIdx
        setStepIdx(nextIdx)
        if (prefixChanged) setPrefixVisible(true)
        if (roleChanged) setRoleVisible(true)
      }, 350)
    }, 2400)

    return () => clearInterval(interval)
  }, [phase])

  const scrollToWork = () => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" className="hero-section" ref={sectionRef}>

      {/* Decorative grid lines */}
      <div className="hero-grid-lines">
        <div className="hero-grid-v" style={{ left: '50%' }} />
        <div className="hero-grid-h" style={{ top: '60%' }} />
      </div>

      {/* NAME — starts centered, flies to logo position */}
      <div className={`hero-name-intro phase-${phase}`}>Yogini.</div>

      {/* Everything else fades in after animation */}
      <div className={`hero-content ${phase === 'done' ? 'visible' : ''}`}>
        {/* Left copy */}
        <div className="hero-copy">
          <p className="hero-eyebrow">Yogini Aishwaryaa P T S</p>
          <h1 className="hero-headline">
            <span className={`hero-prefix ${prefixVisible ? 'in' : 'out'}`}>{STEPS[stepIdx].prefix}</span>
            <span className={`hero-word ${roleVisible ? 'in' : 'out'}`}>{STEPS[stepIdx].role}</span>
          </h1>
          <br />
          <p className="hero-sub">
            CS undergrad at Amrita University · Turning ideas into real-world products through embedded systems, AI/ML, software engineering, and thoughtful product experiences.
          </p>
          <div className="hero-actions">
            <button className="hero-btn-primary" onClick={scrollToWork}>
              View work
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <a className="hero-btn-secondary" href="mailto:yoginianithakumar@gmail.com">Say hello ↗</a>
          </div>
        </div>

        {/* Right photo */}
        <div className="hero-photo-wrap">
          <div className="hero-photo-frame">
            <img
              src={new URL('../assets/yogini2.png', import.meta.url).href}
              alt="Yogini Aishwaryaa"
              className="hero-photo-img"
            />
          </div>
          {/* Venn diagram circles — 3 circles in triangle arrangement */}
          <div className="venn-ring venn-ring-left" />
          <div className="venn-ring venn-ring-right" />
          <div className="venn-ring venn-ring-top" />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className={`hero-scroll ${scrollVisible ? 'visible' : ''}`} onClick={scrollToWork}>
        <div className="hero-scroll-line" />
        <span>scroll</span>
      </div>
    </section >
  )
}
