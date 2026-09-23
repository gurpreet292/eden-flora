import { ArrowRight, ArrowUpRight, Check, Clock3, Heart, Leaf, Mail, MapPin, Phone, Search, SlidersHorizontal, Sprout } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/Container'
import SectionTitle from '../components/SectionTitle'
import { getPlantPersonality, getProductImage, products } from '../data/products'
import QuickView from '../components/QuickView'
import CollectionWorkspace from '../components/CollectionWorkspace'
import api from '../utils/api'

const pageContent = {
  shop: { eyebrow: 'The first edit', title: 'Living pieces for considered spaces.', intro: 'A small, thoughtful collection of botanicals chosen for their character, resilience, and quiet ability to change a room.' },
  collections: { eyebrow: 'Find your rhythm', title: 'Collections with a pulse.', intro: 'Explore future edits shaped around light, mood, and the way you make a home your own.' },
  about: { eyebrow: 'The Eden Flora way', title: 'A little more life, in every room.', intro: 'Eden Flora is a slower kind of plant company, built around thoughtful growing, honest guidance, and the restorative power of nature at home.' },
  contact: { eyebrow: 'Come say hello', title: 'Let’s grow something beautiful.', intro: 'Questions about a plant, your space, or the collection ahead? Our greenhouse door is always open.' },
}

const collections = [
  ['Low light', 'For the quiet corners', 'photo-1509423350716-97f9360b4e09'],
  ['Statement plants', 'For a little drama', 'photo-1614594975525-e45190c55d0b'],
  ['Small rituals', 'For desks and shelves', 'photo-1485955900006-10f4d324d411'],
]

const SitePage = ({ type }) => {
  const content = pageContent[type]
  return <div className="min-h-screen bg-ivory text-forest"><main className="pb-24 pt-32 sm:pb-32 sm:pt-40"><Container>{type === 'shop' ? <ShopHero content={content} /> : type === 'collections' ? <CollectionsHero content={content} /> : type === 'contact' ? <ContactHero /> : type === 'about' ? <AboutHero /> : <IntroHero content={content} type={type} />}{type === 'contact' ? <ContactDetails /> : type === 'about' ? <AboutDetails /> : null}</Container></main></div>
}

const IntroHero = ({ content, type }) => <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:items-end"><SectionTitle eyebrow={content.eyebrow} title={content.title} description={content.intro} /><div className="relative overflow-hidden rounded-[1rem_8rem_1rem_8rem] bg-sage p-3 shadow-[18px_28px_55px_rgba(27,58,42,0.1)]"><div className="aspect-[1.45] overflow-hidden rounded-[0.75rem_7.5rem_0.75rem_7.5rem]"><img src={type === 'about' ? 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1400&q=85' : 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?auto=format&fit=crop&w=1400&q=85'} alt={type === 'about' ? 'Botanical interior with plants and natural light' : 'Eden Flora greenhouse interior'} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" /></div></div></div>

const ContactHero = () => <section className="relative overflow-hidden rounded-[1.5rem_6rem_1.5rem_6rem] bg-forest px-7 py-16 text-center text-ivory sm:px-16 sm:py-24"><img src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1600&q=85" alt="Greenhouse leaves in soft light" className="absolute inset-0 h-full w-full object-cover opacity-25 mix-blend-luminosity" /><div className="absolute inset-0 bg-forest/70" /><div className="relative mx-auto max-w-2xl"><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">Come say hello</p><h1 className="mt-5 font-display text-6xl leading-[0.86] sm:text-8xl">Let’s grow something beautiful.</h1><p className="mx-auto mt-7 max-w-lg text-sm leading-7 text-ivory/70">Questions about a plant, your space, or the collection ahead? Our greenhouse door is always open.</p><a href="#contact-form" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-forest transition hover:bg-ivory">Get in touch <ArrowRight size={14} /></a></div></section>

