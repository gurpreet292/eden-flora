import { ArrowUpRight, Leaf } from 'lucide-react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Container from '../components/Container'
import SectionTitle from '../components/SectionTitle'

const categories = [
  { title: 'Low light', subtitle: 'Quiet corners', image: 'photo-1509423350716-97f9360b4e09' },
  { title: 'Statement', subtitle: 'A little drama', image: 'photo-1614594975525-e45190c55d0b' },
  { title: 'Small rituals', subtitle: 'Desk companions', image: 'photo-1485955900006-10f4d324d411' },
]

const Categories = () => <section id="collections" className="relative overflow-hidden bg-sage/60 py-24 sm:py-32"><div className="pointer-events-none absolute -right-32 top-20 size-96 rounded-full bg-ivory/70 blur-3xl" /><Container className="relative"><div className="flex flex-wrap items-end justify-between gap-7"><SectionTitle eyebrow="Find your rhythm" title="A plant for every kind of day." description="Choose by light, mood, or instinct. Each collection is a small invitation to make a room feel more like yours." /><Link to="/collections" className="group mb-1 inline-flex items-center gap-3 rounded-full border border-forest/20 bg-ivory/50 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] text-forest transition hover:-translate-y-1 hover:bg-ivory">View collections <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link></div><div className="mt-14 grid gap-4 md:grid-cols-3">{categories.map((category, index) => <motion.div key={category.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay: index * 0.12 }}><Link to="/shop" className={`group relative block overflow-hidden rounded-[1rem_5rem_1rem_5rem] bg-forest ${index === 1 ? 'md:mt-12' : ''}`}><div className="aspect-[0.95]"><img src={`https://images.unsplash.com/${category.image}?auto=format&fit=crop&w=900&q=85`} alt={`${category.title} plant collection`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div><div className="absolute inset-0 bg-linear-to-t from-forest via-forest/5 to-transparent" /><div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-ivory"><div><p className="mb-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-gold"><Leaf size={12} strokeWidth={1.2} /> 0{index + 1}</p><h3 className="font-display text-3xl">{category.title}</h3><p className="mt-1 text-xs text-ivory/65">{category.subtitle}</p></div><span className="grid size-10 place-items-center rounded-full bg-ivory/15 backdrop-blur transition group-hover:bg-gold group-hover:text-forest"><ArrowUpRight size={16} /></span></div></Link></motion.div>)}</div></Container></section>

export default Categories
