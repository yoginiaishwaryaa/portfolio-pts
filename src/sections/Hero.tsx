import { useEffect, useRef, useState } from 'react'
import './Hero.css'

const WORDS = ['builder.', 'designer.', 'engineer.', 'researcher.']

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const [phase, setPhase] = useState<'center' | 'moving' | 'done'>('center')
  const [scrollVisible, setScrollVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

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

  // Rotating headline word
  useEffect(() => {
    if (phase !== 'done') return
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setWordIdx(i => (i + 1) % WORDS.length); setVisible(true) }, 350)
    }, 2200)
    return () => clearInterval(id)
  }, [phase])

  const scrollToWork = () => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section id="hero" className="hero-section">

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
            Product<br />
            <span className={`hero-word ${visible ? 'in' : 'out'}`}>{WORDS[wordIdx]}</span>
          </h1>
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
    </section>
  )
}
