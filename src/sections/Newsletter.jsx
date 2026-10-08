import { useState } from 'react'
import { ArrowRight, Camera, Leaf, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/Container'

const Newsletter = () => {
	const [email, setEmail] = useState('')
	const [submitted, setSubmitted] = useState(false)

	const handleSubmit = (event) => {
		event.preventDefault()
		if (!email.trim()) return
		setSubmitted(true)
	}

	return (
		<footer id="contact" className="bg-forest text-ivory">
			<section className="border-b border-ivory/15 py-20 sm:py-28">
				<Container>
					<div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
						<div>
							<p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.28em] text-gold"><Mail size={13} /> A note from the greenhouse</p>
							<h2 className="max-w-lg font-display text-5xl leading-[0.9] sm:text-6xl">Good things take root slowly.</h2>
							<p className="mt-6 max-w-md text-sm leading-7 text-ivory/65">Seasonal plants, thoughtful care notes, and a little more green for your inbox. No noise, just things worth growing.</p>
						</div>

						<div>
							<form onSubmit={handleSubmit} className="flex flex-col gap-3 border-b border-ivory/35 pb-3 sm:flex-row sm:items-center">
								<label htmlFor="newsletter-email" className="sr-only">Email address</label>
								<input
									id="newsletter-email"
									type="email"
									value={email}
									onChange={(event) => {
										setEmail(event.target.value)
										setSubmitted(false)
									}}
									required
									placeholder="Your email address"
									className="min-w-0 flex-1 bg-transparent py-3 text-sm text-ivory outline-none placeholder:text-ivory/45"
								/>
								<button type="submit" className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-ivory px-5 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-forest transition hover:bg-gold sm:self-auto">
									{submitted ? 'You’re on the list' : 'Join the list'} <ArrowRight size={14} />
								</button>
							</form>
							<p className="mt-4 text-[10px] leading-5 text-ivory/45">By subscribing, you agree to receive occasional notes from Eden Flora. Unsubscribe anytime.</p>
						</div>
					</div>

					<div className="mt-14 grid gap-4 border-t border-ivory/10 pt-6 text-[10px] uppercase tracking-[0.16em] text-ivory/55 sm:grid-cols-3">
						<span className="flex items-center gap-2"><Leaf size={14} className="text-gold" /> Carefully sourced plants</span>
						<span className="flex items-center gap-2"><Leaf size={14} className="text-gold" /> Delivered with care</span>
						<span className="flex items-center gap-2"><Leaf size={14} className="text-gold" /> Support when you need it</span>
					</div>
				</Container>
			</section>

			<Container className="flex flex-col gap-8 py-8 sm:flex-row sm:items-center sm:justify-between">
				<Link to="/" className="font-display text-3xl text-ivory">Eden Flora<span className="text-gold">.</span></Link>
				<nav className="flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-bold uppercase tracking-[0.16em] text-ivory/55">
					<Link to="/shop" className="transition hover:text-gold">Shop</Link>
					<Link to="/collections" className="transition hover:text-gold">Collections</Link>
					<Link to="/vault" className="transition hover:text-gold">Botanical vault</Link>
					<Link to="/about" className="transition hover:text-gold">Our story</Link>
				</nav>
				<a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Eden Flora on Instagram" className="grid size-9 place-items-center rounded-full border border-ivory/20 text-ivory/70 transition hover:border-gold hover:text-gold"><Camera size={15} /></a>
			</Container>
		</footer>
	)
}

export default Newsletter
