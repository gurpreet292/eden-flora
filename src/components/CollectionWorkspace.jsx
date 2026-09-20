import { Bot, Copy, FileText, Plus, Share2, Upload, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'

const MarkdownPreview = ({ content }) => (
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

const CollectionWorkspace = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [emails, setEmails] = useState({})
  const [active, setActive] = useState(null)
  const [notes, setNotes] = useState({})
  const [attachments, setAttachments] = useState({})
  const [previews, setPreviews] = useState({})
  const [titles, setTitles] = useState({})
  const [drafts, setDrafts] = useState({})
  const [analytics, setAnalytics] = useState({ projects: 0, notes: 0, files: 0, careUpdates: 0 })
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('Ask about watering, light, yellow leaves, or a care plan.')
  const [message, setMessage] = useState('')

  const loadAnalytics = () => api.get('/api/dashboard/analytics').then((response) => setAnalytics(response.data)).catch(() => {})

  useEffect(() => {
    if (!user) return
    api.get('/api/projects').then((response) => setProjects(response.data.projects)).catch(() => setProjects([]))
    loadAnalytics()
  }, [user])

  const createProject = async (event) => {
    event.preventDefault()
    try {
      const response = await api.post('/api/projects', { name, description })
      setProjects((current) => [response.data.project, ...current])
      setName('')
      setDescription('')
      setMessage('Shared collection created.')
      loadAnalytics()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not create the collection.')
    }
  }

  const openProject = async (projectId) => {
    setActive(active === projectId ? null : projectId)
    if (notes[projectId]) return
    try {
      const [notesResponse, filesResponse] = await Promise.all([
        api.get(`/api/projects/${projectId}/notes`),
        api.get(`/api/projects/${projectId}/attachments`),
      ])
      setNotes((current) => ({ ...current, [projectId]: notesResponse.data.notes }))
      setAttachments((current) => ({ ...current, [projectId]: filesResponse.data.attachments }))
      setPreviews((current) => ({
        ...current,
        ...Object.fromEntries(filesResponse.data.attachments.filter((file) => file.url).map((file) => [file._id, file.url])),
      }))
    } catch {
      setMessage('Could not load this collection.')
    }
  }

  const addMember = async (projectId) => {
    try {
      const response = await api.post(`/api/projects/${projectId}/members`, { email: emails[projectId] })
      setProjects((current) => current.map((project) => project._id === projectId ? { ...project, members: [...project.members, response.data.member] } : project))
      setEmails((current) => ({ ...current, [projectId]: '' }))
      setMessage('Member added to this collection.')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not add that member.')
    }
  }

  const toggleSharing = async (project) => {
    try {
      const response = await api.patch(`/api/projects/${project._id}/sharing`, { enabled: !project.isPublic })
      setProjects((current) => current.map((item) => item._id === project._id ? { ...item, ...response.data } : item))
      if (response.data.isPublic) {
        await navigator.clipboard?.writeText(`${window.location.origin}/shared/project/${response.data.shareToken}`)
        setMessage('Public link copied. Private notes and files stay hidden.')
      } else {
        setMessage('Public sharing turned off.')
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update sharing.')
    }
  }

  const copyProjectLink = async (project) => {
    const link = `${window.location.origin}/shared/project/${project.shareToken}`
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      const fallback = document.createElement('textarea')
      fallback.value = link
      document.body.appendChild(fallback)
      fallback.select()
      document.execCommand('copy')
      fallback.remove()
    }
    setMessage('Public project link copied.')
  }

  const saveNote = async (projectId) => {
    try {
      const response = await api.post(`/api/projects/${projectId}/notes`, { title: titles[projectId], content: drafts[projectId] })
      setNotes((current) => ({ ...current, [projectId]: [response.data.note, ...(current[projectId] || [])] }))
      setTitles((current) => ({ ...current, [projectId]: '' }))
      setDrafts((current) => ({ ...current, [projectId]: '' }))
      window.dispatchEvent(new CustomEvent('gemini:note', { detail: { content: response.data.note.content } }))
      setMessage('Collection note saved.')
      loadAnalytics()
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not save the note.')
    }
  }

  const uploadFile = async (projectId, event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const response = await api.post(`/api/projects/${projectId}/attachments`, { name: file.name, type: file.type, data: reader.result })
        setAttachments((current) => ({ ...current, [projectId]: [response.data.attachment, ...(current[projectId] || [])] }))
        setPreviews((current) => ({ ...current, [response.data.attachment._id]: response.data.attachment.url }))
        window.dispatchEvent(new CustomEvent('gemini:image', { detail: { image: reader.result } }))
        setMessage('File added to the collection.')
        loadAnalytics()
      } catch (error) {
        setMessage(error.response?.data?.message || 'Could not upload that file.')
      }
    }
    reader.readAsDataURL(file)
  }

  const askAssistant = async (event) => {
    event.preventDefault()
    if (!question.trim()) return
    const submittedQuestion = question.trim()
    setQuestion('')
    try {
      const response = await api.post('/api/ai/ask', { question: submittedQuestion })
      setAnswer(`You: ${submittedQuestion}\n\nAssistant: ${response.data.answer}`)
    } catch (error) {
      setAnswer(`You: ${submittedQuestion}\n\nAssistant: ${error.response?.data?.message || 'The care assistant is unavailable right now.'}`)
    }
  }

  if (!user) return <section className="mt-20 rounded-[2rem] border border-forest/10 bg-sage/45 p-8 text-center"><h2 className="font-display text-4xl text-forest">Make collections together.</h2><p className="mt-3 text-sm text-forest/60">Sign in to create a collection and share plant care with everyone at home.</p><Link to="/login" className="mt-6 inline-flex rounded-full bg-forest px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-ivory">Sign in</Link></section>

  return <section className="collection-workspace mt-20 rounded-[2rem] bg-[#eef4ea] px-5 py-10 sm:px-8 sm:py-14">
    <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Projects, care, and shared access</p><h2 className="mt-3 font-display text-4xl text-forest sm:text-5xl">Your living collections.</h2></div><p className="max-w-sm text-sm leading-6 text-forest/60">Create a shared plant space, keep its journal, upload care files, and invite the people who tend it with you.</p></div>
    <section className="mt-8 rounded-2xl bg-[#1d3c2b] p-6 text-ivory"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#dce7b5]">Contribution analytics</p><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{[['Projects', analytics.projects], ['Notes', analytics.notes], ['Files', analytics.files], ['Care updates', analytics.careUpdates]].map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-semibold text-[#dce7b5]">{value}</p><p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-ivory/60">{label}</p></div>)}</div>{analytics.contributors?.length ? <div className="mt-5 border-t border-white/10 pt-4"><p className="text-[10px] uppercase tracking-[0.14em] text-ivory/60">User contribution summary</p><div className="mt-3 space-y-2">{analytics.contributors.map((contributor) => <div key={contributor.name} className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs"><span>{contributor.name}</span><span className="text-[#dce7b5]">{contributor.total} contributions</span></div>)}</div></div> : null}</section>
    <form onSubmit={createProject} className="mt-8 grid gap-3 rounded-2xl border border-forest/10 bg-white/70 p-5 shadow-sm md:grid-cols-[1fr_1.4fr_auto]"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Collection name" required className="rounded-xl border border-forest/15 bg-ivory px-4 py-3 text-sm outline-none focus:border-fern" /><input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Example: Plants for our family home" className="rounded-xl border border-forest/15 bg-ivory px-4 py-3 text-sm outline-none focus:border-fern" /><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-ivory"><Plus size={15} /> Create collection</button></form>
    {message ? <p className="mt-3 text-xs text-fern">{message}</p> : null}
    <div className="mt-7 grid gap-5 md:grid-cols-2">{projects.length ? projects.map((project) => <article key={project._id} className="rounded-2xl border border-forest/10 bg-white p-6 shadow-[0_18px_40px_rgba(27,58,42,0.06)]"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[0.17em] text-gold">Garden project</p><h3 className="mt-2 font-display text-2xl text-forest">{project.name}</h3><p className="mt-1 text-xs text-forest/55">{project.description || 'A shared plant collection.'}</p></div><div className="flex items-center gap-2"><span className="rounded-full bg-gold/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-gold">{project.members.length} members</span>{project.ownerId === user.id ? <button type="button" onClick={() => toggleSharing(project)} aria-label="Toggle public sharing" className={`grid size-8 place-items-center rounded-lg border ${project.isPublic ? 'border-fern bg-sage text-fern' : 'border-forest/15 text-forest/60'}`}><Share2 size={14} /></button> : null}</div></div>{project.isPublic && project.shareToken ? <div className="mt-4 flex items-center gap-2 rounded-lg border border-fern/20 bg-sage/50 p-2"><input readOnly value={`${window.location.origin}/shared/project/${project.shareToken}`} aria-label="Public project link" className="min-w-0 flex-1 bg-transparent px-2 text-[10px] text-fern outline-none" /><button type="button" onClick={() => copyProjectLink(project)} aria-label="Copy public project link" className="grid size-8 shrink-0 place-items-center rounded-md bg-forest text-ivory"><Copy size={14} /></button></div> : null}<div className="mt-4 flex flex-wrap gap-2">{project.members.map((member) => <span key={member.userId} className="rounded-full border border-forest/10 bg-ivory px-2.5 py-1 text-[10px] text-forest/65">{member.name} · {member.role}</span>)}</div>{project.ownerId === user.id ? <div className="mt-4 flex gap-2"><input value={emails[project._id] || ''} onChange={(event) => setEmails((current) => ({ ...current, [project._id]: event.target.value }))} placeholder="Family member email" className="min-w-0 flex-1 rounded-lg border border-forest/15 bg-ivory px-3 py-2 text-xs outline-none focus:border-fern" /><button type="button" onClick={() => addMember(project._id)} aria-label="Add member" className="grid size-9 place-items-center rounded-lg bg-forest text-ivory"><UserPlus size={14} /></button></div> : null}<button type="button" onClick={() => openProject(project._id)} className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] text-fern">{active === project._id ? 'Close shared space' : 'Open shared space'} ↗</button>{active === project._id ? <div className="mt-5 border-t border-forest/10 pt-4"><input value={titles[project._id] || ''} onChange={(event) => setTitles((current) => ({ ...current, [project._id]: event.target.value }))} placeholder="Care note title" className="w-full rounded-lg border border-forest/15 bg-ivory px-3 py-2 text-xs outline-none focus:border-fern" /><textarea value={drafts[project._id] || ''} onChange={(event) => setDrafts((current) => ({ ...current, [project._id]: event.target.value }))} placeholder="## Watering plan\n- Check soil every Sunday" rows={4} className="mt-3 w-full rounded-lg border border-forest/15 bg-ivory px-3 py-2 text-xs leading-5 outline-none focus:border-fern" /><div className="flex items-center justify-between gap-3"><MarkdownPreview content={drafts[project._id] || '*Preview*'} /><button type="button" onClick={() => saveNote(project._id)} className="shrink-0 rounded-lg bg-forest px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-ivory">Save note</button></div><div className="mt-4 space-y-2">{(notes[project._id] || []).map((note) => <article key={note._id} className="rounded-lg border border-forest/10 bg-ivory p-3"><h4 className="text-xs font-semibold text-forest">{note.title}</h4><MarkdownPreview content={note.content} /><p className="mt-2 text-[9px] text-forest/45">By {note.author.name}</p></article>)}</div><div className="mt-5 border-t border-forest/10 pt-4"><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold">Collection files</p><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-forest/15 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-fern"><Upload size={13} /> Upload<input type="file" accept="image/jpeg,image/png,image/webp,application/pdf,text/plain,text/markdown,text/javascript,text/css,application/json" onChange={(event) => uploadFile(project._id, event)} className="sr-only" /></label></div><div className="mt-3 space-y-2">{(attachments[project._id] || []).map((file) => <div key={file._id} className="rounded-lg border border-forest/10 bg-ivory p-3"><div className="flex items-center gap-2 text-xs font-semibold text-forest"><FileText size={14} /> {file.name}</div>{previews[file._id] && file.type.startsWith('image/') ? <img src={previews[file._id]} alt={file.name} className="mt-3 max-h-48 rounded-lg object-contain" /> : null}{previews[file._id] && !file.type.startsWith('image/') ? <a href={previews[file._id]} download={file.name} className="mt-2 block text-[10px] text-fern">Download file</a> : null}</div>)}</div></div></div> : null}</article>) : <p className="text-sm text-forest/55">No collections yet. Create your first shared garden above.</p>}</div>
    <section className="mt-5 rounded-2xl border border-forest/10 bg-white/70 p-6"><div className="flex items-center gap-3"><Bot size={20} className="text-fern" /><h3 className="font-display text-2xl italic text-forest">Ask the plant assistant</h3></div><form onSubmit={askAssistant} className="mt-4 flex flex-col gap-3 sm:flex-row"><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Why are my leaves turning yellow?" className="min-w-0 flex-1 rounded-xl border border-forest/15 bg-ivory px-4 py-3 text-sm outline-none focus:border-fern" /><button type="submit" className="rounded-xl bg-forest px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-ivory">Ask</button></form><p className="mt-4 text-sm leading-6 text-forest/65">{answer}</p></section>
  </section>
}
export default CollectionWorkspace
