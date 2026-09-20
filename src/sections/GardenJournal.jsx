import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight, BookOpen, X } from 'lucide-react'
import Container from '../components/Container'
import SectionTitle from '../components/SectionTitle'
import { journalStories } from '../data/editorial'

const JournalReader = ({ story, onClose }) => <AnimatePresence>{story && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-100 grid place-items-center bg-forest/55 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
  <motion.article initial={{ opacity: 0, y: 24, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: 0.98 }} transition={{ duration: 0.35 }} role="dialog" aria-modal="true" aria-labelledby="journal-reader-title" className="relative max-h-[90svh] w-full max-w-4xl overflow-y-auto rounded-[1.25rem_5rem_1.25rem_5rem] bg-[#f8f6ee] p-3 shadow-2xl sm:p-5">
    <button type="button" onClick={onClose} aria-label="Close journal reader" className="absolute right-7 top-7 z-10 grid size-10 place-items-center rounded-full bg-sage text-forest transition hover:bg-gold"><X size={17} /></button>
    <div className="grid overflow-hidden rounded-[0.85rem_4rem_0.85rem_4rem] bg-sage/55 md:grid-cols-2">
      <div className="min-h-72"><img src={story.image} alt="" className="h-full w-full object-cover" /></div>
      <div className="flex min-h-72 flex-col justify-between p-8 sm:p-12"><div><span className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.24em] text-gold"><BookOpen size={14} /> Eden Journal / 01</span><p className="mt-10 text-[10px] font-bold uppercase tracking-[0.2em] text-fern">{story.eyebrow}</p><h2 id="journal-reader-title" className="mt-3 font-display text-4xl leading-[0.92] text-forest sm:text-5xl">{story.title}</h2><p className="mt-7 text-sm leading-7 text-forest/65">{story.read}</p></div><button type="button" onClick={onClose} className="mt-10 inline-flex items-center gap-2 self-start text-[10px] font-bold uppercase tracking-[0.18em] text-fern transition hover:text-forest"><ArrowLeft size={14} /> Back to the journal</button></div>
    </div>
  </motion.article>
</motion.div>}</AnimatePresence>

const GardenJournal = () => {
  const [activeStory, setActiveStory] = useState(null)

  return <section className="bg-ivory py-24 sm:py-32"><Container><div className="flex flex-wrap items-end justify-between gap-6"><SectionTitle eyebrow="From the greenhouse" title="Notes for a more considered life." description="Growing guides, room stories, and small reminders to make space for what restores you." /><span className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-forest/45"><BookOpen size={15} className="text-gold" /> Eden journal</span></div><div className="mt-14 grid gap-8 md:grid-cols-3">{journalStories.map((story, index) => <motion.article key={story.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.7, delay: index * 0.12 }} className="group"><button type="button" onClick={() => setActiveStory(story)} className="block w-full text-left"><div className="relative aspect-[1.08] overflow-hidden rounded-[1rem_4rem_1rem_4rem] bg-sage"><img src={story.image} alt={story.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /><div className="pointer-events-none absolute inset-0 bg-linear-to-t from-forest/25 via-transparent to-sage/10" /><span className="absolute left-5 top-5 grid size-9 place-items-center rounded-full bg-ivory/90 text-forest"><span className="font-display text-lg">0{index + 1}</span></span><span className="absolute bottom-5 right-5 grid size-10 place-items-center rounded-full bg-ivory/90 text-forest opacity-0 transition duration-300 group-hover:opacity-100"><BookOpen size={16} /></span></div><p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gold">{story.eyebrow}</p><h3 className="mt-2 max-w-xs font-display text-3xl leading-none text-forest">{story.title}</h3><p className="mt-3 max-w-sm text-sm leading-6 text-forest/55">{story.summary}</p><span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-fern">Open the journal <ArrowUpRight size={14} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></span></button></motion.article>)}</div></Container><JournalReader story={activeStory} onClose={() => setActiveStory(null)} /></section>
}

export default GardenJournal
