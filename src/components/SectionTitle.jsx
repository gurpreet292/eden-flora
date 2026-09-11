const SectionTitle = ({ eyebrow, title, description, align = 'left' }) => (
  <div className={`max-w-2xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
    <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.28em] text-gold">{eyebrow}</p>
    <h2 className="font-display text-5xl leading-[0.95] text-forest sm:text-6xl">{title}</h2>
    {description && <p className="mt-5 max-w-md text-sm leading-7 text-forest/65">{description}</p>}
  </div>
)

export default SectionTitle
