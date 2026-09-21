import { useEffect, useState } from 'react'
import { Check, ChevronDown, ChevronUp, Clipboard, Download, FileCode2, FileText, ImagePlus, LoaderCircle, Pencil, Sparkles, Trash2, X } from 'lucide-react'
import api from '../utils/api'

const ResultCard = ({ title, children, onClose, badge = 'Gemini' }) => <div className="mt-3 animate-[vault-scroll-pulse_0.8s_ease-out] rounded-xl border border-fern/20 bg-[#f7fbf2] p-4 text-forest shadow-sm"><div className="flex items-center gap-2"><p className="mr-auto text-[10px] font-bold uppercase tracking-[0.14em] text-gold">{title}</p><span className="rounded-full bg-forest px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-ivory">{badge}</span>{onClose ? <button type="button" onClick={onClose} aria-label="Close AI result" className="grid size-6 place-items-center rounded-full border border-forest/10 text-forest/60 hover:text-forest"><X size={13} /></button> : null}</div>{children}</div>

const LoadingResult = () => <div className="mt-3 flex items-center gap-2 text-xs text-forest/60"><LoaderCircle size={14} className="animate-spin" /> Analyzing image...</div>
const imageData = async (image) => {
  if (image.startsWith('data:image/')) return image
  const response = await fetch(image)
  if (!response.ok) throw new Error('The uploaded image could not be loaded.')
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('The uploaded image could not be prepared for analysis.'))
    reader.readAsDataURL(blob)
  })
}

export const NoteAI = ({ content, saved = false }) => {
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [open, setOpen] = useState(false)

  const explain = async () => {
    if (!content.trim()) return setError('Add text to this note first.')
    setOpen(true)
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/api/ai/explain', { content: content.trim() })
      setAnswer(response.data.answer)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not explain this note.')
    } finally {
      setLoading(false)
    }
  }

  if (!content.trim()) return null
  const noteActions = saved ? <div className="mt-2 flex gap-2"><button type="button" onClick={() => window.dispatchEvent(new CustomEvent('note:edit', { detail: { content } }))} className="inline-flex items-center gap-1 rounded-lg border border-forest/15 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-fern"><Pencil size={12} /> Edit</button><button type="button" onClick={() => window.dispatchEvent(new CustomEvent('note:delete', { detail: { content } }))} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-red-700"><Trash2 size={12} /> Delete</button></div> : null
  return <div className={saved ? 'mt-3' : 'mt-3 rounded-lg border border-fern/15 bg-sage/35 p-3'}><button type="button" onClick={explain} disabled={loading} className="inline-flex items-center gap-2 rounded-lg border border-fern/25 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-fern transition hover:bg-sage disabled:cursor-wait disabled:opacity-60"><Sparkles size={13} /> {loading ? 'Explaining...' : 'Explain note'}</button>{noteActions}{open ? <ResultCard title="AI explanation" onClose={() => setOpen(false)}>{loading ? <LoadingResult /> : error ? <p className="mt-3 text-xs text-red-700">{error}</p> : <p className="mt-3 whitespace-pre-line text-xs leading-6 text-forest/75">{answer}</p>}</ResultCard> : null}</div>
}

export const PlantHealthScan = ({ image, onClose }) => {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const scan = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/api/ai/image', { image: await imageData(image) })
      setResult(response.data.answer)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not scan this plant image.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false
    imageData(image).then((imageContent) => api.post('/api/ai/image', { image: imageContent })).then((response) => { if (!cancelled) setResult(response.data.answer) }).catch((requestError) => { if (!cancelled) setError(requestError.response?.data?.message || requestError.message || 'Could not scan this plant image.') }).finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [image])

  return <ResultCard title="Plant condition summary" onClose={onClose} badge="Gemini vision"><img src={image} alt="Plant uploaded for condition analysis" className="mt-3 h-28 w-full rounded-lg border border-forest/10 bg-white object-contain p-1" /><div className="min-w-0">{loading ? <LoadingResult /> : error ? <div><p className="text-xs text-red-700">{error}</p><button type="button" onClick={scan} className="mt-3 rounded-lg bg-forest px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-ivory">Try scan again</button></div> : <div className="mt-3 whitespace-pre-line text-xs leading-5 text-forest/75">{result}</div>}</div></ResultCard>
}

