import { motion } from 'framer-motion'
import { MapPin, ShieldCheck } from 'lucide-react'
import { formatPassportDate } from '../../data/plantPassport'

const qrPattern = ['111001101', '100101001', '101111101', '001010010', '111011111', '100110001', '101111101', '100001001', '111101111']

const PlantPassportCard = ({ product, passport, age }) => (
  <motion.article initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative overflow-hidden rounded-[2rem] bg-forest text-ivory shadow-[0_30px_80px_rgba(27,58,42,0.24)]">
    <div className="absolute -right-24 -top-28 size-72 rounded-full border border-gold/20" />
    <div className="absolute -bottom-36 -left-16 size-72 rounded-full bg-fern/35 blur-3xl" />
    <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-[1.05fr_0.95fr] lg:p-12">
      <div className="flex flex-col justify-between gap-10">
        <div className="flex items-start justify-between gap-4 border-b border-ivory/15 pb-5">
          <div><p className="text-[9px] font-bold uppercase tracking-[0.28em] text-gold">Eden Flora / plant passport</p><p className="mt-3 font-display text-3xl italic text-ivory/90">A living record</p></div>
          <ShieldCheck className="text-gold" size={25} strokeWidth={1.2} />
        </div>
        <div><p className="text-[10px] uppercase tracking-[0.22em] text-ivory/50">Registered plant</p><h2 className="mt-3 max-w-lg font-display text-6xl leading-[0.86] sm:text-7xl">{product.name}</h2><p className="mt-5 text-sm italic text-ivory/60">{passport.species}</p></div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-7 border-t border-ivory/15 pt-6 sm:grid-cols-3">
          <div><p className="text-[9px] uppercase tracking-[0.2em] text-ivory/45">Plant ID</p><p className="mt-2 text-sm font-semibold tracking-[0.14em] text-gold">{passport.plantId}</p></div>
          <div><p className="text-[9px] uppercase tracking-[0.2em] text-ivory/45">Plant birthday</p><p className="mt-2 text-sm font-medium">{formatPassportDate(passport.purchaseDate)}</p></div>
          <div><p className="text-[9px] uppercase tracking-[0.2em] text-ivory/45">Age</p><p className="mt-2 text-sm font-medium">{age.years ? `${age.years} yr${age.years > 1 ? 's' : ''}` : `${age.months} mo`}</p></div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center rounded-[1.5rem] border border-ivory/15 bg-ivory/[0.07] p-7 text-center backdrop-blur-md sm:p-10">
        <div className="grid size-40 grid-cols-9 gap-1 rounded-xl bg-ivory p-4 shadow-xl sm:size-48" aria-label={`QR placeholder for ${passport.plantId}`}>
          {qrPattern.flatMap((row, rowIndex) => [...row].map((cell, cellIndex) => <span key={`${rowIndex}-${cellIndex}`} className={cell === '1' ? 'bg-forest' : 'bg-transparent'} />))}
        </div>
        <p className="mt-5 font-mono text-xs tracking-[0.3em] text-gold">{passport.plantId}</p>
        <p className="mt-2 text-[9px] uppercase tracking-[0.22em] text-ivory/45">Scan to verify its story</p>
        <div className="mt-8 flex items-center gap-2 text-[10px] text-ivory/55"><MapPin size={13} className="text-gold" /> {passport.origin}</div>
      </div>
    </div>
  </motion.article>
)

export default PlantPassportCard
