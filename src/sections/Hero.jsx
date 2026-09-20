import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Leaf } from 'lucide-react'
import Container from '../components/Container'
import MagneticButton from '../components/MagneticButton'
import BackgroundDecor from './BackgroundDecor'
import FloatingLeaves from './FloatingLeaves'

const ease = [0.22, 1, 0.36, 1]
const revealLine = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease } } }

const LeafFrame = () => <div className="pointer-events-none absolute inset-0 z-10 hidden sm:block" aria-hidden="true">
  <span className="absolute -left-8 top-16 h-24 w-11 rotate-[-34deg] rounded-[100%_0_100%_0] bg-fern/20 blur-[0.2px]" />
  <span className="absolute -left-2 top-7 h-16 w-8 rotate-[-8deg] rounded-[100%_0_100%_0] bg-fern/12" />
  <span className="absolute -right-7 bottom-28 h-28 w-12 rotate-38 rounded-[100%_0_100%_0] bg-fern/18" />
  <span className="absolute right-8 bottom-10 h-16 w-8 rotate-70 rounded-[100%_0_100%_0] bg-gold/22" />
</div>

const Hero = () => {
  const sectionRef = useRef(null)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 45, damping: 22, mass: 0.8 })
  const smoothY = useSpring(pointerY, { stiffness: 45, damping: 22, mass: 0.8 })
  const imageX = useTransform(smoothX, [-1, 1], [-15, 15])
  const imageY = useTransform(smoothY, [-1, 1], [-12, 12])
  const leafX = useTransform(smoothX, [-1, 1], [-8, 8])
  const glowX = useTransform(smoothX, [-1, 1], ['44%', '56%'])
  const glowY = useTransform(smoothY, [-1, 1], ['42%', '58%'])

  const handlePointerMove = (event) => {
    if (!sectionRef.current) return
    const bounds = sectionRef.current.getBoundingClientRect()
    pointerX.set((event.clientX - bounds.left) / bounds.width * 2 - 1)
    pointerY.set((event.clientY - bounds.top) / bounds.height * 2 - 1)
  }

  const resetPointer = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <section ref={sectionRef} id="home" onPointerMove={handlePointerMove} onPointerLeave={resetPointer} className="relative flex min-h-[100svh] items-center overflow-hidden bg-linear-to-br from-ivory via-sage/45 to-[#dce8d7] pt-20">
      <div className="grain-overlay pointer-events-none absolute inset-0 z-30 opacity-[0.06]" aria-hidden="true" />
      <BackgroundDecor parallaxX={useTransform(smoothX, [-1, 1], [-5, 5])} parallaxY={useTransform(smoothY, [-1, 1], [-4, 4])} />
      <motion.div style={{ left: glowX, top: glowY }} className="pointer-events-none absolute z-0 size-112 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f6f1dd]/80 blur-3xl" />
      <FloatingLeaves parallaxX={leafX} />

      <Container className="relative z-20 grid items-center gap-12 py-12 sm:py-16 lg:min-h-[calc(100svh-5rem)] lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-10 lg:py-12">
        <motion.div className="relative z-20 max-w-xl lg:max-w-2xl" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.16, delayChildren: 0.25 } } }}>
          <motion.p variants={{ hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } } }} className="tracking-label mb-7 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.28em] text-gold"><span className="h-px w-8 bg-gold" />Thoughtfully grown</motion.p>
          <h1 className="font-display text-[clamp(3.75rem,7vw,7.5rem)] leading-[0.84] tracking-[-0.03em] text-forest">
            <motion.span className="block" variants={revealLine}>Bring the</motion.span>
            <motion.span className="block" variants={revealLine}><em className="font-normal text-fern">outside</em> in.</motion.span>
          </h1>
          <motion.p variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }} className="mt-8 max-w-sm text-sm leading-7 text-forest/65">Curated botanicals for considered spaces. Discover a slower, greener way to live beautifully.</motion.p>
          <motion.div variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }} className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton href="#shop">Explore the collection</MagneticButton>
            <a href="#story" className="group inline-flex items-center gap-3 rounded-full border border-forest/25 px-5 py-3.5 text-sm font-medium text-forest transition-all duration-300 hover:-translate-y-1 hover:border-fern hover:bg-ivory/50"><span>Our philosophy</span><span className="text-fern transition-transform duration-300 group-hover:translate-x-1">→</span></a>
            <a href="#test-drive" className="text-xs font-bold uppercase tracking-[0.16em] text-fern underline-offset-4 hover:underline">Test every feature</a>
          </motion.div>
        </motion.div>

        <motion.div style={{ x: imageX, y: imageY }} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.3, delay: 0.35, ease }} className="relative mx-auto w-full max-w-175 lg:ml-auto lg:max-w-none">
          <LeafFrame />
          <motion.div animate={{ rotate: [0, 1.2, 0], scale: [1, 1.012, 1] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }} className="absolute -right-4 top-1/4 size-24 rounded-full border border-gold/40 sm:-right-10 sm:size-36" />
          <div className="relative aspect-[0.92] overflow-hidden rounded-[10rem_10rem_1rem_1rem] bg-[#d7e2d0] shadow-[20px_30px_60px_rgba(27,58,42,0.14)] transition-transform duration-700 hover:scale-[1.012]">
            <img className="h-full w-full object-cover transition-transform duration-1400 ease-out hover:scale-[1.04]" src="https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=85" alt="Lush green houseplant in a sunlit interior" />
            <div className="absolute inset-0 bg-linear-to-t from-forest/20 via-transparent to-ivory/10" />
          </div>
          <motion.div animate={{ y: [0, -7, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-6 -left-5 flex size-24 items-center justify-center rounded-3xl border border-white/50 bg-ivory/60 shadow-[0_16px_35px_rgba(27,58,42,0.14)] backdrop-blur-xl sm:-left-10 sm:size-32"><div className="text-center"><span className="font-display text-3xl text-fern">01</span><span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.2em] text-forest/50">of 04</span></div></motion.div>
        </motion.div>

        <motion.a href="#story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5, duration: 1 }} className="absolute bottom-8 left-6 hidden items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-forest/50 sm:flex lg:left-16"><span className="relative flex h-8 w-4 items-start justify-center"><span className="absolute top-0 h-7 w-px bg-forest/30" /><motion.span animate={{ y: [0, 16, 0], opacity: [0, 1, 0] }} transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-0 h-2 w-px bg-fern" /></span><Leaf size={13} strokeWidth={1.2} /> Scroll to discover</motion.a>
      </Container>
    </section>
  )
}

export default Hero
