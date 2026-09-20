import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import PassportIcon from './PassportIcon'

const CareHistory = ({ history }) => <section>
  <div className="mb-7"><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">The care log</p><h2 className="mt-2 font-display text-5xl text-forest">Care history</h2></div>
  <div className="grid gap-3">{history.map((entry, index) => <motion.div key={`${entry.type}-${entry.date}`} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="flex items-center gap-4 rounded-2xl border border-forest/10 bg-white/60 p-4 shadow-[0_10px_25px_rgba(27,58,42,0.04)]"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-sage text-fern"><PassportIcon name={entry.icon} /></span><div className="min-w-0 flex-1"><h3 className="font-display text-2xl text-forest">{entry.type}</h3><p className="truncate text-xs text-forest/50">{entry.detail}</p></div><div className="text-right"><CalendarDays className="ml-auto mb-1 text-gold" size={14} strokeWidth={1.4} /><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-forest/45">{entry.date}</p></div></motion.div>)}</div>
</section>

export default CareHistory
