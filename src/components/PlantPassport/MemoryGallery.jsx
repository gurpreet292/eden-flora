import { motion } from 'framer-motion'
import { Camera } from 'lucide-react'
import { formatPassportDate } from '../../data/plantPassport'

const getMemoryImage = (image) => image.startsWith('http') || image.startsWith('/') ? image : `https://images.unsplash.com/${image}?auto=format&fit=crop&w=700&q=85`

const MemoryGallery = ({ memories }) => <section>
  <div className="mb-8 flex items-end justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.28em] text-gold">Little moments</p><h2 className="mt-2 font-display text-5xl text-forest">Memory gallery</h2></div><Camera className="text-fern/35" size={24} strokeWidth={1.2} /></div>
  <div className="grid gap-6 sm:grid-cols-3">{memories.map((memory, index) => <motion.figure key={memory.caption} initial={{ opacity: 0, rotate: index % 2 ? 2 : -2, y: 20 }} whileInView={{ opacity: 1, rotate: index % 2 ? 1 : -1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white p-3 pb-5 shadow-[0_15px_35px_rgba(27,58,42,0.1)]"><div className="aspect-[0.9] overflow-hidden bg-sage"><img src={getMemoryImage(memory.image)} alt={memory.caption} className="h-full w-full object-cover transition duration-700 hover:scale-105" /></div><figcaption className="px-2 pt-4"><p className="font-display text-2xl text-forest">{memory.caption}</p><p className="mt-1 text-[9px] font-bold uppercase tracking-[0.16em] text-gold">{formatPassportDate(memory.date)}</p></figcaption></motion.figure>)}</div>
</section>

export default MemoryGallery
