import { useEffect, useState } from 'react'
import { Menu, Moon, ShoppingBag, Sun, X } from 'lucide-react'
import Container from '../components/Container'
import { Link } from 'react-router-dom'
import { useStore } from '../hooks/useStore'
import CartDrawer from '../components/CartDrawer'
import { useTheme } from '../hooks/useTheme'

const links = ['Home', 'Shop', 'Collections', 'About', 'Contact']

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { itemCount } = useStore()
  const { nightGarden, toggleTheme } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-ivory/90 shadow-[0_1px_0_rgba(27,58,42,0.08)] backdrop-blur-lg' : 'bg-transparent'}`}>
      <Container className="flex h-20 items-center justify-between">
        <Link to="/" className="font-display text-3xl font-semibold tracking-tight text-forest">Eden Flora<span className="text-gold">.</span></Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => <Link key={link} to={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest/70 transition-colors hover:text-fern">{link}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} aria-label={nightGarden ? 'Switch to Greenhouse theme' : 'Switch to Night Garden theme'} title={nightGarden ? 'Greenhouse' : 'Night Garden'} className="hidden items-center gap-2 rounded-full border border-forest/15 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-forest/65 transition hover:border-gold hover:text-forest sm:flex">{nightGarden ? <Sun size={14} /> : <Moon size={14} />}<span>{nightGarden ? 'Greenhouse' : 'Night Garden'}</span></button>
          <button onClick={() => setCartOpen(true)} aria-label="Open cart" className="relative grid size-10 place-items-center rounded-full text-forest transition-colors hover:bg-sage"><ShoppingBag size={18} strokeWidth={1.5} /><span className="absolute right-1 top-1 grid min-size-3.5 size-3.5 place-items-center rounded-full bg-gold text-[8px] font-bold text-forest">{itemCount}</span></button>
          <button aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-full bg-sage text-forest md:hidden">{open ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </Container>
      {open && <nav className="border-t border-forest/10 bg-ivory px-6 py-6 md:hidden">{links.map((link) => <Link onClick={() => setOpen(false)} key={link} to={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="block py-3 text-sm font-semibold uppercase tracking-[0.16em] text-forest/70">{link}</Link>)}</nav>}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  )
}

export default Navbar
