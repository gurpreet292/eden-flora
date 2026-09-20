import { ArrowRight, ArrowUpRight, Heart, Leaf, Mail, MapPin, Phone, Search, SlidersHorizontal, Sprout } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Container from '../components/Container'
import SectionTitle from '../components/SectionTitle'
import { getPlantPersonality, getProductImage, products } from '../data/products'
import QuickView from '../components/QuickView'
import CollectionWorkspace from '../components/CollectionWorkspace'

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
  return <div className="min-h-screen bg-ivory text-forest"><main className="pb-24 pt-32 sm:pb-32 sm:pt-40"><Container>{type === 'shop' ? <ShopHero content={content} /> : type === 'collections' ? <CollectionsHero content={content} /> : <IntroHero content={content} type={type} />}{type === 'contact' ? <ContactDetails /> : type === 'about' ? <AboutDetails /> : null}</Container></main></div>
}

const IntroHero = ({ content, type }) => <div className="grid gap-16 lg:grid-cols-[0.75fr_1.25fr] lg:items-end"><SectionTitle eyebrow={content.eyebrow} title={content.title} description={content.intro} /><div className="relative overflow-hidden rounded-[1rem_8rem_1rem_8rem] bg-sage p-3 shadow-[18px_28px_55px_rgba(27,58,42,0.1)]"><div className="aspect-[1.45] overflow-hidden rounded-[0.75rem_7.5rem_0.75rem_7.5rem]"><img src={type === 'about' ? 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1400&q=85' : 'https://images.unsplash.com/photo-1593691509543-c55fb32e5cee?auto=format&fit=crop&w=1400&q=85'} alt={type === 'about' ? 'Botanical interior with plants and natural light' : 'Eden Flora greenhouse interior'} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" /></div></div></div>

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

const AboutDetails = () => <section className="mt-24 grid gap-12 border-t border-forest/10 pt-12 md:grid-cols-2 sm:mt-32 sm:pt-16"><div><Leaf size={22} strokeWidth={1} className="text-gold" /><h2 className="mt-6 font-display text-4xl">Plants are not decoration. They are presence.</h2></div><p className="max-w-md text-sm leading-8 text-forest/65">We work with growers who understand that every plant has a point of view. Our role is to help it find the right room, the right light, and the right person. The result is a home that feels less furnished, and more alive.</p></section>

const ContactDetails = () => <section className="mt-24 grid gap-4 border-t border-forest/10 pt-12 sm:grid-cols-3 sm:pt-16"><a href="mailto:hello@edenflora.co" className="rounded-2xl bg-sage/55 p-7 transition hover:bg-sage"><Mail size={18} className="text-gold" /><p className="mt-8 text-sm font-semibold">hello@edenflora.co</p><p className="mt-1 text-xs text-forest/50">Write to the greenhouse</p></a><a href="tel:+18003363372" className="rounded-2xl bg-sage/55 p-7 transition hover:bg-sage"><Phone size={18} className="text-gold" /><p className="mt-8 text-sm font-semibold">+1 800 336 3372</p><p className="mt-1 text-xs text-forest/50">Monday to Friday</p></a><div className="rounded-2xl bg-sage/55 p-7"><MapPin size={18} className="text-gold" /><p className="mt-8 text-sm font-semibold">The Eden greenhouse</p><p className="mt-1 text-xs text-forest/50">Brooklyn, New York</p></div></section>

export default SitePage