const AboutHero = () => <section className="relative overflow-hidden rounded-[1.5rem_6rem_1.5rem_6rem] bg-forest text-ivory"><div className="grid min-h-[34rem] lg:grid-cols-[1.05fr_0.95fr]"><div className="relative order-2 flex items-end overflow-hidden px-7 pb-10 pt-12 sm:px-12 sm:pb-14 lg:order-1"><div className="absolute inset-0 bg-linear-to-br from-forest via-fern to-[#477b4b]" /><motion.div className="absolute -right-6 top-12 text-gold/25" animate={{ rotate: [0, 8, 0], y: [0, 12, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}><Leaf size={150} strokeWidth={0.7} /></motion.div><motion.div className="absolute left-1/3 top-16 text-ivory/15" animate={{ rotate: [-18, 0, -18], y: [8, -12, 8] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}><Leaf size={82} strokeWidth={0.8} /></motion.div><div className="relative max-w-xl"><motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">The Eden Flora way</motion.p><motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.12 }} className="mt-5 max-w-lg font-display text-6xl leading-[0.84] sm:text-8xl">A little more life, in every room.</motion.h1><motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.25 }} className="mt-7 max-w-md text-sm leading-7 text-ivory/70">We select living pieces for their character, nurture them with patience, and help them find a meaningful place in your everyday.</motion.p></div></div><motion.div initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} className="relative order-1 min-h-[22rem] overflow-hidden lg:order-2 lg:min-h-0"><img src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1400&q=85" alt="Sunlit room filled with leafy plants" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-linear-to-t from-forest/45 via-transparent to-transparent" /><span className="absolute bottom-6 right-6 rounded-full border border-ivory/50 bg-forest/30 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-ivory backdrop-blur-sm">Living / 001</span></motion.div></div></section>

const ShopHero = () => {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All plants')
  const [sortBy, setSortBy] = useState('Featured')
  const [featuredPlant, setFeaturedPlant] = useState(products[3])
  const filtered = useMemo(() => {
    const matching = products.filter((product) => (filter === 'All plants' || product.category.toLowerCase().includes(filter.toLowerCase())) && product.name.toLowerCase().includes(query.toLowerCase()))
    return [...matching].sort((left, right) => sortBy === 'Price: low to high' ? left.price - right.price : sortBy === 'Price: high to low' ? right.price - left.price : 0)
  }, [filter, query, sortBy])
  const [selectedProduct, setSelectedProduct] = useState(null)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setFeaturedPlant((currentPlant) => {
        const currentIndex = products.indexOf(currentPlant)
        return products[(currentIndex + 1) % products.length]
      })
    }, 500)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <>
      <div className="grid gap-0 overflow-hidden rounded-none bg-sage/45 md:grid-cols-2">
        <div className="bg-[#d8f2dc] p-0">
          <div className="aspect-[0.9] overflow-hidden bg-[#eee8dc] md:aspect-[0.92]">
            <img src={getProductImage(featuredPlant, 1200)} alt={featuredPlant.name} className="h-full w-full object-cover" />
          </div>
          <div className="flex items-end justify-between gap-4 px-6 py-4 sm:px-8">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-gold">Featured plant / 0{products.indexOf(featuredPlant) + 1}</p>
              <p className="mt-2 font-display text-2xl leading-none text-forest">{featuredPlant.name}</p>
            </div>
            <div className="flex gap-2">
              <button type="button" aria-label="Previous featured plant" onClick={() => setFeaturedPlant(products[(products.indexOf(featuredPlant) - 1 + products.length) % products.length])} className="grid size-8 place-items-center rounded-full border border-forest/20 bg-ivory/75 text-forest">‹</button>
              <button type="button" aria-label="Next featured plant" onClick={() => setFeaturedPlant(products[(products.indexOf(featuredPlant) + 1) % products.length])} className="grid size-8 place-items-center rounded-full border border-forest/20 bg-ivory/75 text-forest">›</button>
            </div>
          </div>
          <div className="flex gap-2 px-6 pb-4 sm:px-8">
            {products.slice(0, 5).map((product) => <button key={product.id} type="button" onClick={() => setFeaturedPlant(product)} aria-label={`Feature ${product.name}`} className={`size-9 overflow-hidden rounded-md border-2 bg-ivory p-0.5 ${featuredPlant.id === product.id ? 'border-fern' : 'border-transparent'}`}><img src={getProductImage(product, 120)} alt="" className="h-full w-full object-cover" /></button>)}
          </div>
        </div>
        <div className="flex items-center justify-center bg-[#f2f2e8] p-10 text-center sm:p-16">
          <div className="max-w-sm">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-gold">The Eden Flora collection</p>
            <h1 className="mt-5 font-display text-5xl leading-none text-forest sm:text-6xl">Plant Collection</h1>
            <p className="mt-6 text-sm leading-6 text-fern">Bring a little more life into your everyday moments. Our plants are chosen for their character, their beauty, and their quiet way of making a space feel like home.</p>
            <Link to="/collections" className="mt-7 inline-flex items-center gap-2 border-b border-fern/40 pb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-forest">Explore our edits <ArrowRight size={13} /></Link>
          </div>
        </div>
      </div>

      <div className="mt-7 flex items-center justify-between gap-4 border-y border-forest/10 py-4">
        <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-gold">Botanical picks</p>
        <div className="flex items-center gap-4 text-[10px] text-forest/60">
          <button type="button" onClick={() => setFilter(filter === 'All plants' ? 'Low light' : 'All plants')} className="flex items-center gap-1 hover:text-forest"><SlidersHorizontal size={12} /> Filter</button>
          <label className="flex items-center gap-1 border-b border-forest/20 pb-1"><Search size={12} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" className="w-20 bg-transparent outline-none placeholder:text-forest/45" /></label>
          <label className="hidden items-center gap-2 sm:flex">Sort by <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="border-b border-forest/20 bg-transparent pb-1 outline-none"><option>Featured</option><option>Price: low to high</option><option>Price: high to low</option></select></label>
        </div>
      </div>

    <div className="mt-7 grid gap-8 lg:grid-cols-[11rem_minmax(0,1fr)] lg:gap-7">
      <aside className="shop-sidebar hidden self-start rounded-2xl border border-forest/10 bg-sage/35 p-5 lg:block">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.17em] text-gold"><Sprout size={14} /> Find your plant</div>
        <div className="my-5 border-t border-forest/10" />
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-fern/65">Browse by mood</p>
        <div className="mt-3 grid gap-1">
          {['All plants', 'Low light', 'Statement', 'Small rituals', 'Tropical'].map((item) => <button key={item} onClick={() => setFilter(item)} className={`rounded-lg px-3 py-2 text-left text-[11px] transition ${filter === item ? 'bg-forest font-semibold text-ivory' : 'text-fern hover:bg-sage'}`}>{item}</button>)}
        </div>
        <div className="my-5 border-t border-forest/10" />
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-fern/65">Fresh picks</p>
        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {products.slice(0, 3).map((product) => <button key={product.id} type="button" onClick={() => setSelectedProduct(product)} className="aspect-square overflow-hidden rounded-lg bg-sage"><img src={getProductImage(product, 180)} alt={product.name} className="h-full w-full object-cover" /></button>)}
        </div>
        <div className="my-5 border-t border-forest/10" />
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-fern/65">Plant promise</p>
        <p className="mt-3 text-[11px] leading-6 text-forest/60">Every plant comes with a care note and 30-day growing support.</p>
      </aside>

      <div className="min-w-0">
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-forest/10 pb-4 lg:hidden">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.17em] text-gold"><Sprout size={14} /> Find your plant</div>
          <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-full border border-forest/15 bg-transparent px-3 py-2 text-[10px] text-forest"><option>All plants</option><option>Low light</option><option>Statement</option><option>Small rituals</option><option>Tropical</option></select>
        </div>
        <section className="grid gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => <ProductCard key={product.id} product={product} onQuickView={setSelectedProduct} />)}
        </section>
      </div>
      {selectedProduct && <QuickView product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
    </>
  )
}

