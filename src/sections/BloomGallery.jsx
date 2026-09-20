import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, BookOpen, ChevronLeft, ChevronRight, X } from 'lucide-react'
import Container from '../components/Container'

const chapters = [
  {
    id: 'pink-garden-notes',
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=88',
    alt: 'A pink garden in soft afternoon light',
    eyebrow: 'The colour study',
    title: 'Pink garden notes',
    summary: 'A gentle study in rose tones, morning light, and the slow joy of a blooming border.',
    body: 'The softest corners of a garden often feel unplanned. Pink petals gather in low light, and every stem seems to lean a little toward the next warm hour. A thoughtful garden is full of these quiet transitions: the first bloom opening, the new leaf unfurling, the moment a room begins to feel alive again.',
  },
  {
    id: 'blooms-worth-lingering-over',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=88',
    alt: 'A close look at fresh seasonal flowers',
    eyebrow: 'The flower edit',
    title: 'Blooms worth lingering over',
    summary: 'Fresh seasonal stems, layered colours, and arrangements that feel as considered as a room.',
    body: 'There is a kind of beauty that asks for a moment longer. A bouquet with texture, a few unexpected tones, a vase placed just where the light settles. These are the details that turn a simple arrangement into a daily ritual of noticing.',
  },
  {
    id: 'table-set-with-flowers',
    image: 'https://images.unsplash.com/photo-1469259943454-aa100abba749?auto=format&fit=crop&w=1200&q=88',
    alt: 'An artful seasonal flower arrangement',
    eyebrow: 'The gathering',
    title: 'A table set with flowers',
    summary: 'A table becomes more memorable when it carries something living, bright, and quietly generous.',
    body: 'A little abundance can reshape an ordinary evening. A cluster of stems in the centre of the table, a single bloom beside a dish, a colour story that echoes the food and the room around it. The right arrangement does not shout; it settles in and makes the whole space feel more complete.',
  },
  {
    id: 'wild-rose-bloom',
    image: 'https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=1200&q=88',
    alt: 'Soft pink roses in a garden in the afternoon',
    eyebrow: 'The greenhouse',
    title: 'A slow bloom at dusk',
    summary: 'The evening hour reveals the most tender colours and the quietest mood in the garden.',
    body: 'At dusk, the garden slows down and the colours soften. What seemed sharp in midday becomes layered and generous, as if the whole space is exhaling. It is a perfect reminder that plant care is not about forcing growth; it is about creating conditions for beauty to arrive in its own time.',
  },
  {
    id: 'garden-lanterns',
    image: 'https://images.unsplash.com/photo-1470509037663-253afd7f0f51?auto=format&fit=crop&w=1200&q=88',
    alt: 'Fresh flowers arranged for a warm botanical vignette',
    eyebrow: 'The still life',
    title: 'Sunlit petals and quiet rituals',
    summary: 'A room feels softer, steadier, and a little more considered when flowers are allowed to be part of the ritual.',
    body: 'An arrangement does not need to be extravagant to feel significant. A modest gathering of stems, placed in the glow of afternoon light, can shift the mood of an entire home. It becomes a tiny act of care, one that returns attention to the present moment and the pleasures of everyday living.',
  },
]

const ChapterReader = ({ chapter, onClose }) => (
  <AnimatePresence>
    {chapter && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 grid place-items-center bg-forest/60 p-4 backdrop-blur-sm"
        onMouseDown={(event) => event.target === event.currentTarget && onClose()}
      >
        <motion.article
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.98 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-4xl overflow-hidden rounded-[1.5rem_4rem_1.5rem_4rem] bg-[#f9f5ee] shadow-2xl"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chapter"
            className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full bg-ivory text-forest shadow-sm transition hover:bg-gold sm:right-6 sm:top-6"
          >
            <X size={16} />
          </button>

          <div className="grid md:grid-cols-2">
            <div className="min-h-[320px] bg-sage/35">
              <img src={chapter.image} alt={chapter.alt} className="h-full w-full object-cover" />
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8 md:p-10">
              <div>
                <span className="inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.22em] text-gold">
                  <BookOpen size={14} /> {chapter.eyebrow}
                </span>
                <h3 className="mt-6 font-display text-4xl leading-[0.95] text-forest sm:text-5xl">{chapter.title}</h3>
                <p className="mt-4 text-sm leading-6 text-forest/65">{chapter.summary}</p>
                <p className="mt-6 text-sm leading-7 text-forest/70">{chapter.body}</p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-8 inline-flex items-center gap-2 self-start text-[10px] font-bold uppercase tracking-[0.18em] text-fern transition hover:text-forest"
              >
                Back to the journal <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </motion.article>
      </motion.div>
    )}
  </AnimatePresence>
)

