import { useEffect, useState } from 'react'
import { Check, Minus, Plus, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../hooks/useStore'

const QuickView = ({ product, onClose }) => {
  const { addToCart } = useStore()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', closeOnEscape)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', closeOnEscape); document.body.style.overflow = '' }
  }, [onClose])

  const add = () => { addToCart(product, quantity); setAdded(true) }

  return <div className="fixed inset-0 z-90 flex justify-end bg-forest/30 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><aside role="dialog" aria-modal="true" aria-labelledby="quick-view-title" className="h-full w-full max-w-xl overflow-y-auto bg-ivory p-6 shadow-2xl sm:p-10"><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold">Quick view</p><button onClick={onClose} aria-label="Close quick view" className="grid size-10 place-items-center rounded-full bg-sage text-forest"><X size={18} /></button></div><div className="mt-8 overflow-hidden rounded-2xl bg-sage"><img src={`https://images.unsplash.com/${product.image}?auto=format&fit=crop&w=1000&q=88`} alt={product.name} className="aspect-[0.9] h-auto w-full object-cover" /></div><p className="mt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">{product.category}</p><h2 id="quick-view-title" className="mt-2 font-display text-5xl leading-none text-forest">{product.name}</h2><p className="mt-5 text-sm leading-7 text-forest/60">{product.description}</p><div className="mt-7 flex items-center justify-between border-y border-forest/10 py-5"><span className="font-display text-4xl text-fern">${product.price}</span><div className="flex items-center rounded-full border border-forest/15"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity" className="grid size-9 place-items-center"><Minus size={13} /></button><span className="w-7 text-center text-sm">{quantity}</span><button onClick={() => setQuantity(quantity + 1)} aria-label="Increase quantity" className="grid size-9 place-items-center"><Plus size={13} /></button></div></div><button onClick={add} className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-forest px-5 py-4 text-sm font-semibold text-ivory hover:bg-fern">{added ? <><Check size={16} /> Added to garden bag</> : 'Add to garden bag'}</button><Link to={`/product/${product.id}`} onClick={onClose} className="mt-6 block text-center text-xs font-bold uppercase tracking-[0.16em] text-fern">View full plant details</Link></aside></div>
}

export default QuickView
