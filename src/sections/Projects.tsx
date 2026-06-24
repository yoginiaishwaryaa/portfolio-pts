import { useEffect, useRef, useState } from 'react'
import { PROJECTS } from '../data'
import './Projects.css'

type Project = typeof PROJECTS[number]

const PUBLIC_BASE = import.meta.env.BASE_URL || '/'

type MediaItem = { type: 'video' | 'image'; src: string }
const PROJECT_MEDIA: Record<string, MediaItem | null> = {
  'script-match':     { type: 'image', src: `${PUBLIC_BASE}script_match.jpg` },
  'handheld-console': { type: 'video', src: `${PUBLIC_BASE}handheld_game_console.mp4` },
  'ecg-detection':    { type: 'image', src: `${PUBLIC_BASE}archi_CI.png` },
  'multiplayer-card': { type: 'video', src: `${PUBLIC_BASE}multiplayer_card_clash.mp4` },
  'study-buddy':      { type: 'video', src: `${PUBLIC_BASE}study_buddy.mp4` },
  'thermal-fruit':    { type: 'image', src: `${PUBLIC_BASE}thermal_fruit_image_dataset.jpg` },
  'handes-control':   { type: 'video', src: `${PUBLIC_BASE}handes_control.mp4` },
  'shelly':           { type: 'video', src: `${PUBLIC_BASE}shelly.mp4` },
  'Secure-Quiz-platform': { type: 'image', src: `${PUBLIC_BASE}secure_quiz.jpg` },
}

function MediaPanel({ project, active }: { project: Project; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const media = PROJECT_MEDIA[project.id]

  // Auto-play when card becomes active
  useEffect(() => {
    const v = videoRef.current
    if (!v || !media || media.type !== 'video') return
    if (active) { v.currentTime = 0; v.play().catch(() => {}) }
    else v.pause()
  }, [active, media])

  return (
    <div className="fan-media" style={{ '--proj-color': project.color } as React.CSSProperties}>
      {media ? (
        media.type === 'video' ? (
          <video
            ref={videoRef}
            className="fan-video"
            src={media.src}
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
          />
        ) : (
          <img
            className="fan-image"
            src={media.src}
            alt={`${project.title} preview`}
          />
        )
      ) : (
        /* Gradient placeholder — shows project color with subtle noise */
        <div className="fan-placeholder">
          <div className="fan-placeholder-inner" style={{ background: project.color }} />
          <div className="fan-placeholder-label">
            <span>{project.title}</span>
            <span className="fan-placeholder-sub">{project.year}</span>
          </div>
        </div>
      )}
      {/* Gradient fade toward right — merges into card background */}
      <div className="fan-media-fade" />
    </div>
  )
}

function Modal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', esc)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', esc); document.body.style.overflow = '' }
  }, [onClose])
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-img-wrap">
          <div className="proj-img-block" style={{ background: project.color }}>
            <span style={{ fontSize: 72 }}>{project.emoji}</span>
          </div>
        </div>
        <div className="modal-body">
          <div className="modal-header-row">
            <h2 className="modal-title">{project.title}</h2>
            <span className="modal-year">{project.year}</span>
          </div>
          <div className="modal-tags">
            {project.tags.map(t => <span key={t} className="modal-tag">{t}</span>)}
          </div>
          <p className="modal-desc">{project.description}</p>
          <p className="modal-tech">{project.tech}</p>
          <a className="modal-link" href={project.link} target="_blank" rel="noreferrer">View on GitHub ↗</a>
        </div>
      </div>
    </div>
  )
}

export default function Projects() {
  const sectionRef  = useRef<HTMLElement>(null)
  const [selected, setSelected]       = useState<Project | null>(null)
  const [introVisible, setIntroVisible] = useState(false)
  const [activeIdx, setActiveIdx]     = useState(0)
  const [hovered, setHovered]         = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setIntroVisible(true) },
      { threshold: 0.03 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  // Scroll → activeIdx
  useEffect(() => {
    const onScroll = () => {
      const s = sectionRef.current; if (!s) return
      const rect = s.getBoundingClientRect()
      const scrolled  = -rect.top
      const total     = rect.height - window.innerHeight
      if (total <= 0) return
      const progress  = Math.max(0, Math.min(0.999, scrolled / total))
      setActiveIdx(Math.min(Math.floor(progress * PROJECTS.length), PROJECTS.length - 1))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const active = PROJECTS[activeIdx]

  return (
    <>
      <section id="work" className="projects-section" ref={sectionRef}>
        <div className="projects-sticky">

          {/* ── Header bar ── */}
          <div className={`projects-header ${introVisible ? 'header-in' : ''}`}>
            <div className="projects-header-left">
              <p className="section-eyebrow">Selected Work</p>
              <h2 className="projects-title">Things I've <em>built.</em></h2>
            </div>
            <div className="projects-header-right">
              <p className="projects-subtitle">Embedded hardware · ML pipelines · Full-stack apps · Research</p>
              <div className="projects-dots">
                {PROJECTS.map((_, i) => (
                  <div key={i} className={`projects-dot ${i === activeIdx ? 'active' : ''}`} />
                ))}
              </div>
            </div>
          </div>

          {/* ── Fan carousel ── */}
          <div className="projects-fan-wrap">
            <div className="proj-fade-left"  />
            <div className="proj-fade-right" />

            <div className="projects-fan">
              {PROJECTS.map((p, i) => {
                const offset = i - activeIdx
                const abs    = Math.abs(offset)
                const side   = Math.sign(offset)
                const vis    = abs <= 3

                const tx      = side * abs * 210
                const scale   = Math.max(0.74, 1 - abs * 0.09)
                const rot     = side * abs * 5
                const opacity = abs === 0 ? 1 : abs === 1 ? 0.72 : abs === 2 ? 0.45 : 0.22
                const isActive = offset === 0

                return (
                  <div
                    key={p.id}
                    className={`proj-fan-card${isActive ? ' fan-active' : ''}${!vis ? ' fan-hidden' : ''}`}
                    style={{
                      transform: `translateX(${tx}px) rotate(${rot}deg) scale(${scale})`,
                      opacity,
                      zIndex: 20 - abs,
                      transition: 'transform 0.55s cubic-bezier(0.34,1.08,0.64,1), opacity 0.45s ease, box-shadow 0.3s ease',
                    }}
                    onMouseEnter={() => isActive && setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    data-hover={isActive ? '' : undefined}
                  >
                    {/* Left: media panel */}
                    <MediaPanel project={p} active={isActive} />

                    {/* Right: text content (always shown inline, no modal needed) */}
                    <div className="fan-card-body">
                      <div className="fan-card-meta">
                        <span className="fan-card-year">{p.year}</span>
                        <div className="fan-card-tags-row">
                          {p.tags.map(t => <span key={t} className="fan-tag">{t}</span>)}
                        </div>
                      </div>

                      <h3 className="fan-card-title">{p.title}</h3>
                      <p className="fan-card-desc">{p.description}</p>
                      <div className="fan-card-tech">{p.tech}</div>

                      {/* "View project" shown on hover of active card */}
                      {isActive && (
                        <div className={`fan-hover-cta ${hovered ? 'cta-visible' : ''}`}>
                          <a
                            href={p.link}
                            target="_blank"
                            rel="noreferrer"
                            className="fan-cta-btn"
                            onClick={e => e.stopPropagation()}
                          >
                            View project ↗
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </section>

      {selected && <Modal project={selected} onClose={() => setSelected(null)} />}
    </>
  )
}
