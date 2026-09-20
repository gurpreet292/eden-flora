import { useEffect, useState } from 'react'
import { BadgeCheck, CalendarRange, Leaf, ShieldCheck, ShoppingBag } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const DashboardPage = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/orders').then((response) => setOrders(response.data.orders)).catch(() => setOrders([])).finally(() => setLoading(false))
  }, [])

  const stats = [
    { label: 'Care plan', value: 'Premium', icon: BadgeCheck },
    { label: 'Orders', value: orders.length, icon: ShoppingBag },
    { label: 'This month', value: `${orders.filter((order) => new Date(order.createdAt).getMonth() === new Date().getMonth()).length} orders`, icon: CalendarRange },
    { label: 'Member tier', value: 'Greenhouse', icon: Leaf },
  ]

  return <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8f3e8_0%,_#edf5ef_33%,_#ebf1e7_100%)] px-4 pb-20 pt-28 text-forest sm:px-6"><div className="mx-auto max-w-6xl"><div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-forest/10 bg-white/75 p-6 shadow-[0_30px_90px_rgba(27,58,42,0.1)] backdrop-blur md:flex-row md:items-end md:justify-between"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Member dashboard</p><h1 className="mt-2 font-display text-4xl italic text-forest md:text-5xl">Welcome back, {user?.name?.split(' ')[0] || 'gardener'}.</h1></div><div className="inline-flex items-center gap-2 rounded-full border border-forest/10 bg-[#edf5ee] px-3 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-forest/70"><ShieldCheck size={14} /> Verified member</div></div><div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{stats.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-[1.75rem] border border-forest/10 bg-white/80 p-5 shadow-[0_25px_70px_rgba(27,58,42,0.08)]"><div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef5ee] text-forest"><Icon size={18} /></div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-forest/50">{label}</p><p className="mt-3 text-2xl font-semibold text-forest">{value}</p></div>)}</div><aside className="mt-8 rounded-[2rem] border border-forest/10 bg-[#1d3c2b] p-6 text-ivory shadow-[0_25px_70px_rgba(27,58,42,0.18)]"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#dce7b5]">Profile</p><div className="mt-6 inline-grid size-14 place-items-center rounded-full bg-white/10 text-2xl font-semibold text-[#dce7b5]">{user?.name?.charAt(0).toUpperCase() || 'U'}</div><h2 className="mt-5 text-2xl font-semibold">{user?.name || 'Plant lover'}</h2><p className="mt-1 text-sm text-ivory/70">{user?.email || 'you@example.com'}</p></aside><section className="mt-6 rounded-[2rem] border border-forest/10 bg-white/80 p-6 shadow-[0_25px_70px_rgba(27,58,42,0.08)]"><div className="flex items-center justify-between gap-4"><h2 className="font-display text-3xl italic text-forest">Order history</h2><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-forest/45">Private account data</span></div>{loading ? <p className="mt-6 text-sm text-forest/55">Loading your orders...</p> : orders.length === 0 ? <p className="mt-6 text-sm text-forest/55">Your first plant order will appear here.</p> : <div className="mt-6 divide-y divide-forest/10 border-y border-forest/10">{orders.map((order) => <article key={order._id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-semibold text-forest">Order #{String(order._id).slice(-6)}</p><p className="mt-1 text-xs text-forest/55">{new Date(order.createdAt).toLocaleDateString()} · {order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p></div><div className="flex items-center gap-5"><span className="rounded-full bg-gold/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-gold">{order.status}</span><span className="font-semibold text-forest">${Number(order.total).toFixed(2)}</span></div></article>)}</div>}</section></div></main>
}

export default DashboardPage
