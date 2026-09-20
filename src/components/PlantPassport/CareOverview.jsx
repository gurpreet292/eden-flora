import { motion } from 'framer-motion'
import { Droplets, HeartPulse, Sun, Waves } from 'lucide-react'

const careItems = [
  ['water', 'Water level', Droplets, 'water'],
  ['light', 'Sunlight', Sun, 'gold'],
  ['humidity', 'Humidity', Waves, 'fern'],
  ['health', 'Health score', HeartPulse, 'gold'],
]

const CareOverview = ({ passport }) => <section>
  <div className="mb-7 flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">Current condition</p><h2 className="mt-2 font-display text-5xl text-forest">Care overview</h2></div><p className="hidden max-w-xs text-right text-xs leading-6 text-forest/50 sm:block">A quiet snapshot of what your plant needs to keep growing beautifully.</p></div>
  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
    {careItems.map(([key, label, Icon, color], index) => <motion.div key={key} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} className="rounded-2xl border border-forest/10 bg-white/60 p-4 shadow-[0_14px_35px_rgba(27,58,42,0.05)] backdrop-blur sm:p-5">
      <div className="relative mx-auto grid size-24 place-items-center sm:size-28"><svg className="absolute inset-0 size-full -rotate-90" viewBox="0 0 100 100"><circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="5" className="text-forest/8" /><motion.circle initial={{ pathLength: 0 }} whileInView={{ pathLength: passport[key] / 100 }} viewport={{ once: true }} transition={{ duration: 1.1, delay: index * 0.08 }} cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className={color === 'gold' ? 'text-gold' : 'text-fern'} /></svg><div className="text-center"><Icon size={17} className="mx-auto mb-1 text-fern" strokeWidth={1.4} /><strong className="font-display text-3xl text-forest">{passport[key]}%</strong></div></div><p className="mt-4 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-forest/55">{label}</p>
    </motion.div>)}
  </div>
</section>

export default CareOverview
