import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const QuoteCard = () => (
  <motion.aside
    initial={{ opacity: 0, y: 24, rotate: 2 }}
    whileInView={{ opacity: 1, y: 0, rotate: -2 }}
    viewport={{ once: true, amount: 0.35 }}
    transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
    animate={{ y: [0, -7, 0] }}
    className="absolute -bottom-8 -right-4 z-20 max-w-56 rounded-2xl border border-white/60 bg-ivory/70 p-5 shadow-[0_18px_45px_rgba(27,58,42,0.14)] backdrop-blur-xl sm:-right-10 sm:max-w-64 sm:p-6"
  >
    <Quote size={18} strokeWidth={1} className="mb-4 text-gold" />
    <p className="font-display text-2xl leading-[0.95] text-forest">“Every plant begins a conversation.”</p>
    <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.2em] text-forest/45">A living point of view</p>
  </motion.aside>
)

export default QuoteCard
