import { useEffect, useRef, useState } from 'react'
import { SKILLS } from '../data'
import './Skills.css'

const CATEGORIES = ['Languages', 'Web', 'Hardware', 'ML', 'Cloud', 'Design']
const CAT_COLORS: Record<string, string> = {
  Languages: '#C9B8E8', Web: '#A8D8B8', Hardware: '#F0C8A0',
  ML: '#F0A8B8', Cloud: '#A8C8F0', Design: '#E8D8A0',
}
const CAT_ICONS: Record<string, string> = {
  Languages: '{ }', Web: '◈', Hardware: '⬡', ML: '◎', Cloud: '⌁', Design: '✦',
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const [phase, setPhase] = useState(0) // 0=hidden, 1=center, 2=lines, 3=cats, 4=chips
  const [chipPhase, setChipPhase] = useState<Record<string,number>>({}) // cat→revealed chip count

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) startAnimation() },
      { threshold: 0.04 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  function startAnimation() {
    // Center node
    setTimeout(() => setPhase(1), 100)
    // Lines from center to categories
    setTimeout(() => setPhase(2), 600)
    // Category nodes pop in
    setTimeout(() => setPhase(3), 1000)
    // Skill chips trickle in per category
    CATEGORIES.forEach((cat, ci) => {
      const catSkills = SKILLS.filter(s => s.category === cat)
      catSkills.forEach((_, si) => {
        setTimeout(() => {
          setChipPhase(prev => ({ ...prev, [cat]: (prev[cat] || 0) + 1 }))
        }, 1400 + ci * 80 + si * 60)
      })
    })
    setTimeout(() => setPhase(4), 1400)
  }

  const byCategory = CATEGORIES.map(cat => ({
    cat,
    skills: SKILLS.filter(s => s.category === cat),
  }))

  return (
    <section id="skills" className="skills-section" ref={sectionRef}>
      <div className={`skills-header ${phase >= 1 ? 'hdr-in' : ''}`}>
        <p className="section-eyebrow">Capabilities</p>
        <h2 className="skills-title">
          Different mediums.<br />
          <em>One experience.</em>
        </h2>
        <p className="skills-sub">The tools I reach for to make ideas real.</p>
      </div>

      <div className="skills-diagram">
        {/* ── Root node ── */}
        <div className={`skills-root ${phase >= 1 ? 'node-in' : ''}`}>
          <span className="skills-root-name">Yogini</span>
          <span className="skills-root-role">Full-Stack Builder</span>
        </div>

        {/* ── Trunk line downward from root ── */}
        <div className={`skills-trunk ${phase >= 2 ? 'line-in' : ''}`} />

        {/* ── Horizontal bar connecting all branches ── */}
        <div className={`skills-crossbar ${phase >= 2 ? 'line-in' : ''}`} />

        {/* ── Category columns with branch lines ── */}
        <div className="skills-cols">
          {byCategory.map(({ cat, skills }, ci) => {
            const revealed = chipPhase[cat] || 0
            return (
              <div key={cat} className="skills-col">
                {/* Branch line from crossbar down to category node */}
                <div
                  className={`skills-branch ${phase >= 2 ? 'line-in' : ''}`}
                  style={{
                    background: CAT_COLORS[cat],
                    transitionDelay: `${ci * 60}ms`,
                  }}
                />

                {/* Category node */}
                <div
                  className={`skills-cat-node ${phase >= 3 ? 'node-in' : ''}`}
                  style={{
                    '--cc': CAT_COLORS[cat],
                    transitionDelay: `${ci * 70}ms`,
                  } as React.CSSProperties}
                >
                  <span className="skills-cat-icon">{CAT_ICONS[cat]}</span>
                  <span className="skills-cat-name">{cat}</span>
                </div>

                {/* Sub-connector */}
                <div
                  className={`skills-sub-line ${revealed > 0 ? 'line-in' : ''}`}
                  style={{ background: CAT_COLORS[cat] }}
                />

                {/* Skill chips */}
                <div className="skills-chips">
                  {skills.map((s, si) => (
                    <div
                      key={s.label}
                      className={`skills-chip ${si < revealed ? 'chip-in' : ''}`}
                      style={{ '--cc': CAT_COLORS[cat] } as React.CSSProperties}
                    >
                      {s.label}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
