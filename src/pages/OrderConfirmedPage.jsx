import { ArrowRight, CheckCircle2, Leaf, Sparkles, ShoppingBag } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const OrderConfirmedPage = () => {
  const location = useLocation()
  const orderState = location.state ?? {}
  const orderId = orderState.orderId ? String(orderState.orderId).slice(-6).toUpperCase() : 'NEW'
  const total = Number(orderState.total ?? 0).toFixed(2)
  const itemCount = Number(orderState.itemCount ?? 0)

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7f3eb_0%,_#edf4ee_35%,_#edf0e7_100%)] px-4 pb-20 pt-28 text-forest sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="overflow-hidden rounded-[2rem] border border-forest/10 bg-white/80 shadow-[0_35px_90px_rgba(27,58,42,0.1)] backdrop-blur">
          <div className="border-b border-forest/10 bg-[#edf5ee] px-6 py-5 sm:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Order confirmation</p>
                <h1 className="mt-2 font-display text-4xl italic text-forest sm:text-5xl">Your plant ritual is on its way.</h1>
              </div>
              <div className="hidden rounded-full border border-forest/15 bg-white/70 p-3 text-fern sm:block">
                <CheckCircle2 size={28} />
              </div>
            </div>
          </div>

          <div className="grid gap-8 px-6 py-8 sm:px-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full bg-[#edf5ee] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-fern">
                <Sparkles size={14} /> Ready for dispatch
              </div>

              <p className="mt-6 text-sm leading-7 text-forest/65">
                Thanks for choosing Eden Flora. Your order has been created successfully and our greenhouse team has started preparing your plants with care notes and delivery updates.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-forest/10 bg-[#f8f5ee] p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-gold">Order</p>
                  <p className="mt-2 font-display text-2xl text-forest">#{orderId}</p>
                </div>
                <div className="rounded-2xl border border-forest/10 bg-[#f8f5ee] p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-gold">Items</p>
                  <p className="mt-2 font-display text-2xl text-forest">{itemCount}</p>
                </div>
                <div className="rounded-2xl border border-forest/10 bg-[#f8f5ee] p-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-gold">Total</p>
                  <p className="mt-2 font-display text-2xl text-forest">${total}</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-forest px-5 py-3 text-sm font-semibold text-ivory transition hover:bg-fern">
                  View dashboard <ArrowRight size={15} />
                </Link>
                <Link to="/shop" className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-ivory px-5 py-3 text-sm font-semibold text-forest transition hover:border-gold hover:text-fern">
                  Continue shopping
                </Link>
              </div>
            </div>

            <aside className="rounded-[1.75rem] border border-forest/10 bg-[#1d3c2b] p-6 text-ivory">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[#dce7b5]">
                <Leaf size={14} /> Greenhouse notes
              </div>

              <ul className="mt-6 space-y-4 text-sm text-ivory/80">
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Your plant care guide is being prepared for your inbox.
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Tracking updates will arrive after the plants are packed.
                </li>
                <li className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Need a quick care check? Your dashboard keeps the details handy.
                </li>
              </ul>

              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-[#dce7b5]">
                <ShoppingBag size={16} />
                <span>Planting your new rhythm.</span>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  )
}

export default OrderConfirmedPage
