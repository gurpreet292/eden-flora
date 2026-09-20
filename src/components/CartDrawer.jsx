import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useStore } from '../hooks/useStore'
import { getProductImage } from '../data/products'

const CartDrawer = ({ open, onClose }) => {
  const { cart, subtotal, updateQuantity, removeFromCart } = useStore()

  return (
    <div className={`fixed inset-0 z-[120] transition ${open ? 'pointer-events-auto' : 'pointer-events-none'}`} aria-hidden={!open}>
      <div onClick={onClose} className={`absolute inset-0 bg-forest/35 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} />

      <aside
        className={`absolute right-0 top-0 z-10 flex h-full w-full max-w-[28rem] flex-col border-l border-forest/10 bg-ivory p-5 shadow-[-20px_0_60px_rgba(27,58,42,0.18)] transition-transform duration-500 sm:p-7 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-label="Garden bag"
      >
        <div className="flex shrink-0 items-start justify-between border-b border-forest/10 pb-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-gold">Your garden bag</p>
            <h2 className="mt-2 font-display text-3xl text-forest">Growing nicely.</h2>
            <p className="mt-2 text-xs text-forest/55">
              {cart.length ? `${cart.length} ${cart.length === 1 ? 'plant' : 'plants'} selected` : 'Your bag is ready for something living.'}
            </p>
          </div>
          <button onClick={onClose} aria-label="Close garden bag" className="grid size-10 shrink-0 place-items-center rounded-full bg-sage text-forest transition hover:bg-fern hover:text-ivory">
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto py-2">
          {cart.length ? (
            cart.map((item) => (
              <article key={item.id} className="flex gap-4 border-b border-forest/10 py-5">
                <img src={getProductImage(item, 240)} alt={item.name} className="size-20 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-gold">{item.category}</p>
                      <p className="mt-1 font-display text-xl leading-tight text-forest">{item.name}</p>
                    </div>
                    <p className="shrink-0 text-sm font-semibold text-forest">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>

                  <p className="mt-1 text-xs text-forest/50">${item.price.toFixed(2)} each</p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center rounded-full border border-forest/15 bg-ivory">
                      <button aria-label={`Decrease ${item.name}`} onClick={() => updateQuantity(item.id, item.quantity - 1)} className="grid size-8 place-items-center hover:text-fern">
                        <Minus size={13} />
                      </button>
                      <span className="w-7 text-center text-xs">{item.quantity}</span>
                      <button aria-label={`Increase ${item.name}`} onClick={() => updateQuantity(item.id, item.quantity + 1)} className="grid size-8 place-items-center hover:text-fern">
                        <Plus size={13} />
                      </button>
                    </div>

                    <button onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name}`} className="text-forest/40 transition hover:text-red-800">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="flex h-full min-h-48 items-center justify-center text-center">
              <div>
                <ShoppingBag size={28} className="mx-auto text-gold" />
                <p className="mt-5 font-display text-2xl text-forest">No plants yet.</p>
                <p className="mt-2 text-xs text-forest/55">Pick something living and we’ll keep it close.</p>
              </div>
            </div>
          )}
        </div>

        {cart.length ? (
          <div className="mt-4 shrink-0 border-t border-forest/10 pt-5">
            <div className="mb-5 flex items-center justify-between text-sm">
              <span className="text-forest/55">Subtotal</span>
              <span className="font-semibold text-forest">${subtotal.toFixed(2)}</span>
            </div>
            <Link to="/cart" onClick={onClose} className="flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3.5 text-sm font-semibold text-ivory transition hover:bg-fern">
              View bag <ArrowRight size={15} />
            </Link>
          </div>
        ) : null}
      </aside>
    </div>
  )
}

export default CartDrawer
