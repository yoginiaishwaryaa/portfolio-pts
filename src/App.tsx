import { useEffect, useRef } from 'react'
import Cursor from './components/Cursor'
import Mascot from './components/Mascot'
import Nav from './components/Nav'
import Hero from './sections/Hero'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Publications from './sections/Publications'
import Contact from './sections/Contact'

/* ── Ambient blob (skills section only) ── */
function GlobalBlob() {
  const blobRef = useRef<HTMLDivElement>(null)
  const posRef  = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 })
  const curRef  = useRef({ ...posRef.current })

  useEffect(() => {
    let raf: number
    const onMove = (e: MouseEvent) => { posRef.current = { x: e.clientX, y: e.clientY } }
    const tick   = () => {
      curRef.current.x += (posRef.current.x - curRef.current.x) * 0.04
      curRef.current.y += (posRef.current.y - curRef.current.y) * 0.04
      if (blobRef.current) {
        blobRef.current.style.left = curRef.current.x + 'px'
        blobRef.current.style.top  = curRef.current.y + 'px'
      }
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    const check = () => {
      const blob = blobRef.current; if (!blob) return
      const el   = document.getElementById('skills'); if (!el) { blob.classList.add('blob-hidden'); return }
      const rect = el.getBoundingClientRect()
      blob.classList.toggle('blob-hidden', !(rect.top < window.innerHeight * 0.5 && rect.bottom > window.innerHeight * 0.5))
    }
    window.addEventListener('scroll', check, { passive: true })
    check()
    return () => window.removeEventListener('scroll', check)
  }, [])

  return <div className="global-blob" ref={blobRef} />
}

/* ── Reveal skills / publications / contact with different entry directions ── */
function useSectionReveal() {
  useEffect(() => {
    const ids = ['skills', 'publications', 'contact']
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('sect-revealed'); obs.unobserve(e.target) }
      })
    }, { threshold: 0.04 })
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])
}

/* ── Hero↔Projects cross-fade driven by scroll ── */
function useHeroFade() {
  useEffect(() => {
    const onScroll = () => {
      const hero = document.getElementById('hero')
      if (!hero) return
      const rect      = hero.getBoundingClientRect()
      // 0 when hero fully visible, 1 when hero completely scrolled away
      const fadeOut   = Math.max(0, Math.min(1, -rect.top / (window.innerHeight * 0.5)))
      hero.style.opacity = String(1 - fadeOut * 0.85)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

export default function App() {
  useSectionReveal()
  useHeroFade()

  return (
    <>
      <GlobalBlob />
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Projects />
        <Skills />
        <Publications />
        <Contact />
      </main>
      <Mascot />
    </>
  )
}
