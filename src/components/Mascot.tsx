import { useEffect, useRef, useState } from 'react'
import './Mascot.css'

const TRACK = [
  "hi! 👋",
  "enjoying the portfolio?",
  "check out the projects 👀",
  "pretty cool right?",
  "hey, that tickles 😄",
  "ok ok i feel that",
  "ow. gently please 😅",
  "you found my weak spot",
  "… i see you.",
  "quit it 😂",
]
const LAST      = TRACK.length - 1
const POST_QUIT = "alright, i won't stop you 🙃"

export default function Mascot() {
  const [bubble, setBubble]     = useState<string | null>('welcome! 🌸')
  const [trackIdx, setTrackIdx] = useState(0)
  const [dir, setDir]           = useState<'right' | 'left'>('right')
  const [x, setX]               = useState(80)
  const [walking, setWalking]   = useState(true)   // pauses only while clicked

  const rafRef      = useRef<number>(0)
  const xRef        = useRef(80)
  const dirRef      = useRef<'right' | 'left'>('right')
  const walkingRef  = useRef(true)
  const bubbleTimer = useRef<number>(0)
  const resumeTimer = useRef<number>(0)

  /* ── Auto-clear welcome after 2 s ── */
  useEffect(() => {
    const t = window.setTimeout(() => setBubble(null), 2000)
    return () => clearTimeout(t)
  }, [])

  /* ── Walk loop ── */
  useEffect(() => {
    const speed = 0.35
    const maxX  = () => window.innerWidth - 80
    const step  = () => {
      if (walkingRef.current) {
        if (dirRef.current === 'right') {
          xRef.current += speed
          if (xRef.current >= maxX()) dirRef.current = 'left'
        } else {
          xRef.current -= speed
          if (xRef.current <= 80) dirRef.current = 'right'
        }
        setX(Math.round(xRef.current))
        setDir(dirRef.current)
      }
      rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const poke = (e: React.MouseEvent) => {
    e.stopPropagation()

    // Pause walk briefly while clicked
    walkingRef.current = false
    setWalking(false)
    clearTimeout(resumeTimer.current)
    resumeTimer.current = window.setTimeout(() => {
      walkingRef.current = true
      setWalking(true)
    }, 800)

    // Show message
    const idx = trackIdx
    const msg = idx <= LAST ? TRACK[idx] : POST_QUIT
    setBubble(msg)
    // Only advance index while still in main track
    if (idx <= LAST) setTrackIdx(idx + 1)

    clearTimeout(bubbleTimer.current)
    bubbleTimer.current = window.setTimeout(() => setBubble(null), 1600)
  }

  return (
    <div className="mascot-wrap" style={{ left: x }} onClick={poke} data-hover>
      {bubble && (
        <div className={`mascot-bubble ${dir === 'right' ? 'right' : 'left'}`}>
          {bubble}
        </div>
      )}
      <svg
        className={`mascot-svg ${dir === 'left' ? 'flip' : ''} ${!walking ? 'mascot-still' : ''}`}
        width="56" height="56" viewBox="0 0 48 48"
        fill="none" xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="24" cy="28" rx="13" ry="14" fill="#C9B8A8" />
        <circle cx="24" cy="16" r="10" fill="#8B7355" />
        <circle cx="24" cy="16" r="7" fill="#C9B8A8" />
        <circle cx="21" cy="15" r="1.5" fill="#1C1917" />
        <circle cx="27" cy="15" r="1.5" fill="#1C1917" />
        <path d="M21.5 18.5 Q24 20.5 26.5 18.5" stroke="#1C1917" strokeWidth="1" strokeLinecap="round" fill="none"/>
        <rect x="18" y="40" width="5" height="6" rx="2.5" fill="#8B7355" className="mascot-leg-l" />
        <rect x="25" y="40" width="5" height="6" rx="2.5" fill="#8B7355" className="mascot-leg-r" />
        <circle cx="11" cy="18" r="2" fill="#E0DCF0" opacity="0.8" />
        <circle cx="9" cy="22" r="1.2" fill="#E0DCF0" opacity="0.5" />
        <circle cx="37" cy="18" r="1.5" fill="#D4E8D8" opacity="0.6" />
      </svg>
    </div>
  )
}
