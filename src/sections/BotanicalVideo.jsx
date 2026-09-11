import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Play } from 'lucide-react'
import Container from '../components/Container'

const BotanicalVideo = () => {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const [ready, setReady] = useState(false)
  const isInView = useInView(sectionRef, { once: false, amount: 0.35 })

  return <section ref={sectionRef} className="relative overflow-hidden bg-forest py-20 sm:py-28">
    <Container>
      <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 1 }} className="mb-10 flex flex-wrap items-end justify-between gap-6 text-ivory">
        <div><p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-gold">A living point of view</p><h2 className="max-w-xl font-display text-5xl leading-[0.9] sm:text-6xl">Slow down. Look closer.</h2></div>
        <p className="max-w-xs text-sm leading-7 text-ivory/55">A glimpse into the quiet rhythm behind every plant we bring home.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.2 }} className="group relative aspect-video overflow-hidden rounded-[1rem_8rem_1rem_8rem] border border-ivory/15 bg-black shadow-[0_25px_70px_rgba(0,0,0,0.28)] sm:rounded-[1rem_12rem_1rem_12rem]">
        <video ref={videoRef} autoPlay muted loop playsInline preload="metadata" onCanPlay={(event) => { setReady(true); if (isInView) event.currentTarget.play() }} className="h-full w-full object-cover opacity-90 transition duration-1000 group-hover:scale-[1.02]" aria-label="Slow botanical greenhouse video">
          <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
        </video>
        {!ready && <div className="absolute inset-0 grid place-items-center bg-forest"><div className="text-center"><svg viewBox="0 0 50 72" className="mx-auto h-14 w-10 text-gold" fill="none" aria-label="Loading botanical film"><path className="stem-loader" d="M25 68C25 45 25 23 25 6M25 34C16 26 10 24 5 25M25 45C34 36 40 34 46 35" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /><path d="M5 25C13 19 19 22 25 34C16 34 9 31 5 25ZM46 35C38 28 31 31 25 45C34 45 42 42 46 35Z" fill="currentColor" opacity=".7" /></svg><p className="mt-3 text-[9px] font-bold uppercase tracking-[0.22em] text-ivory/60">Growing the view</p></div></div>}
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-forest/60 via-transparent to-ivory/10" />
        <div className="absolute inset-x-6 bottom-6 flex items-center justify-between text-ivory sm:inset-x-10 sm:bottom-9"><span className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.24em] text-ivory/80"><span className="grid size-9 place-items-center rounded-full border border-ivory/45 bg-ivory/10 backdrop-blur"><Play size={12} fill="currentColor" /></span>Greenhouse / 01</span><span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold">Sound off</span></div>
      </motion.div>
    </Container>
  </section>
}

export default BotanicalVideo
