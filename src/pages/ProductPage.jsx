import { useState } from 'react'
import { ArrowLeft, Check, Heart, Minus, Plus, ShieldCheck, Star, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getPlantPersonality, getProduct, getProductImage, products } from '../data/products'
import { useStore } from '../hooks/useStore'
import Container from '../components/Container'

const ProductPage = () => {
  const { productId } = useParams()
  const product = getProduct(productId)
  const { addToCart } = useStore()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  if (!product) return <Container className="min-h-screen pt-40"><h1 className="font-display text-5xl text-forest">Plant not found.</h1><Link to="/shop" className="mt-8 inline-block text-sm text-fern">Return to shop</Link></Container>

  const relatedProducts = products.filter((item) => item.id !== product.id).slice(0, 4)
  const profile = getPlantPersonality(product)
  const productImage = getProductImage(product, 1400)
  const handleAdd = () => { addToCart(product, quantity); setAdded(true) }

  return <main className="bg-ivory pb-28 pt-28 text-forest sm:pt-36">
    <Container>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-forest/10 pb-5">
        <Link to="/shop" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-forest/55 transition hover:text-fern"><ArrowLeft size={14} /> Back to shop</Link>
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-forest/35">Home / Shop / {product.name}</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)] lg:gap-20">
        <section>
          <div className="relative overflow-hidden rounded-[1.25rem_5rem_1.25rem_5rem] bg-[#eee8d9] p-4 shadow-[0_24px_55px_rgba(27,58,42,0.1)]">
            <div className="aspect-square overflow-hidden rounded-[0.9rem_4.2rem_0.9rem_4.2rem] bg-[#f4eee2]"><img src={productImage} alt={product.name} className="h-full w-full object-cover transition duration-500" /></div>
            <span className="absolute left-8 top-8 rounded-full bg-forest px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-ivory">Best seller</span>
          </div>
        </section>

        <section className="flex flex-col justify-center">
          <div className="flex items-center justify-between gap-4"><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">{product.category}</p><button type="button" onClick={() => setIsSaved(!isSaved)} aria-label={isSaved ? 'Remove from wishlist' : 'Add to wishlist'} className={`grid size-10 place-items-center rounded-full border border-forest/15 transition ${isSaved ? 'bg-gold text-forest' : 'text-forest/55 hover:bg-sage'}`}><Heart size={17} fill={isSaved ? 'currentColor' : 'none'} /></button></div>
          <h1 className="mt-5 max-w-xl font-display text-5xl leading-[0.92] sm:text-7xl">{product.name}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3"><div className="flex items-center gap-1 text-gold" aria-label="4.9 out of 5 stars"><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /><Star size={13} fill="currentColor" /></div><span className="text-xs font-semibold text-forest/55">4.9 <span className="font-normal">(38 reviews)</span></span><span className="size-1 rounded-full bg-forest/25" /><span className="text-xs font-semibold text-fern">In stock</span></div>
          <p className="mt-7 max-w-lg text-sm leading-7 text-forest/65">{product.description}</p>
          <div className="mt-7 rounded-2xl border border-gold/25 bg-gold/10 p-5"><p className="text-[9px] font-bold uppercase tracking-[0.22em] text-gold">Meet {profile.persona}</p><p className="mt-3 font-display text-2xl leading-tight text-forest">“{profile.personality}”</p><p className="mt-3 text-[10px] font-bold uppercase tracking-[0.16em] text-fern">Care level: {profile.difficulty}</p></div>
          <div className="mt-8 grid grid-cols-3 border-y border-forest/10 py-5 text-xs"><div><p className="text-forest/45">Size</p><p className="mt-2 font-semibold">{product.size}</p></div><div><p className="text-forest/45">Light</p><p className="mt-2 font-semibold">{product.light}</p></div><div><p className="text-forest/45">Water</p><p className="mt-2 font-semibold">{product.water}</p></div></div>
          <div className="mt-8 flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-forest/40">Your plant</p><span className="mt-1 block font-display text-4xl text-fern">${product.price}</span></div><div className="flex items-center rounded-full border border-forest/15 bg-white/40"><button type="button" aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="grid size-10 place-items-center transition hover:text-fern"><Minus size={14} /></button><span className="w-7 text-center text-sm">{quantity}</span><button type="button" aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)} className="grid size-10 place-items-center transition hover:text-fern"><Plus size={14} /></button></div></div>
          <button type="button" onClick={handleAdd} className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-forest px-6 py-4 text-sm font-semibold text-ivory transition hover:bg-fern">{added ? <><Check size={16} /> Added to garden bag</> : 'Add to garden bag'}</button>
          <div className="mt-5 grid gap-3 text-[11px] text-forest/55 sm:grid-cols-2"><span className="flex items-center gap-2"><Truck size={15} className="text-gold" /> Carefully packed delivery</span><span className="flex items-center gap-2"><ShieldCheck size={15} className="text-gold" /> 30-day plant promise</span></div>
        </section>
      </div>

      <section className="mt-24 border-t border-forest/10 pt-10"><div className="flex flex-wrap gap-8 border-b border-forest/10" role="tablist" aria-label="Product information"><button type="button" role="tab" aria-selected={activeTab === 'description'} onClick={() => setActiveTab('description')} className={`${activeTab === 'description' ? 'border-fern text-fern' : 'border-transparent text-forest/40'} border-b-2 pb-4 text-xs font-bold uppercase tracking-[0.16em]`}>Description</button><button type="button" role="tab" aria-selected={activeTab === 'care'} onClick={() => setActiveTab('care')} className={`${activeTab === 'care' ? 'border-fern text-fern' : 'border-transparent text-forest/40'} border-b-2 pb-4 text-xs font-bold uppercase tracking-[0.16em]`}>Care guide</button><button type="button" role="tab" aria-selected={activeTab === 'reviews'} onClick={() => setActiveTab('reviews')} className={`${activeTab === 'reviews' ? 'border-fern text-fern' : 'border-transparent text-forest/40'} border-b-2 pb-4 text-xs font-bold uppercase tracking-[0.16em]`}>Reviews</button></div>{activeTab === 'description' && <div className="grid gap-8 py-9 md:grid-cols-[1.2fr_0.8fr]"><p className="max-w-2xl text-sm leading-8 text-forest/65">{product.description} Designed for thoughtful spaces, this plant arrives ready to settle into your home. Give it the light it asks for, keep to its watering rhythm, and let it grow into its place.</p><div className="grid grid-cols-2 gap-3 text-xs"><div className="rounded-xl bg-sage/45 p-4"><p className="text-forest/45">Light</p><p className="mt-2 font-semibold">{product.light}</p></div><div className="rounded-xl bg-sage/45 p-4"><p className="text-forest/45">Watering</p><p className="mt-2 font-semibold">{product.water}</p></div></div></div>}{activeTab === 'care' && <div className="grid gap-4 py-9 sm:grid-cols-3"><div className="rounded-xl bg-sage/45 p-5"><p className="text-forest/45">Light</p><p className="mt-2 text-sm font-semibold">{product.light}</p></div><div className="rounded-xl bg-sage/45 p-5"><p className="text-forest/45">Watering</p><p className="mt-2 text-sm font-semibold">{product.water}</p></div><div className="rounded-xl bg-sage/45 p-5"><p className="text-forest/45">Care level</p><p className="mt-2 text-sm font-semibold">{profile.difficulty}</p></div></div>}{activeTab === 'reviews' && <div className="grid gap-8 py-9 md:grid-cols-[0.7fr_1.3fr]"><div><p className="font-display text-5xl text-fern">4.9</p><div className="mt-3 flex gap-1 text-gold" aria-label="4.9 out of 5 stars"><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /><Star size={14} fill="currentColor" /></div><p className="mt-3 text-xs text-forest/55">Based on 38 reviews</p></div><div className="border-l border-forest/10 pl-6"><p className="text-sm leading-7 text-forest/65">“Beautifully packed and already thriving. The care notes made settling it into my home wonderfully simple.”</p><p className="mt-4 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">Verified customer</p></div></div>}</section>

      <section className="mt-14 border-t border-forest/10 pt-16"><div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gold">Made for your collection</p><h2 className="mt-3 font-display text-4xl text-forest sm:text-5xl">Explore related plants</h2></div><Link to="/shop" className="text-xs font-bold uppercase tracking-[0.16em] text-fern">View all plants</Link></div><div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">{relatedProducts.map((relatedProduct) => <Link key={relatedProduct.id} to={`/product/${relatedProduct.id}`} className="group"><div className="aspect-square overflow-hidden rounded-[1rem_2.5rem_1rem_2.5rem] bg-sage/45 p-3"><img src={getProductImage(relatedProduct, 500)} alt={relatedProduct.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div><p className="mt-4 text-[9px] font-bold uppercase tracking-[0.16em] text-gold">{relatedProduct.category}</p><h3 className="mt-2 font-display text-xl leading-none text-forest group-hover:text-fern">{relatedProduct.name}</h3><p className="mt-3 text-sm font-semibold text-fern">${relatedProduct.price}</p></Link>)}</div></section>
    </Container>
  </main>
}

export default ProductPage
