import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Leaf } from 'lucide-react'
import Container from '../components/Container'
import LuxuryDivider from './LuxuryDivider'
import QuoteCard from './QuoteCard'

const ease = [0.22, 1, 0.36, 1]
const reveal = { hidden: { opacity: 0, y: 22 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }
const stats = [['120+', 'Rare varieties'], ['98%', 'Customer happiness'], ['7 days', 'Plant care support']]

const BrandStory = () => {
	const sectionRef = useRef(null)
	const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
	const imageY = useTransform(scrollYProgress, [0, 1], [26, -26])

	return (
		<section ref={sectionRef} id="story" className="relative overflow-hidden bg-ivory py-28 sm:py-40">
			<div className="pointer-events-none absolute -left-48 top-36 size-128 rounded-full bg-sage/80 blur-3xl" />
			<div className="pointer-events-none absolute -right-40 bottom-0 size-112 rounded-full bg-gold/10 blur-3xl" />
			<div className="pointer-events-none absolute right-[13%] top-24 hidden size-32 rounded-full border border-fern/10 sm:block" />
			<div className="pointer-events-none absolute left-[8%] top-1/3 size-2 rounded-full bg-gold/55 shadow-[0_0_0_7px_rgba(199,168,109,0.08)]" />

			<Container className="relative">
				<div className="grid items-center gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
					<motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={{ visible: { transition: { staggerChildren: 0.14 } }, hidden: {} }} className="order-1 lg:order-1 lg:pb-6">
						<motion.p variants={reveal} className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-gold"><span className="h-px w-8 bg-gold" />Our story</motion.p>
						<motion.h2 variants={reveal} className="max-w-xl font-display text-5xl leading-[0.91] text-forest sm:text-6xl lg:text-[4.7rem]">Nature deserves to be experienced, not simply purchased.</motion.h2>
						<motion.p variants={reveal} className="mt-8 max-w-md text-sm leading-8 text-forest/65">Eden Flora began with a simple belief: the spaces we return to should restore us. We bring peace, greenery, and the small rituals of mindful living into modern homes, one carefully chosen plant at a time.</motion.p>
						<motion.p variants={reveal} className="mt-5 max-w-md text-sm leading-8 text-forest/65">Every living piece is selected for its character, nurtured with patience, and sent into the world ready to become part of your everyday.</motion.p>
						<motion.p variants={reveal} className="mt-9 font-display text-4xl italic text-fern">Eden Flora<span className="text-gold">.</span></motion.p>

						<motion.div variants={reveal} className="mt-10 grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
							{stats.map(([value, label]) => <div key={label} className="group rounded-2xl border border-forest/10 bg-sage/45 px-3 py-4 shadow-[0_8px_24px_rgba(27,58,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/30 hover:bg-sage/75 hover:shadow-[0_14px_30px_rgba(199,168,109,0.12)] sm:px-4"><p className="font-display text-3xl text-fern sm:text-4xl">{value}</p><p className="mt-2 max-w-20 text-[9px] font-bold uppercase leading-4 tracking-[0.12em] text-forest/45">{label}</p></div>)}
						</motion.div>
					</motion.div>

					<motion.div initial={{ opacity: 0, x: 18 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 1.1, ease }} className="relative z-10 order-2 lg:order-2 lg:-ml-16">
						<div className="absolute -left-8 -top-12 hidden text-gold/30 sm:block"><Leaf size={42} strokeWidth={0.7} className="rotate-[-35deg]" /></div>
						<div className="relative overflow-visible rounded-[1rem_8rem_1rem_8rem] bg-sage p-2 shadow-[18px_28px_55px_rgba(27,58,42,0.12)] sm:p-3">
							<motion.div style={{ y: imageY }} className="relative aspect-[0.92] overflow-hidden rounded-[0.75rem_7.5rem_0.75rem_7.5rem] bg-[#d8e3d1]"><img src="https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=85" alt="Sunlit greenhouse filled with lush botanical plants" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-linear-to-t from-forest/15 via-transparent to-ivory/10" /></motion.div>
							<span className="absolute -bottom-5 left-1/4 h-px w-24 rotate-[-16deg] bg-gold/60" />
						</div>
						<QuoteCard />
					</motion.div>

				</div>
				<LuxuryDivider />
			</Container>
		</section>
	)
}

export default BrandStory
