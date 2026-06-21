import { useEffect, useRef, useState, useCallback } from 'react'
import { CONTACT, PROJECTS } from '../data'
import './Contact.css'

type Stamp = {
  id: number
  title: string
  color: string
  x: number
  y: number
  rot: number
  permanent: boolean
}

const PERM_POS = [
  { xp: 0.07, yp: 0.20, rot: -14 },
  { xp: 0.87, yp: 0.14, rot:  12 },
  { xp: 0.05, yp: 0.74, rot:   9 },
  { xp: 0.88, yp: 0.78, rot:  -8 },
  { xp: 0.48, yp: 0.88, rot:   4 },
]

let uid = 100

export default function Contact() {
  const sectionRef  = useRef<HTMLElement>(null)
  const permRef     = useRef<Stamp[]>([])           // permanent stamps never cleared
  const [permReady, setPermReady] = useState(false)
  const [hoverStamps, setHoverStamps] = useState<Stamp[]>([])
  const [copied, setCopied] = useState(false)
  const lastPos = useRef<{ x: number; y: number } | null>(null)

  /* ── Seed permanent stamps once section has real size ── */
  const seedPermanent = useCallback(() => {
    if (permRef.current.length > 0) return          // already seeded
    const el = sectionRef.current
    if (!el) return
    const { width: w, height: h } = el.getBoundingClientRect()
    if (w === 0 || h === 0) return
    permRef.current = PERM_POS.map((pos, i) => ({
      id: i,
      title: PROJECTS[i % PROJECTS.length].title,
      color: PROJECTS[i % PROJECTS.length].color,
      x: pos.xp * w,
      y: pos.yp * h,
      rot: pos.rot,
      permanent: true,
    }))
    setPermReady(true)
  }, [])

  useEffect(() => {
    seedPermanent()
    const t = setTimeout(seedPermanent, 400)
    // Also seed when section scrolls into view
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) seedPermanent() }, { threshold: 0.05 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => { clearTimeout(t); obs.disconnect() }
  }, [seedPermanent])

  /* ── Spawn hover stamps exactly at mouse cursor ── */
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (permRef.current.length === 0) seedPermanent()
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    if (lastPos.current) {
      const dx = x - lastPos.current.x, dy = y - lastPos.current.y
      if (dx * dx + dy * dy < 60 * 60) return
    }
    lastPos.current = { x, y }
    const id = uid++
    const p  = PROJECTS[id % PROJECTS.length]
    setHoverStamps(prev => [
      ...prev.slice(-28),
      { id, title: p.title, color: p.color, x, y, rot: (Math.random() - 0.5) * 28, permanent: false },
    ])
  }, [seedPermanent])

  /* ── Double-click: clear ONLY hover stamps; permanent stays ── */
  const clearHover = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setHoverStamps([])
    lastPos.current = null
  }, [])

  const copyEmail = () => {
    navigator.clipboard.writeText(CONTACT.email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const allStamps = [...permRef.current, ...hoverStamps]

  return (
    <section
      id="contact"
      className="contact-section"
      ref={sectionRef}
      onMouseMove={onMouseMove}
      onDoubleClick={clearHover}
    >
      {allStamps.map(s => (
        <div
          key={s.id}
          className={`contact-stamp ${s.permanent ? 'stamp-perm' : 'stamp-hover'}`}
          style={{ left: s.x, top: s.y, transform: `translate(-50%,-50%) rotate(${s.rot}deg)` }}
        >
          <div className="stamp-frame">
            <div className="stamp-img" style={{ background: s.color }}>
              <span className="stamp-initials">{s.title.slice(0,2).toUpperCase()}</span>
            </div>
            <div className="stamp-caption">
              <span className="stamp-name">{s.title}</span>
              <span className="stamp-year">2024</span>
            </div>
          </div>
          <div className="stamp-postmark">
            <svg viewBox="0 0 60 60" width="66" height="66">
              <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(28,25,23,0.15)" strokeWidth="1.5"/>
              <text x="30" y="27" textAnchor="middle" fontSize="7" fontFamily="DM Sans" fill="rgba(28,25,23,0.4)" fontWeight="500">YOGINI</text>
              <line x1="12" y1="31" x2="48" y2="31" stroke="rgba(28,25,23,0.2)" strokeWidth="1"/>
              <text x="30" y="40" textAnchor="middle" fontSize="6" fontFamily="DM Sans" fill="rgba(28,25,23,0.35)">ARCHIVE</text>
            </svg>
          </div>
        </div>
      ))}

      <div className="contact-inner" onClick={e => e.stopPropagation()}>
        <p className="section-eyebrow contact-eyebrow">Open to opportunities</p>
        <h2 className="contact-title">Let's build<br /><em>something.</em></h2>
        <p className="contact-sub">
          Looking for product design / product engineering roles.<br />
          Graduating 2027. Available for internships now.
        </p>
        <div className="contact-email-row">
          <button className="contact-email-btn" onClick={copyEmail} data-hover>
            <span>{CONTACT.email}</span>
            <span className="contact-copy-icon">{copied ? '✓ copied' : '⎘'}</span>
          </button>
        </div>
        <div className="contact-links">
          <a href={CONTACT.github} target="_blank" rel="noreferrer" className="contact-link" data-hover>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
          <a href={`mailto:${CONTACT.email}`} className="contact-link" data-hover>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            Email
          </a>
        </div>
      </div>
      <p className="contact-hint">Hover to stamp · Double-click to clear</p>
    </section>
  )
}
