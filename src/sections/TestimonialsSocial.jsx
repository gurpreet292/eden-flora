import { Camera, ChevronLeft, ChevronRight } from 'lucide-react'
import Container from '../components/Container'

const testimonials = [
  {
    quote: 'The plant arrived beautifully presented and has completely changed the feeling of our living room. It feels like a little piece of the garden came home with us.',
    author: 'Ananya R., Delhi',
    detail: 'Monstera deliciosa',
  },
  {
    quote: 'Thoughtful curation, healthy plants, and the kind of service that makes choosing something living feel wonderfully personal.',
    author: 'Meera S., Bengaluru',
    detail: 'The Eden collection',
  },
]

const socialImages = [
  { src: 'https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=800&q=88', alt: 'Lush green houseplant in a bright room' },
  { src: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=800&q=88', alt: 'Botanical leaves in soft natural light' },
  { src: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=800&q=88', alt: 'Potted plant on a quiet shelf' },
  { src: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=88', alt: 'Green plants growing in a garden' },
]

const TestimonialsSocial = () => (
  <section className="bg-ivory py-20 sm:py-28">
    <Container>
      <div className="border-b border-forest/15 pb-10 text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">Kind words from our community</p>
        <h2 className="mt-4 font-display text-5xl leading-none text-forest sm:text-6xl">Testimonials</h2>
        <p className="mt-3 text-xs uppercase tracking-[0.18em] text-forest/45">What people are saying about us</p>
      </div>

      <div className="relative mx-auto grid max-w-5xl gap-10 py-12 md:grid-cols-2 md:gap-20">
        <button type="button" aria-label="Previous testimonial" className="absolute -left-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-forest/30 text-forest transition hover:bg-sage md:-left-12"><ChevronLeft size={15} strokeWidth={1.2} /></button>
        {testimonials.map(({ quote, author, detail }) => (
          <blockquote key={author} className="border-b border-forest/55 pb-4 text-center md:text-left">
            <p className="font-display text-xl leading-[1.2] text-forest/80">“{quote}”</p>
            <footer className="mt-4 flex flex-wrap justify-center gap-x-2 text-[9px] italic tracking-[0.08em] text-gold md:justify-start">
              <cite className="not-italic">{author}</cite><span>/</span><span>{detail}</span>
            </footer>
          </blockquote>
        ))}
        <button type="button" aria-label="Next testimonial" className="absolute -right-2 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full border border-forest/30 text-forest transition hover:bg-sage md:-right-12"><ChevronRight size={15} strokeWidth={1.2} /></button>
      </div>

      <div className="pt-4 text-center">
        <h2 className="font-display text-5xl leading-none text-forest sm:text-6xl">Follow Us</h2>
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-2 text-xs text-forest/55 transition hover:text-fern"><Camera size={13} strokeWidth={1.3} /> @edenflora</a>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-1 sm:grid-cols-4">
        {socialImages.map(({ src, alt }) => (
          <a key={src} href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="group relative aspect-square overflow-hidden bg-sage">
            <img src={src} alt={alt} className="h-full w-full object-cover grayscale-[0.08] transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
            <span className="absolute right-3 top-3 grid size-7 place-items-center bg-ivory/80 text-forest opacity-0 transition group-hover:opacity-100"><Camera size={13} strokeWidth={1.4} /></span>
          </a>
        ))}
      </div>
    </Container>
  </section>
)

export default TestimonialsSocial