const ProductCard = ({ product, onQuickView }) => (
  <motion.div layout className="group">
    <button type="button" onClick={() => onQuickView(product)} data-cursor-label="View" className="relative block aspect-[0.86] w-full overflow-hidden rounded-2xl bg-sage text-left">
      <img loading="lazy" src={getProductImage(product, 800)} alt={`View ${product.name}`} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      <span className="absolute left-4 top-4 rounded-full bg-ivory/85 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-forest">New growth</span>
      <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-ivory/90 text-forest opacity-0 shadow-lg transition group-hover:opacity-100"><Heart size={15} /></span>
    </button>
    <p className="mt-4 text-center font-display text-2xl leading-none text-forest"><Link to={`/product/${product.id}`} className="hover:text-fern">{product.name}</Link></p>
    <p className="mt-2 min-h-10 text-center font-display text-sm italic leading-5 text-forest/50">“{getPlantPersonality(product).personality}”</p>
    <p className="mt-2 text-center text-sm font-semibold text-fern">${product.price.toFixed(2)}</p>
    <Link to={`/passport/${product.id}`} className="mx-auto mt-3 flex w-fit items-center gap-2 border-b border-gold/45 pb-1 text-[9px] font-bold uppercase tracking-[0.16em] text-forest">View passport <ArrowUpRight size={12} /></Link>
  </motion.div>
)

