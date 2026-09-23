import { useEffect, useState } from 'react'
import { ChevronDown, LogIn, LogOut, Menu, Moon, ShoppingBag, Sun, UserPlus, X } from 'lucide-react'
import Container from '../components/Container'
import { Link } from 'react-router-dom'
import { useStore } from '../hooks/useStore'
import CartDrawer from '../components/CartDrawer'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../context/AuthContext'

const links = ['Home', 'Shop', 'Collections', 'Vault', 'About', 'Contact']

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { itemCount } = useStore()
  const { nightGarden, toggleTheme } = useTheme()

  useEffect(() => {
    const closeMenu = () => setMenuOpen(false)
    window.addEventListener('auth:updated', closeMenu)
    return () => window.removeEventListener('auth:updated', closeMenu)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLogout = async () => {
    await logout()
    setMenuOpen(false)
  }

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'bg-ivory/90 shadow-[0_1px_0_rgba(27,58,42,0.08)] backdrop-blur-lg' : 'bg-transparent'}`}>
      <Container className="flex h-20 items-center justify-between">
        <Link to="/" className="font-display text-3xl font-semibold tracking-[-0.04em] text-forest">Eden Flora<span className="text-gold">.</span></Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => <Link key={link} to={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-forest/75 transition-colors hover:text-fern">{link}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} aria-label={nightGarden ? 'Switch to Greenhouse theme' : 'Switch to Night Garden theme'} title={nightGarden ? 'Greenhouse' : 'Night Garden'} className="hidden items-center gap-2 rounded-full border border-forest/15 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-forest/70 transition hover:border-gold hover:text-forest sm:flex">{nightGarden ? <Sun size={14} /> : <Moon size={14} />}<span>{nightGarden ? 'Greenhouse' : 'Night Garden'}</span></button>
          {!user ? (
            <>
              <Link to="/login" className="hidden items-center gap-2 rounded-full border border-forest/15 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-forest/70 transition hover:border-fern hover:text-forest sm:flex"><LogIn size={14} /> Login</Link>
              <Link to="/register" className="hidden items-center gap-2 rounded-full bg-forest px-3 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-ivory transition hover:bg-fern sm:flex"><UserPlus size={14} /> Join</Link>
            </>
          ) : (
            <div className="relative hidden sm:block">
              <button onClick={() => setMenuOpen((current) => !current)} className="flex items-center gap-2 rounded-full border border-forest/15 bg-ivory px-3 py-2 text-[9px] font-bold uppercase tracking-[0.12em] text-forest/70 transition hover:border-gold">
                <span className="inline-grid size-6 place-items-center rounded-full bg-fern/15 text-forest">{user.name?.charAt(0).toUpperCase() || 'U'}</span>
                <span>{user.name?.split(' ')[0] || 'User'}</span>
                <ChevronDown size={13} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-forest/10 bg-ivory p-3 shadow-[0_25px_60px_rgba(27,58,42,0.12)]">
                  <div className="border-b border-forest/10 pb-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-forest/45">Signed in</p>
                    <p className="mt-2 text-sm font-semibold text-forest">{user.name}</p>
                    <p className="text-xs text-forest/60">{user.email}</p>
                  </div>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="mt-3 block rounded-xl border border-forest/10 px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-forest/70 transition hover:border-gold hover:text-forest">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="mt-3 flex w-full items-center justify-between rounded-xl border border-forest/10 px-3 py-2 text-left text-[10px] font-bold uppercase tracking-[0.14em] text-forest/70 transition hover:border-rose-200 hover:text-rose-700">
                    <span>Log out</span>
                    <LogOut size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
          <button onClick={() => setCartOpen(true)} aria-label="Open cart" className="relative grid size-10 place-items-center rounded-full text-forest transition-colors hover:bg-sage"><ShoppingBag size={18} strokeWidth={1.5} /><span className="absolute right-1 top-1 grid min-w-3.5 min-h-3.5 place-items-center rounded-full bg-gold px-1 text-[8px] font-bold leading-none text-forest">{itemCount}</span></button>
          <button aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-full bg-sage text-forest md:hidden">{open ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </Container>
      {open && <nav className="border-t border-forest/10 bg-ivory px-6 py-6 md:hidden">{links.map((link) => <Link onClick={() => setOpen(false)} key={link} to={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="block py-3 text-sm font-semibold uppercase tracking-[0.16em] text-forest/70">{link}</Link>)}{!user ? <><Link onClick={() => setOpen(false)} to="/login" className="block py-3 text-sm font-semibold uppercase tracking-[0.16em] text-forest/70">Login</Link><Link onClick={() => setOpen(false)} to="/register" className="block py-3 text-sm font-semibold uppercase tracking-[0.16em] text-forest/70">Register</Link></> : <><Link onClick={() => setOpen(false)} to="/dashboard" className="mt-4 block rounded-full border border-forest/15 px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.16em] text-forest/70">Dashboard</Link><button onClick={handleLogout} className="mt-4 w-full rounded-full border border-forest/15 px-4 py-3 text-left text-sm font-semibold uppercase tracking-[0.16em] text-forest/70">Log out</button></>}</nav>}
      </header>
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}

export default Navbar
