import { motion } from 'framer-motion'
import PassportIcon from './PassportIcon'

const PlantJourney = ({ milestones }) => <section>
  <div className="mb-8"><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">Every chapter matters</p><h2 className="mt-2 font-display text-5xl text-forest">Plant journey</h2></div>
  <div className="relative ml-2 border-l border-fern/20 pl-8 sm:ml-5 sm:pl-12">
    {milestones.map((milestone, index) => <motion.article key={`${milestone.title}-${index}`} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ delay: index * 0.08 }} className={`relative mb-5 rounded-2xl border p-5 transition-shadow last:mb-0 sm:p-6 ${milestone.future ? 'border-dashed border-gold/40 bg-gold/[0.05]' : 'border-forest/10 bg-white/55 shadow-[0_12px_30px_rgba(27,58,42,0.04)]'}`}>
      <span className="absolute -left-[3.1rem] top-6 grid size-9 place-items-center rounded-full border-4 border-ivory bg-fern text-ivory sm:-left-[4.1rem]"><PassportIcon name={milestone.icon} size={15} /></span><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold">{milestone.date}</p><h3 className="mt-2 font-display text-3xl text-forest">{milestone.title}</h3></div>{milestone.future && <span className="rounded-full bg-gold/15 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-fern">Next chapter</span>}</div><p className="mt-2 text-xs leading-6 text-forest/55">{milestone.detail}</p>
    </motion.article>)}
  </div>
</section>

export default PlantJourney