const CollectionsHero = ({ content }) => <><div className="max-w-2xl"><SectionTitle eyebrow={content.eyebrow} title={content.title} description={content.intro} /></div><section className="mt-16 grid gap-4 md:grid-cols-3">{collections.map(([name, subtitle, image], index) => <Link to="/shop" key={name} className={`group relative overflow-hidden rounded-[1rem_5rem_1rem_5rem] bg-sage ${index === 1 ? 'md:mt-16' : ''}`}><div className="aspect-[0.78]"><img src={`https://images.unsplash.com/${image}?auto=format&fit=crop&w=900&q=85`} alt={name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /></div><div className="absolute inset-0 bg-linear-to-t from-forest/80 via-transparent to-transparent" /><div className="absolute bottom-7 left-7 text-ivory"><p className="text-[9px] font-bold uppercase tracking-[0.22em] text-gold">0{index + 1}</p><h2 className="mt-2 font-display text-3xl">{name}</h2><p className="mt-1 text-xs text-ivory/70">{subtitle}</p></div></Link>)}</section><CollectionWorkspace /></>

const AboutDetails = () => {
  const steps = [
    ['01', 'Choose with intention', 'We look for generous shapes, resilient roots, and plants with a point of view.'],
    ['02', 'Prepare with patience', 'Each plant is checked, settled, and paired with a care rhythm that makes sense.'],
    ['03', 'Place with purpose', 'We help you read your room and find the corner where a plant can truly thrive.'],
    ['04', 'Stay close', 'Questions do not end at delivery. Our guidance continues as your collection grows.'],
  ]

  return <>
    <section className="mt-20 grid gap-10 border-b border-forest/10 pb-16 sm:mt-28 sm:grid-cols-[0.75fr_1.25fr] sm:pb-24"><div><p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-gold"><span className="h-px w-8 bg-gold" />Our point of view</p><h2 className="mt-6 max-w-md font-display text-5xl leading-[0.9] sm:text-6xl">Plants are not decoration. They are presence.</h2></div><div className="grid gap-6 text-sm leading-8 text-forest/65 md:grid-cols-2"><p>We started Eden Flora with a simple belief: the right plant can change the way a room feels, and the way a person moves through it. Every living piece should bring more than colour. It should bring rhythm, softness, and a reason to look up.</p><p>Our work is a quiet chain of care, from thoughtful growers to your brightest window. We make the choices, share the honest guidance, and stay close after delivery so your home can keep becoming more alive.</p></div></section>
    <section className="mt-20 sm:mt-28"><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">How it grows</p><h2 className="mt-4 font-display text-5xl leading-none sm:text-6xl">A considered journey.</h2></div><p className="max-w-xs text-xs leading-6 text-forest/50">Small decisions, made carefully, create the feeling of a home that is truly yours.</p></div><div className="relative mt-12 grid gap-4 md:grid-cols-4 md:gap-0"><div className="absolute left-[12%] right-[12%] top-7 hidden h-px bg-gold/45 md:block" />{steps.map(([number, title, text], index) => <motion.article key={number} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65, delay: index * 0.12 }} className="relative border-l border-forest/10 pl-6 md:border-l-0 md:px-5 md:pt-0 first:md:pl-0 last:md:pr-0"><div className="relative z-10 grid size-14 place-items-center rounded-full border border-gold/50 bg-ivory font-display text-xl text-fern shadow-[0_0_0_8px_#f8f6ee]">{number}</div><h3 className="mt-6 font-display text-2xl leading-none text-forest">{title}</h3><p className="mt-3 max-w-[13rem] text-xs leading-6 text-forest/55">{text}</p></motion.article>)}</div></section>
    <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.8 }} className="relative mt-20 overflow-hidden rounded-[1.5rem_6rem_1.5rem_6rem] bg-forest px-7 py-12 text-ivory sm:mt-28 sm:px-14 sm:py-16"><div className="absolute -right-4 -top-8 text-gold/20"><Leaf size={170} strokeWidth={0.6} /></div><div className="relative grid gap-10 sm:grid-cols-[1.1fr_0.9fr] sm:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">Transform your space</p><h2 className="mt-5 max-w-xl font-display text-5xl leading-[0.88] sm:text-7xl">A home should feel like it is growing with you.</h2></div><div><p className="text-sm leading-7 text-ivory/65">From a first windowsill companion to a whole-room planting plan, we are here to help you make space for what restores you.</p><Link to="/shop" className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-forest transition hover:bg-ivory">Explore the collection <ArrowRight size={14} /></Link></div></div></motion.section>
    <section className="mt-20 grid gap-10 sm:mt-28 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">Our standards</p><h2 className="mt-4 max-w-md font-display text-5xl leading-[0.9] sm:text-6xl">Good growing is a shared practice.</h2><p className="mt-6 max-w-md text-sm leading-7 text-forest/60">We believe beautiful spaces are built through attention: to the plant, to the person caring for it, and to the small details that make a ritual last.</p></div><div className="grid gap-3 sm:grid-cols-2">{[['Thoughtful sourcing', 'We work with growers who respect the pace and character of living things.'], ['Clear guidance', 'No guesswork or jargon. Just care advice you can use in your actual home.'], ['30-day promise', 'If a plant needs extra support after arrival, we are here to help it settle.'], ['Long-term thinking', 'We choose pieces that can become part of your space for years to come.']].map(([title, text], index) => <motion.article key={title} initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} className="rounded-2xl border border-forest/10 bg-sage/45 p-6 transition hover:-translate-y-1 hover:bg-sage"><div className="flex items-center justify-between"><Leaf size={18} strokeWidth={1.2} className="text-gold" /><span className="text-[9px] font-bold tracking-[0.18em] text-forest/35">0{index + 1}</span></div><h3 className="mt-8 font-display text-2xl text-forest">{title}</h3><p className="mt-3 text-xs leading-6 text-forest/55">{text}</p></motion.article>)}</div></section>
  </>
}

