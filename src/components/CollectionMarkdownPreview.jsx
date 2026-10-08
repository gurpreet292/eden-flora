const CollectionMarkdownPreview = ({ content }) => (
  <div className="mt-2 space-y-1 text-[11px] leading-5 text-forest/65">
    {content.split('\n').map((line, index) => {
      const trimmed = line.trim()
      if (trimmed.startsWith('## ')) return <h5 key={index} className="font-semibold text-forest">{trimmed.slice(3)}</h5>
      if (trimmed.startsWith('# ')) return <h4 key={index} className="font-display text-lg text-forest">{trimmed.slice(2)}</h4>
      if (trimmed.startsWith('- ')) return <p key={index}>• {trimmed.slice(2)}</p>
      return <p key={index}>{trimmed || '\u00a0'}</p>
    })}
  </div>
)

export default CollectionMarkdownPreview