const codeTypes = ['.js', '.jsx', '.ts', '.html', '.css', '.py']
export const isCodeFile = (name) => codeTypes.includes(name.slice(name.lastIndexOf('.')).toLowerCase())
export const CodeAI = ({ file, content }) => {
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  if (!isCodeFile(file.name)) return null

  const explain = async () => {
    if (!content.trim()) {
      setError('This file could not be read. Try downloading it and checking that it contains code.')
      setOpen(true)
      return
    }
    setOpen(true)
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/api/ai/docs', { content })
      setAnswer(response.data.answer)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not explain this code right now.')
    } finally {
      setLoading(false)
    }
  }
  return <div className="mt-2"><button type="button" onClick={explain} disabled={loading} className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-fern hover:text-forest disabled:opacity-60"><FileCode2 size={13} /> {loading ? 'Explaining...' : 'Explain code'} {open ? <ChevronUp size={12} /> : <ChevronDown size={12} />}</button>{open ? <div className="mt-2 rounded-lg border border-fern/15 bg-white p-3 text-xs leading-5 text-forest/70">{loading ? <LoadingResult /> : error ? <p className="text-red-700">{error}</p> : answer || 'No explanation returned.'}</div> : null}</div>
}

export const ReadmeAction = ({ project, notes = [], attachments = [], stats }) => {
  const [readme, setReadme] = useState('')
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const content = [`Project name: ${project.name}`, `Description: ${project.description || 'Shared plant collection.'}`, `Created: ${project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'Date not available'}`, `Members (${project.members?.length || 0}):\n${project.members?.map((member) => `- ${member.name} (${member.role})`).join('\n') || '- No members listed.'}`, `Notes (${notes.length}):\n${notes.map((note) => `### ${note.title || 'Untitled note'}\n${note.content}`).join('\n\n') || '- No notes yet.'}`, `Files (${attachments.length}):\n${attachments.map((file) => `- ${file.name} (${file.type}, ${file.size ? `${Math.round(file.size / 1024)} KB` : 'size unavailable'})`).join('\n') || '- No files yet.'}`, `Statistics: ${stats.projects || 1} project, ${stats.notes ?? notes.length} notes, ${stats.files ?? attachments.length} files, ${stats.careUpdates ?? 0} care updates`].join('\n\n')

  const generate = async () => {
    setOpen(true)
    setLoading(true)
    try {
      const response = await api.post('/api/ai/readme', { content })
      setReadme(response.data.answer)
    } catch {
      setReadme(`# ${project.name}\n\n## Overview\n${project.description || 'A shared plant collection.'}\n\n## Members\n${project.members?.map((member) => `- ${member.name} (${member.role})`).join('\n') || '- No members listed.'}\n\n## Notes\n${notes.map((note) => `### ${note.title || 'Untitled note'}\n${note.content}`).join('\n\n') || 'No notes have been added yet.'}\n\n## Files\n${attachments.map((file) => `- ${file.name} (${file.type})`).join('\n') || 'No files have been uploaded yet.'}\n\n> README generation is temporarily unavailable. The project details above were generated locally.`)
    } finally {
      setLoading(false)
    }
  }
  const copy = async () => { await navigator.clipboard?.writeText(readme); setCopied(true); window.setTimeout(() => setCopied(false), 1500) }
  const download = () => { const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([readme], { type: 'text/markdown' })); link.download = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'eden-flora-project'}.md`; link.click(); URL.revokeObjectURL(link.href) }

  return <><button type="button" onClick={generate} disabled={loading} className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-fern hover:text-forest disabled:opacity-60"><FileText size={13} /> {loading ? 'Generating...' : 'Generate README'}</button>{open ? <div className="fixed inset-0 z-50 grid place-items-center bg-forest/30 p-5" role="dialog" aria-modal="true"><div className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-2xl bg-ivory p-6 text-forest shadow-2xl"><div className="flex items-center gap-3"><h3 className="font-display text-2xl">{project.name} README</h3><button type="button" onClick={() => setOpen(false)} aria-label="Close README" className="ml-auto grid size-8 place-items-center rounded-full border border-forest/15"><X size={15} /></button></div>{loading ? <LoadingResult /> : <pre className="mt-5 whitespace-pre-wrap rounded-xl border border-forest/10 bg-white p-4 text-xs leading-6">{readme}</pre>}<div className="mt-4 flex flex-wrap gap-2">{readme ? <><button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-lg bg-forest px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-ivory"><Clipboard size={13} /> {copied ? 'Copied' : 'Copy'}</button><button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-lg border border-forest/15 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-forest"><Download size={13} /> Download .md</button></> : null}<button type="button" onClick={generate} disabled={loading} className="rounded-lg border border-forest/15 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-forest">Regenerate</button></div></div></div> : null}</>
}

export const AiStatus = ({ children }) => <span className="inline-flex items-center gap-1 rounded-full bg-sage px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-fern"><Check size={11} /> {children}</span>

export const ScanIcon = ImagePlus
export const AiLoader = LoaderCircle
