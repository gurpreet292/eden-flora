import { useState } from 'react'
import { ArrowLeft, Check, Minus, Plus, ShieldCheck, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { getProduct } from '../data/products'
import { useStore } from '../hooks/useStore'
import Container from '../components/Container'

const ProductPage = () => {
  const { productId } = useParams()
  const product = getProduct(productId)
  const { addToCart } = useStore()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  if (!product) return <Container className="min-h-screen pt-40"><h1 className="font-display text-5xl">Plant not found.</h1><Link to="/shop" className="mt-8 inline-block text-sm text-fern">Return to shop</Link></Container>

  const handleAdd = () => { addToCart(product, quantity); setAdded(true) }

  return <main className="bg-ivory pb-28 pt-32 text-forest sm:pt-40"><Container><Link to="/shop" className="mb-10 inline-flex items-center gap-2 text-xs font-semibold text-forest/55 hover:text-fern"><ArrowLeft size={14} /> Back to shop</Link><div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center"><div className="overflow-hidden rounded-[1rem_9rem_1rem_9rem] bg-sage p-3 shadow-[18px_28px_55px_rgba(27,58,42,0.12)]"><div className="aspect-[0.95] overflow-hidden rounded-[0.75rem_8.5rem_0.75rem_8.5rem]"><img src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=1200&q=88`} alt={product.name} className="h-full w-full object-cover" /></div></div><div><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">{product.category}</p><h1 className="mt-5 font-display text-6xl leading-[0.88] sm:text-7xl">{product.name}</h1><p className="mt-8 max-w-md text-sm leading-8 text-forest/65">{product.description}</p><div className="mt-8 grid grid-cols-3 border-y border-forest/10 py-5 text-xs"><div><p className="text-forest/45">Size</p><p className="mt-2 font-semibold">{product.size}</p></div><div><p className="text-forest/45">Light</p><p className="mt-2 font-semibold">{product.light}</p></div><div><p className="text-forest/45">Water</p><p className="mt-2 font-semibold">{product.water}</p></div></div><div className="mt-8 flex items-center justify-between"><span className="font-display text-4xl text-fern">${product.price}</span><div className="flex items-center rounded-full border border-forest/15"><button aria-label="Decrease quantity" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="grid size-10 place-items-center"><Minus size={14} /></button><span className="w-7 text-center text-sm">{quantity}</span><button aria-label="Increase quantity" onClick={() => setQuantity(quantity + 1)} className="grid size-10 place-items-center"><Plus size={14} /></button></div></div><button onClick={handleAdd} className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-forest px-6 py-4 text-sm font-semibold text-ivory transition hover:-translate-y-0.5 hover:bg-fern">{added ? <><Check size={17} /> Added to garden bag</> : 'Add to garden bag'}</button><div className="mt-6 grid gap-3 text-xs text-forest/55 sm:grid-cols-2"><span className="flex items-center gap-2"><Truck size={15} className="text-gold" /> Carefully packed delivery</span><span className="flex items-center gap-2"><ShieldCheck size={15} className="text-gold" /> 30-day plant promise</span></div></div></div></Container></main>
}

export default ProductPage