const ContactDetails = () => {
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleContactSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmitted(false)
    setError('')

    try {
      await api.post('/api/contact', Object.fromEntries(new FormData(event.currentTarget)))
      event.currentTarget.reset()
      setSubmitted(true)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'We could not send your note. Please email hello@edenflora.co directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return <>
    <section className="mt-14 grid gap-4 sm:grid-cols-3 sm:gap-5 sm:mt-20">
      <a href="tel:+18003363372" className="group rounded-2xl border border-forest/10 bg-sage/55 p-6 transition hover:-translate-y-1 hover:bg-sage sm:p-7"><span className="grid size-10 place-items-center rounded-full bg-forest text-gold"><Phone size={17} /></span><p className="mt-7 text-sm font-semibold">+1 800 336 3372</p><p className="mt-1 text-xs leading-5 text-forest/50">Talk to a plant specialist<br />Monday to Friday, 9am–5pm</p><ArrowUpRight size={15} className="mt-5 text-fern transition group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
      <a href="mailto:hello@edenflora.co" className="group rounded-2xl bg-forest p-6 text-ivory transition hover:-translate-y-1 hover:bg-fern sm:p-7"><span className="grid size-10 place-items-center rounded-full bg-gold text-forest"><Mail size={17} /></span><p className="mt-7 text-sm font-semibold">hello@edenflora.co</p><p className="mt-1 text-xs leading-5 text-ivory/60">Send a note to the greenhouse<br />We reply within one business day</p><ArrowUpRight size={15} className="mt-5 text-gold transition group-hover:translate-x-1 group-hover:-translate-y-1" /></a>
      <div className="rounded-2xl border border-forest/10 bg-sage/55 p-6 sm:p-7"><span className="grid size-10 place-items-center rounded-full bg-forest text-gold"><MapPin size={17} /></span><p className="mt-7 text-sm font-semibold">The Eden greenhouse</p><p className="mt-1 text-xs leading-5 text-forest/50">Brooklyn, New York<br />Visits by appointment</p><p className="mt-5 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.12em] text-fern"><Clock3 size={13} /> Open today</p></div>
    </section>
    <section className="mt-20 grid gap-12 border-t border-forest/10 pt-12 sm:mt-28 sm:pt-16 lg:grid-cols-[0.8fr_1.2fr]">
      <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">Find the greenhouse</p><h2 className="mt-4 max-w-sm font-display text-4xl leading-tight sm:text-5xl">Come by for a slower kind of shopping.</h2><p className="mt-5 max-w-sm text-sm leading-7 text-forest/60">Bring your questions, your room measurements, or simply your curiosity. We will help you find a plant that belongs there.</p><div className="mt-8 grid gap-3 text-xs text-forest/60"><p className="flex items-center gap-3"><Clock3 size={15} className="text-gold" /> Mon–Fri / 9:00am–5:00pm</p><p className="flex items-center gap-3"><MapPin size={15} className="text-gold" /> 184 Franklin Street, Brooklyn</p></div><div className="relative mt-8 h-56 overflow-hidden rounded-2xl border border-forest/10 bg-[#dce9d6]" aria-label="Illustrated map showing the Eden greenhouse location"><div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(28deg, transparent 47%, #7ea77d 48%, #7ea77d 49%, transparent 50%), linear-gradient(112deg, transparent 48%, #a8c39e 49%, #a8c39e 51%, transparent 52%), linear-gradient(#b8ceb0 1px, transparent 1px), linear-gradient(90deg, #b8ceb0 1px, transparent 1px)', backgroundSize: '170px 120px, 210px 150px, 34px 34px, 34px 34px' }} /><div className="absolute left-[58%] top-[42%] grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-gold text-forest shadow-[0_0_0_8px_rgba(199,168,109,0.28)]"><MapPin size={18} /></div><span className="absolute bottom-4 left-4 rounded-full bg-ivory/90 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-forest">Eden greenhouse</span></div></div>
      <form id="contact-form" onSubmit={handleContactSubmit} className="grid gap-5 rounded-2xl bg-sage/45 p-6 sm:grid-cols-2 sm:p-9"><div className="sm:col-span-2"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">Send a note</p><h2 className="mt-3 font-display text-4xl leading-none text-forest">Get in touch.</h2></div><label className="grid gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-forest/55">Your name<input required name="name" autoComplete="name" className="border-b border-forest/20 bg-transparent px-0 py-3 text-sm font-normal normal-case tracking-normal text-forest outline-none placeholder:text-forest/35 focus:border-fern" placeholder="Your name" /></label><label className="grid gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-forest/55">Email address<input required type="email" name="email" autoComplete="email" className="border-b border-forest/20 bg-transparent px-0 py-3 text-sm font-normal normal-case tracking-normal text-forest outline-none placeholder:text-forest/35 focus:border-fern" placeholder="you@example.com" /></label><label className="grid gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-forest/55 sm:col-span-2">How can we help?<select name="topic" className="border-b border-forest/20 bg-transparent px-0 py-3 text-sm font-normal normal-case tracking-normal text-forest outline-none focus:border-fern"><option>Plant care advice</option><option>Choosing a plant</option><option>Styling a space</option><option>Order support</option></select></label><label className="grid gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-forest/55 sm:col-span-2">Your message<textarea required name="message" rows="5" className="resize-none border-b border-forest/20 bg-transparent px-0 py-3 text-sm font-normal normal-case tracking-normal text-forest outline-none placeholder:text-forest/35 focus:border-fern" placeholder="Tell us a little about your space..." /></label><div className="flex flex-wrap items-center justify-between gap-4 sm:col-span-2"><button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 rounded-full bg-forest px-6 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-ivory transition hover:bg-fern disabled:cursor-wait disabled:opacity-60">{isSubmitting ? 'Sending...' : 'Send your note'} {!isSubmitting && <ArrowRight size={14} />}</button>{submitted && <p className="flex items-center gap-2 text-xs text-fern"><Check size={15} /> Your note has been sent.</p>}{error && <p role="alert" className="basis-full text-xs leading-5 text-red-700">{error}</p>}</div></form>
    </section>
    <section className="-mx-6 mt-20 grid gap-8 bg-forest px-6 py-12 text-ivory sm:-mx-10 sm:mt-28 sm:px-10 sm:py-16 lg:-mx-16 lg:grid-cols-[1.3fr_0.7fr] lg:px-16"><div><p className="font-display text-3xl text-ivory">Eden Flora<span className="text-gold">.</span></p><p className="mt-4 max-w-md text-xs leading-6 text-ivory/55">Thoughtful plants, honest guidance, and a little more life for the spaces you call home.</p></div><div className="grid grid-cols-2 gap-8 text-xs text-ivory/60 sm:grid-cols-3"><div><p className="mb-3 text-[9px] font-bold uppercase tracking-[0.16em] text-gold">Explore</p><Link to="/shop" className="block py-1 hover:text-ivory">Shop plants</Link><Link to="/about" className="block py-1 hover:text-ivory">Our story</Link></div><div><p className="mb-3 text-[9px] font-bold uppercase tracking-[0.16em] text-gold">Visit</p><p className="py-1">184 Franklin Street</p><p className="py-1">Brooklyn, NY</p></div><div><p className="mb-3 text-[9px] font-bold uppercase tracking-[0.16em] text-gold">Hours</p><p className="py-1">Mon–Fri</p><p className="py-1">9am–5pm</p></div></div></section>
  </>
}

export default SitePage