const BloomGallery = () => {
  const railRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeChapter, setActiveChapter] = useState(null)

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return

    const cards = rail.querySelectorAll('article')
    if (!cards.length) return

    const gap = Number.parseFloat(getComputedStyle(rail).gap) || 16
    const firstCard = cards[0]
    const step = firstCard.offsetWidth + gap
    rail.scrollTo({ left: activeIndex * step, behavior: 'smooth' })
  }, [activeIndex])

  const goTo = (nextIndex) => {
    setActiveIndex((nextIndex + chapters.length) % chapters.length)
  }

  return (
    <>
      <section className="bg-sage/35 py-24 sm:py-32">
        <Container>
          <div className="border-b border-forest/15 pb-8 text-center">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.26em] text-gold">
              <BookOpen size={14} /> Volume one
            </span>
            <h2 className="mt-4 font-display text-5xl leading-none text-forest sm:text-6xl">The Eden Journal</h2>
            <p className="mt-4 text-sm text-forest/55">Flower stories, greenhouse rituals, and things worth keeping.</p>
          </div>

          <div className="relative mx-auto mt-7 max-w-5xl">
            <button
              type="button"
              data-cursor-label="Previous"
              onClick={() => goTo(activeIndex - 1)}
              aria-label="Previous journal stories"
              className="absolute -left-12 top-[42%] z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-forest/25 bg-ivory text-forest shadow-sm transition hover:bg-gold"
            >
              <ChevronLeft size={17} />
            </button>

            <div
              ref={railRef}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {chapters.map(({ id, image, alt, eyebrow, title }, index) => (
                <article
                  key={id}
                  tabIndex={0}
                  role="button"
                  onClick={() => setActiveChapter(chapters[index])}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      setActiveChapter(chapters[index])
                    }
                  }}
                  className="min-w-[82%] cursor-pointer snap-center sm:min-w-[46%] lg:min-w-[calc((100%-2rem)/3)]"
                >
                  <div className="overflow-hidden rounded-[1rem_3rem_1rem_3rem] bg-ivory p-2 shadow-[0_12px_30px_rgba(27,58,42,0.08)]">
                    <img
                      src={image}
                      alt={alt}
                      className="aspect-square w-full rounded-[0.75rem_2.6rem_0.75rem_2.6rem] object-cover"
                    />
                  </div>
                  <div className="px-2 pt-5 text-center">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-gold">
                      Chapter 0{index + 1} / {eyebrow}
                    </p>
                    <h3 className="mt-3 font-display text-2xl leading-none text-forest">{title}</h3>
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setActiveChapter(chapters[index])
                      }}
                      className="mt-4 inline-flex border-b border-gold pb-1 text-[9px] font-bold uppercase tracking-[0.18em] text-fern"
                    >
                      Open chapter
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              data-cursor-label="Next"
              onClick={() => goTo(activeIndex + 1)}
              aria-label="Next journal stories"
              className="absolute -right-12 top-[42%] z-10 grid size-9 -translate-y-1/2 place-items-center rounded-full border border-forest/25 bg-ivory text-forest shadow-sm transition hover:bg-gold"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </Container>
      </section>

      <ChapterReader chapter={activeChapter} onClose={() => setActiveChapter(null)} />
    </>
  )
}

export default BloomGallery
