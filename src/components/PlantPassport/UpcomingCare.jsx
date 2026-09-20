import { ArrowUpRight } from 'lucide-react'
import { formatPassportDate } from '../../data/plantPassport'
import PassportIcon from './PassportIcon'

const UpcomingCare = ({ upcoming }) => <section className="rounded-[2rem] bg-sage/70 p-6 sm:p-8"><div className="flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">Stay in rhythm</p><h2 className="mt-2 font-display text-4xl text-forest">Upcoming care</h2></div><ArrowUpRight className="text-fern" size={20} strokeWidth={1.4} /></div><div className="mt-7 grid gap-3">{upcoming.map((item) => <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-white/70 bg-white/55 p-4"><span className="grid size-10 place-items-center rounded-full bg-forest text-ivory"><PassportIcon name={item.icon} size={16} /></span><div className="flex-1"><p className="text-xs font-semibold text-forest">{item.label}</p><p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-forest/45">{formatPassportDate(item.date)}</p></div><p className="text-right text-[10px] font-bold uppercase tracking-[0.12em] text-fern">{item.countdown}</p></div>)}</div></section>

export default UpcomingCare
