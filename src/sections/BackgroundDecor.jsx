import { motion } from 'framer-motion'

const BackgroundDecor = ({ parallaxX, parallaxY }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
    <div className="absolute inset-0 opacity-70" style={{ background: 'radial-gradient(circle at 75% 40%, rgba(238,244,234,0.95), transparent 35%), radial-gradient(circle at 18% 85%, rgba(199,168,109,0.10), transparent 30%)' }} />
    <motion.div style={{ x: parallaxX, y: parallaxY }} className="absolute -left-36 top-16 size-108 rounded-full bg-[#dbe8d6]/70 blur-3xl" />
    <motion.div style={{ x: parallaxX, y: parallaxY }} transition={{ duration: 1 }} className="absolute -bottom-48 -right-32 size-144 rounded-full bg-fern/10 blur-3xl" />
    <div className="absolute inset-0 opacity-[0.14]" style={{ backgroundImage: 'radial-gradient(rgba(27,58,42,0.32) 0.7px, transparent 0.7px)', backgroundSize: '18px 18px', maskImage: 'linear-gradient(to bottom, transparent, black 35%, transparent)' }} />
  </div>
)

export default BackgroundDecor
