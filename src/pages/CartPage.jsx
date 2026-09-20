import { ArrowLeft, Droplets, Leaf, Minus, Plus, ShoppingBag, Sun, Trash2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Container from '../components/Container'
import { getPlantPersonality, getProductImage } from '../data/products'
import { useStore } from '../hooks/useStore'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const CareCard = ({ cart }) => (
  <section className="overflow-hidden rounded-[28px] border border-gold/35 bg-[linear-gradient(180deg,#fffdf8_0%,#f5f0e4_100%)] p-6 shadow-[0_18px_45px_rgba(27,58,42,0.08)] sm:p-7">
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-gold">Your care card</p>
        <h2 className="mt-3 font-display text-3xl leading-none text-forest">A little note for what comes next.</h2>
      </div>
      <div className="rounded-full border border-gold/40 bg-[#f0e7d1] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-forest/70">Ready to grow</div>
    </div>
    <p className="mt-4 text-xs leading-6 text-forest/60">Your plants will arrive with their first care rhythm ready to follow.</p>
    <div className="mt-6 space-y-4">
      {cart.map((item) => {
        const profile = getPlantPersonality(item)
        return (
          <article key={`care-${item.id}`} className="rounded-2xl border border-forest/10 bg-white/70 p-4 shadow-[0_8px_20px_rgba(27,58,42,0.04)]">
            <p className="font-display text-xl text-forest">{profile.persona} · {item.name}</p>
            <p className="mt-2 text-xs italic leading-5 text-forest/60">“{profile.personality}”</p>
            <div className="mt-4 grid gap-3 text-[11px] text-forest/65">
              <span className="flex items-center gap-2"><Droplets size={14} className="text-gold" /> Water every {item.water.replace('Every ', '')}</span>
              <span className="flex items-center gap-2"><Sun size={14} className="text-gold" /> {item.light}</span>
              <span className="flex items-center gap-2"><Leaf size={14} className="text-gold" /> {profile.difficulty} care level</span>
            </div>
          </article>
        )
      })}
    </div>
    <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.16em] text-fern">Email reminders coming soon</p>
  </section>
)

