import { useEffect, useRef, useState } from 'react'
import { PUBLICATIONS } from '../data'
import './Publications.css'

export default function Publications() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold: 0.04 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="publications" className="pub-section" ref={sectionRef}>
      <div className={`pub-header ${inView ? 'hdr-in' : ''}`}>
        <p className="section-eyebrow">Research</p>
        <h2 className="pub-title">Written &<br /><em>published.</em></h2>
        <p className="pub-sub">
          Peer-reviewed work on thermal imaging.<br />
          Published in Elsevier's Data in Brief at 20.
        </p>
      </div>

      <div className="pub-cards">
        {PUBLICATIONS.map((p, i) => (
          <StackCard key={p.id} pub={p} index={i} inView={inView} />
        ))}
      </div>
    </section>
  )
}

function StackCard({
  pub, index, inView,
}: {
  pub: typeof PUBLICATIONS[number]
  index: number
  inView: boolean
}) {
  const backColor = index === 0 ? '#C9B8E8' : '#A8D8B8'

  return (
    <div
      className={`pub-stack ${inView ? 'stack-in' : ''}`}
      style={{ '--delay': `${index * 150}ms` } as React.CSSProperties}
    >
      {/* Back card: peeks behind, content fades in on hover */}
      <div className="pub-back" style={{ background: backColor }}>
        <div className="pub-back-content">
          <span className="pub-back-label">read more</span>
          <a
            className="pub-back-cta"
            href={pub.doi}
            target="_blank"
            rel="noreferrer"
            onClick={e => e.stopPropagation()}
          >
            Open paper ↗
          </a>
        </div>
      </div>

      {/* Front card: rotates on Y-axis to expose back */}
      <a
        className="pub-front"
        href={pub.doi}
        target="_blank"
        rel="noreferrer"
        data-hover
      >
        <div className="pub-front-band" style={{ background: pub.color }} />

        <div className="pub-front-body">
          <div className="pub-front-top">
            <span className="pub-front-num">{String(index + 1).padStart(2, '0')}</span>
            <span className="pub-front-year">{pub.year}</span>
          </div>
          <h3 className="pub-front-title">{pub.title}</h3>
          <p className="pub-front-desc">{pub.description}</p>
          <span className="pub-front-journal">{pub.journal}</span>
        </div>

        {/* "Read more" slides up from inside the card on hover */}
        <div className="pub-ead-more">
          <div className="pub-read-more-inner">
            <div className="pub-rm-dot" />
            <span className="pub-rm-text">Read more ↗</span>
          </div>
        </div>
      </a>
    </div>
  )
}
