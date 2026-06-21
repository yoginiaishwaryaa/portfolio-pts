import { useEffect, useState } from 'react'

const links = ['work', 'skills', 'publications', 'contact']

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  // Logo is hidden until the hero name animation flies to this spot
  const [logoVisible, setLogoVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Listen for the custom event Hero dispatches when phase = 'done'
  useEffect(() => {
    const handler = () => setLogoVisible(true)
    window.addEventListener('hero-ready', handler)
    return () => window.removeEventListener('hero-ready', handler)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={scrolled ? 'scrolled' : ''}>
      <div className={`nav-logo ${logoVisible ? 'nav-logo-visible' : ''}`}>Yogini.</div>
      <ul className="nav-links">
        {links.map(l => (
          <li key={l}>
            <a href={`#${l}`} onClick={e => { e.preventDefault(); scrollTo(l) }}>
              {l}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
