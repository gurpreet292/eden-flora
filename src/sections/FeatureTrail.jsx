import { ArrowUpRight, BookOpen, Heart, LockKeyhole, Map, ShoppingBag, UserRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'

const flows = [
  { number: '01', title: 'Browse the shop', detail: 'Search, filter, sort, quick view, and open a plant page.', href: '/shop', icon: BookOpen, action: 'Open shop' },
  { number: '02', title: 'Build a garden bag', detail: 'Add plants, change quantities, remove items, and review totals.', href: '/cart', icon: ShoppingBag, action: 'Open cart' },
  { number: '03', title: 'Create or access an account', detail: 'Register, sign in, reset a password, or sign out securely.', href: '/register', icon: LockKeyhole, action: 'Start auth flow' },
  { number: '04', title: 'Explore the vault', detail: 'Browse rare plants, open passports, and try the AI curator.', href: '/vault', icon: Map, action: 'Open vault' },
  { number: '05', title: 'Test a protected order', detail: 'Sign in, place an order, then verify it appears in your history.', href: '/dashboard', icon: UserRound, action: 'Open dashboard' },
  { number: '06', title: 'Open a plant passport', detail: 'Check care details, journey information, and plant records.', href: '/passport/monstera-deliciosa', icon: Heart, action: 'View passport' },
]

const FeatureTrail = () => <section id="test-drive" className="bg-[#f4efe5] py-24 sm:py-32"><Container><div className="max-w-2xl"><p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-gold"><span className="h-px w-8 bg-gold" />Test drive Eden Flora</p><h2 className="mt-5 font-display text-5xl leading-[0.9] text-forest sm:text-6xl">Every path, gathered in one place.</h2><p className="mt-6 max-w-xl text-sm leading-7 text-forest/60">Use these entry points to walk through the store from first visit to signed-in order history.</p></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{flows.map(({ number, title, detail, href, icon: Icon, action }) => <Link key={href} to={href} className="group flex min-h-56 flex-col justify-between rounded-2xl border border-forest/10 bg-white/70 p-5 transition hover:-translate-y-1 hover:border-gold hover:bg-white"><div className="flex items-start justify-between"><span className="font-display text-3xl text-gold">{number}</span><Icon size={19} strokeWidth={1.4} className="text-fern" /></div><div><h3 className="font-display text-2xl text-forest">{title}</h3><p className="mt-2 text-xs leading-6 text-forest/60">{detail}</p><span className="mt-5 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-fern">{action} <ArrowUpRight size={13} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span></div></Link>)}</div></Container></section>

export default FeatureTrail
