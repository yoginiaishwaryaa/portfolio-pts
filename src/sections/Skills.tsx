import { useEffect, useRef, useState } from 'react'
import './Skills.css'

type Skill = {
  name: string
  icon?: string   // simpleicons slug → cdn.simpleicons.org/{slug}/{hexColor}
  color: string   // hex WITHOUT #
  emoji?: string  // fallback when no Simple Icon or network error
}

const ROWS: {
  label: string       // large idle text
  hint: string        // small sub-text shown idle
  dir: 'left' | 'right'
  skills: Skill[]
}[] = [
  {
    label: 'Systems I Build With',
    hint: 'Languages · Frameworks · Databases',
    dir: 'left',
    skills: [
      { name: 'Python',      icon: 'python',      color: '3776AB' },
      { name: 'JavaScript',  icon: 'javascript',  color: 'F7DF1E', emoji: '⚡' },
      { name: 'TypeScript',  icon: 'typescript',  color: '3178C6' },
      { name: 'React',       icon: 'react',       color: '00D8FF' },
      { name: 'Node.js',     icon: 'nodedotjs',   color: '5FA04E' },
      { name: 'Flask',       icon: 'flask',       color: '000000' },
      { name: 'Java',        icon: 'java',        color: 'ED8B00' },
      { name: 'C++',         icon: 'cplusplus',   color: '00599C' },
      { name: 'HTML5',       icon: 'html5',       color: 'E34F26' },
      { name: 'CSS3',        icon: 'css3',        color: '1572B6' },
      { name: 'SQL',         icon: 'postgresql',  color: '4169E1' },
      { name: 'Git',         icon: 'git',         color: 'F05032' },
    ],
  },
  {
    label: 'Craft for the Experience',
    hint: 'Design · Thinking · Interaction',
    dir: 'right',
    skills: [
      { name: 'Figma',          icon: 'figma',   color: 'F24E1E' },
      { name: 'Notion',         icon: 'notion',  color: '000000' },
      { name: 'Canva',          icon: 'canva',   color: '00C4CC' },
      { name: 'User Research',  color: '8B5CF6', emoji: '🔍' },
      { name: 'Prototyping',    color: '3B82F6', emoji: '✦' },
      { name: 'System Design',  color: 'EC4899', emoji: '◈' },
      { name: 'UX Writing',     color: 'D97706', emoji: '✍' },
      { name: 'Accessibility',  color: '10B981', emoji: '♾' },
    ],
  },
  {
    label: 'Where Logic Meets Hardware',
    hint: 'ML · Embedded · Cloud · DevOps',
    dir: 'left',
    skills: [
      { name: 'TensorFlow',     icon: 'tensorflow',          color: 'FF6F00' },
      { name: 'PyTorch',        icon: 'pytorch',             color: 'EE4C2C' },
      { name: 'OpenCV',         icon: 'opencv',              color: '5C3EE8' },
      { name: 'NumPy',          icon: 'numpy',               color: '4DABCF' },
      { name: 'Arduino',        icon: 'arduino',             color: '00878A' },
      { name: 'Raspberry Pi',   icon: 'raspberrypi',         color: 'A22846' },
      { name: 'Azure',          icon: 'microsoftazure',      color: '0078D4' },
      { name: 'Docker',         icon: 'docker',              color: '2496ED' },
      { name: 'GitHub Actions', icon: 'githubactions',       color: '2088FF' },
      { name: 'AWS',            icon: 'amazonwebservices',   color: 'FF9900' },
      { name: 'GCP',            icon: 'googlecloud',         color: '4285F4' },
      { name: 'STM32',          color: 'D97706', emoji: '⬡' },
      { name: 'MediaPipe',      color: '10B981', emoji: '◎' },
    ],
  },
]

/* ── One pill ── */
function Pill({ skill }: { skill: Skill }) {
  const [imgError, setImgError] = useState(false)
  const iconUrl = skill.icon && !imgError
    ? `https://cdn.simpleicons.org/${skill.icon}/${skill.color}`
    : null

  return (
    <div className="mq-pill" style={{ '--pill-color': `#${skill.color}` } as React.CSSProperties}>
      <span className="mq-pill-icon">
        {iconUrl ? (
          <img
            src={iconUrl}
            alt={skill.name}
            width={18}
            height={18}
            loading="lazy"
            draggable={false}
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="mq-pill-emoji">{skill.emoji || '✦'}</span>
        )}
      </span>
      <span className="mq-pill-name">{skill.name}</span>
    </div>
  )
}

/* ── One row: idle shows label, hover reveals marquee ── */
function MarqueeRow({
  label, hint, skills, dir, index,
}: {
  label: string
  hint: string
  skills: Skill[]
  dir: 'left' | 'right'
  index: number
}) {
  /* Triple items for seamless loop */
  const track = [...skills, ...skills, ...skills]
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`mq-row ${hovered ? 'mq-row--active' : ''}`}
      style={{ '--row-index': index } as React.CSSProperties}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* ── Idle label layer ── */}
      <div className="mq-label-layer" aria-hidden={hovered}>
        <div className="mq-label-inner">
          <span className="mq-label-text">{label}</span>
          <span className="mq-label-hint">{hint}</span>
        </div>
      </div>

      {/* ── Scrolling marquee layer ── */}
      <div className="mq-window" aria-hidden={!hovered}>
        <div className="mq-fade mq-fade-left" />
        <div className="mq-fade mq-fade-right" />
        <div className={`mq-track ${dir === 'right' ? 'mq-track--rtl' : ''}`}>
          {track.map((s, i) => (
            <Pill key={`${s.name}-${i}`} skill={s} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Main section ── */
export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="skills"
      className={`skills-section ${visible ? 'sk-revealed' : ''}`}
      ref={sectionRef}
    >
      <div className="skills-inner">
        {/* ── Header (Left-aligned alone) ── */}
        <div className={`skills-header ${visible ? 'hdr-in' : ''}`}>
          <p className="section-eyebrow">Capabilities</p>
          <h2 className="skills-title">
            Different mediums.<br />
            <em>One experience.</em>
          </h2>
          <p className="skills-sub">The tools I reach for to make ideas real.</p>
        </div>

        {/* ── Rows (Centered actual skills marquee) ── */}
        <div className={`mq-rows ${visible ? 'mq-rows-in' : ''}`}>
          {ROWS.map((row, i) => (
            <MarqueeRow
              key={row.label}
              label={row.label}
              hint={row.hint}
              skills={row.skills}
              dir={row.dir}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
