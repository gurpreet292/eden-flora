import { useEffect, useState } from 'react'
import { Bot, FileText, ImagePlus, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const tools = [
  { key: 'explain', label: 'Explain note', placeholder: 'Write or paste your plant-care note...' },
  { key: 'image', label: 'Explain image', placeholder: 'Optional context: what changed, when it started, and how you care for the plant...' },
  { key: 'readme', label: 'Generate README', placeholder: 'Paste the project description, notes, and setup details...' },
]

const GeminiProjectTools = () => {
  const { user } = useAuth()
  const [tool, setTool] = useState('explain')
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const noteListener = (event) => { setTool('explain'); setContent(event.detail.content); setAnswer(''); setError('') }
    const imageListener = (event) => { setTool('image'); setImage(event.detail.image); setAnswer(''); setError('') }
    window.addEventListener('gemini:note', noteListener)
    window.addEventListener('gemini:image', imageListener)
    return () => { window.removeEventListener('gemini:note', noteListener); window.removeEventListener('gemini:image', imageListener) }
  }, [])

  if (!user) return null

  const chooseTool = (nextTool) => {
    setTool(nextTool)
    setAnswer('')
    setError('')
  }

  const runTool = async (event) => {
    event.preventDefault()
    if (tool === 'image' && !image) return setError('Upload a plant image first.')
    if (tool !== 'image' && !content.trim()) return setError('Add some content first.')
    setLoading(true)
    setError('')
    setAnswer('')
    try {
      const payload = tool === 'image' ? { image, context: content } : { content: content.trim() }
      const response = await api.post(`/api/ai/${tool}`, payload)
      setAnswer(response.data.answer)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'The Gemini tool is unavailable.')
    } finally {
      setLoading(false)
    }
  }

  const readImage = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return setError('Use a JPEG, PNG, or WebP image.')
    if (file.size > 3 * 1024 * 1024) return setError('Images must be smaller than 3 MB.')
    const reader = new FileReader()
    reader.onload = () => { setImage(String(reader.result)); setError('') }
    reader.readAsDataURL(file)
  }

  const activeTool = tools.find((item) => item.key === tool)

  return <section className="mx-auto mt-8 max-w-6xl rounded-[2rem] border border-forest/10 bg-[#f7f4ea] p-6 text-forest shadow-[0_20px_60px_rgba(27,58,42,0.06)] sm:p-8"><div className="flex items-start gap-3"><div className="grid size-10 shrink-0 place-items-center rounded-xl bg-forest text-[#dce7b5]"><Bot size={18} /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Gemini project tools</p><h2 className="mt-2 font-display text-3xl">Your note, image, and README assistant.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-forest/60">Use the same project workspace to understand care notes, inspect visible plant symptoms, or document the collection.</p></div></div><div className="mt-6 flex flex-wrap gap-2">{tools.map(({ key, label }) => <button key={key} type="button" onClick={() => chooseTool(key)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] transition ${tool === key ? 'border-forest bg-forest text-ivory' : 'border-forest/15 text-forest/65 hover:border-fern'}`}>{key === 'image' ? <ImagePlus size={13} /> : key === 'explain' ? <Sparkles size={13} /> : <FileText size={13} />}{label}</button>)}</div><form onSubmit={runTool} className="mt-4">{tool === 'image' ? <><label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-fern/40 bg-white px-4 py-4 text-sm text-forest/70 hover:border-fern"><ImagePlus size={18} className="text-fern" /><span>{image ? 'Plant image ready. Choose another image' : 'Upload a plant image'}</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={readImage} className="sr-only" /></label>{image ? <img src={image} alt="Plant selected for Gemini analysis" className="mt-3 max-h-48 rounded-xl object-contain" /> : null}</> : null}<textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder={activeTool.placeholder} rows={5} className="mt-3 w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-fern" /><button type="submit" disabled={loading} className="mt-3 rounded-xl bg-forest px-5 py-3 text-[10px] font-bold uppercase tracking-[0.14em] text-ivory disabled:opacity-50">{loading ? 'Working...' : activeTool.label}</button></form>{error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}{answer ? <div className="mt-5 whitespace-pre-wrap rounded-xl border border-fern/15 bg-white p-5 text-sm leading-7 text-forest/75"><p className="mb-2 text-[9px] font-bold uppercase tracking-[0.16em] text-gold">Eden Flora result</p>{answer}</div> : null}</section>
}

export default GeminiProjectTools
