import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { Music, VolumeX } from 'lucide-react'
import Container from '../components/Container'

const BotanicalVideo = () => {
  const sectionRef = useRef(null)
  const videoRef = useRef(null)
  const audioContextRef = useRef(null)
  const tuneTimerRef = useRef(null)
  const [ready, setReady] = useState(false)
  const [isTunePlaying, setIsTunePlaying] = useState(false)
  const isInView = useInView(sectionRef, { once: false, amount: 0.35 })

  const stopTune = () => {
    if (tuneTimerRef.current) window.clearInterval(tuneTimerRef.current)
    tuneTimerRef.current = null
    audioContextRef.current?.close()
    audioContextRef.current = null
    setIsTunePlaying(false)
  }

  useEffect(() => stopTune, [])

  const toggleTune = () => {
    if (isTunePlaying) return stopTune()
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const context = new AudioContext()
    const rustleBuffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate)
    const rustleData = rustleBuffer.getChannelData(0)
    for (let index = 0; index < rustleData.length; index += 1) rustleData[index] = (Math.random() * 2 - 1) * 0.35
    const rustle = context.createBufferSource()
    const rustleFilter = context.createBiquadFilter()
    const rustleGain = context.createGain()
    rustle.buffer = rustleBuffer
    rustle.loop = true
    rustleFilter.type = 'lowpass'
    rustleFilter.frequency.value = 720
    rustleFilter.Q.value = 0.45
    rustleGain.gain.value = 0.012
    rustle.connect(rustleFilter).connect(rustleGain).connect(context.destination)
    rustle.start()

    const playPetal = (frequency, start, duration = 2.4) => {
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.type = 'sine'
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.018, start + 0.18)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(start)
      oscillator.stop(start + duration + 0.1)
    }
    const playGardenPhrase = () => {
      const start = context.currentTime + 0.08
      ;[196, 246.94, 293.66, 369.99, 293.66].forEach((note, index) => playPetal(note, start + index * 1.1))
    }
    audioContextRef.current = context
    playGardenPhrase()
    tuneTimerRef.current = window.setInterval(playGardenPhrase, 6200)
    setIsTunePlaying(true)
  }

  return <section ref={sectionRef} className="relative overflow-hidden bg-forest py-20 sm:py-28">
    <div className="pointer-events-none absolute -left-24 top-1/2 size-80 -translate-y-1/2 rounded-full border border-gold/15" />
    <div className="pointer-events-none absolute -right-32 top-12 size-96 rounded-full bg-fern/30 blur-3xl" />
    <Container className="relative">
      <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 1 }} className="mb-10 flex flex-wrap items-end justify-between gap-6 text-ivory">
        <div><p className="mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-gold">A living point of view</p><h2 className="max-w-xl font-display text-5xl leading-[0.9] sm:text-6xl">Slow down. Look closer.</h2></div>
        <p className="max-w-xs text-sm leading-7 text-ivory/55">A glimpse into the quiet rhythm behind every plant we bring home.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.2 }} className="relative mx-auto max-w-7xl">
        <span className="pointer-events-none absolute -left-3 top-10 hidden -rotate-90 text-[9px] font-bold uppercase tracking-[0.28em] text-gold/70 lg:block">Field notes / 01</span>
        <span className="pointer-events-none absolute -right-4 -top-4 hidden size-24 rounded-full border border-gold/40 sm:block" />
        <aside className="pointer-events-none absolute -right-24 top-1/2 hidden -translate-y-1/2 items-center gap-4 2xl:flex" aria-hidden="true"><span className="h-24 w-px bg-gold/45" /><span className="max-w-16 text-[9px] font-bold uppercase leading-5 tracking-[0.22em] text-gold/75">Take your time</span></aside>
        <div className="group relative aspect-video overflow-hidden rounded-[1rem_8rem_1rem_8rem] border border-ivory/15 bg-black shadow-[0_25px_70px_rgba(0,0,0,0.28)] sm:rounded-[1rem_12rem_1rem_12rem]">
            <video ref={videoRef} autoPlay muted loop playsInline preload="metadata" onCanPlay={(event) => { setReady(true); if (isInView) event.currentTarget.play() }} className="h-full w-full object-cover opacity-90 transition duration-1000 group-hover:scale-[1.02]" aria-label="Slow botanical greenhouse video">
              <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
            </video>
            {!ready && <div className="absolute inset-0 grid place-items-center bg-forest"><div className="text-center"><svg viewBox="0 0 50 72" className="mx-auto h-14 w-10 text-gold" fill="none" aria-label="Loading botanical film"><path className="stem-loader" d="M25 68C25 45 25 23 25 6M25 34C16 26 10 24 5 25M25 45C34 36 40 34 46 35" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" /><path d="M5 25C13 19 19 22 25 34C16 34 9 31 5 25ZM46 35C38 28 31 31 25 45C34 45 42 42 46 35Z" fill="currentColor" opacity=".7" /></svg><p className="mt-3 text-[9px] font-bold uppercase tracking-[0.22em] text-ivory/60">Growing the view</p></div></div>}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-forest/70 via-transparent to-ivory/10" />
            <div className="absolute bottom-5 left-16 right-5 flex items-center justify-between gap-3 text-ivory sm:bottom-8 sm:left-24 sm:right-8">
              <span className="rounded-full border border-ivory/35 bg-forest/25 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.2em] text-ivory backdrop-blur-md">Greenhouse / 01</span>
              <button type="button" onClick={toggleTune} aria-label={isTunePlaying ? 'Stop garden soundscape' : 'Play garden soundscape'} className="inline-flex items-center gap-2 rounded-full border border-ivory/25 bg-forest/25 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-gold backdrop-blur-md transition hover:bg-ivory/15">{isTunePlaying ? <Music size={12} /> : <VolumeX size={12} />}{isTunePlaying ? 'Garden sound on' : 'Play garden sound'}</button>
            </div>
        </div>
      </motion.div>
    </Container>
  </section>
}

export default BotanicalVideo