const CartPage = () => {
  const { cart, itemCount, subtotal, updateQuantity, removeFromCart, clearCart } = useStore()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [checkoutError, setCheckoutError] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const shipping = subtotal >= 100 || subtotal === 0 ? 0 : 12
  const total = subtotal + shipping

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/cart' } })
      return
    }

    setCheckoutError('')
    setIsCheckingOut(true)
    try {
      const response = await api.post('/api/orders', { items: cart.map(({ id, quantity }) => ({ id, quantity })) })
      clearCart()
      navigate('/order-confirmed', {
        replace: true,
        state: {
          orderId: response.data?._id,
          total: response.data?.total,
          itemCount: response.data?.items?.length ?? cart.length,
        },
      })
    } catch (error) {
      setCheckoutError(error.response?.data?.message || 'Checkout could not be completed.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (!cart.length) return <div className="min-h-screen bg-[radial-gradient(circle_at_top,#faf7ef_0%,#eff4ec_55%,#edf3ee_100%)] text-forest"><main className="pb-28 pt-36 sm:pt-44"><Container><div className="mx-auto max-w-xl rounded-4xl border border-forest/10 bg-white/60 px-8 py-12 text-center shadow-[0_22px_60px_rgba(27,58,42,0.06)]"><ShoppingBag size={30} strokeWidth={1.15} className="mx-auto text-gold" /><p className="mt-6 text-[10px] font-bold uppercase tracking-[0.28em] text-gold">Your garden bag</p><h1 className="mt-5 font-display text-5xl leading-none sm:text-6xl">A quiet space, for now.</h1><p className="mx-auto mt-6 max-w-sm text-sm leading-7 text-forest/60">Your cart is waiting for the first piece of your indoor garden.</p><Link to="/shop" className="mt-9 inline-flex items-center gap-3 rounded-full bg-forest px-6 py-3.5 text-sm font-semibold text-ivory transition hover:-translate-y-0.5 hover:bg-fern">Explore plants</Link></div></Container></main></div>

  return <main className="min-h-screen bg-[radial-gradient(circle_at_top,#faf7ef_0%,#eff4ec_52%,#edf3ee_100%)] pb-28 pt-28 text-forest sm:pt-36"><Container className="max-w-6xl">
    <div className="flex flex-wrap items-end justify-between gap-5 border-b border-forest/10 pb-8"><div><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">Your garden bag</p><h1 className="mt-4 font-display text-5xl leading-none sm:text-6xl">Ready to take root.</h1></div><div className="rounded-full border border-forest/10 bg-white/70 px-4 py-2 text-sm font-medium text-forest/60 shadow-[0_8px_20px_rgba(27,58,42,0.04)]">{itemCount} {itemCount === 1 ? 'plant' : 'plants'}</div></div>
    <div className="flex flex-wrap items-center gap-3 border-b border-forest/10 py-5 text-[10px] font-bold uppercase tracking-[0.16em]"><span className="rounded-full bg-forest px-3 py-2 text-ivory">1. Garden bag</span><span className="text-forest/35">2. Account checkout</span><span className="text-forest/35">3. Order confirmation</span></div>
    <div className="mt-10 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.42fr)]">
      <section className="overflow-hidden rounded-[28px] border border-forest/10 bg-white/65 shadow-[0_20px_55px_rgba(27,58,42,0.06)]">
        <div className="flex items-center justify-between border-b border-forest/10 px-5 py-4 sm:px-7">
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-forest/45">Selected plants</div>
          <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">{cart.length} item{cart.length === 1 ? '' : 's'}</div>
        </div>
        <div className="px-5 sm:px-7">
          {cart.map((item) => (
            <article key={item.id} className="flex gap-4 border-b border-forest/10 py-5 last:border-b-0 sm:gap-6">
              <img src={getProductImage(item, 300)} alt={item.name} className="size-24 rounded-[18px] object-cover shadow-[0_10px_25px_rgba(27,58,42,0.1)] sm:size-32" />
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-4">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-gold">{item.category}</p>
                  <Link to={`/product/${item.id}`} className="mt-1 block font-display text-xl hover:text-fern sm:text-2xl">{item.name}</Link>
                  <p className="mt-1 text-sm text-forest/55">${item.price.toFixed(2)} each</p>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center rounded-full border border-forest/15 bg-ivory shadow-[0_6px_16px_rgba(27,58,42,0.04)]">
                    <button aria-label={`Decrease ${item.name}`} onClick={() => updateQuantity(item.id, item.quantity - 1)} className="grid size-8 place-items-center text-forest/70 transition hover:text-fern"><Minus size={13} /></button>
                    <span className="w-7 text-center text-xs font-semibold text-forest">{item.quantity}</span>
                    <button aria-label={`Increase ${item.name}`} onClick={() => updateQuantity(item.id, item.quantity + 1)} className="grid size-8 place-items-center text-forest/70 transition hover:text-fern"><Plus size={13} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-forest/45 transition hover:text-red-800"><Trash2 size={15} /> Remove</button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <div className="grid h-fit gap-6 lg:sticky lg:top-28">
        <CareCard cart={cart} />
        <aside className="rounded-[28px] border border-forest/10 bg-[linear-gradient(180deg,#213f32_0%,#163126_100%)] p-6 text-ivory shadow-[0_22px_55px_rgba(11,30,23,0.18)] sm:p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#d7c59c]">Order summary</p>
          <div className="mt-7 space-y-4 text-sm text-ivory/80">
            <div className="flex justify-between"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between"><span>Plant care delivery</span><span>{shipping ? `$${shipping.toFixed(2)}` : 'Free'}</span></div>
            <div className="flex justify-between border-t border-white/10 pt-4 text-base font-semibold text-ivory"><span>Total</span><span>${total.toFixed(2)}</span></div>
          </div>
          {checkoutError && <p className="mt-5 rounded-xl border border-rose-300/40 bg-rose-100/10 px-3 py-2 text-xs text-rose-100">{checkoutError}</p>}
          <button type="button" onClick={handleCheckout} disabled={isCheckingOut} className="mt-7 w-full rounded-full bg-[#d7c59c] px-5 py-4 text-sm font-semibold text-forest transition hover:-translate-y-0.5 hover:bg-[#e4d5a8] disabled:cursor-not-allowed disabled:opacity-60">{isCheckingOut ? 'Placing order...' : user ? 'Place order' : 'Sign in to checkout'}</button>
          <Link to="/shop" className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-ivory/70 transition hover:text-[#d7c59c]"><ArrowLeft size={13} /> Continue shopping</Link>
        </aside>
      </div>
    </div>
  </Container></main>
}

export default CartPage
