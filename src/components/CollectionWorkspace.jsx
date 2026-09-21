import { Bot, Check, Copy, FileText, Plus, Share2, Upload, UserPlus, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../utils/api'
import { AiStatus, NoteAI, PlantHealthScan, ReadmeAction } from './CollectionAI'

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

const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])
const isImageFile = (file) => imageTypes.has(file.type)

const CollectionWorkspace = () => {
  const { user } = useAuth()
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [emails, setEmails] = useState({})
  const [active, setActive] = useState({})
  const [notes, setNotes] = useState({})
  const [attachments, setAttachments] = useState({})
  const [previews, setPreviews] = useState({})
  const [scanImages, setScanImages] = useState({})
  const [titles, setTitles] = useState({})
  const [drafts, setDrafts] = useState({})
  const [analytics, setAnalytics] = useState({ projects: 0, notes: 0, files: 0, careUpdates: 0 })
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('Ask about watering, light, yellow leaves, or a care plan.')
  const [message, setMessage] = useState('')
  const [editingNote, setEditingNote] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [deletingNote, setDeletingNote] = useState(null)
  const [editingProject] = useState(null)
  const [projectName] = useState('')
  const [projectDescription] = useState('')
  const [confirmAction] = useState(null)
  const setEditingProject = () => {}
  const setProjectName = () => {}
  const setProjectDescription = () => {}
  const setConfirmAction = () => {}
  const saveProject = () => {}
  const runProjectAction = () => {}

  const loadAnalytics = () => api.get('/api/dashboard/analytics').then((response) => setAnalytics(response.data)).catch(() => {})

  useEffect(() => {
    if (!user) return
    api.get('/api/projects').then((response) => setProjects(response.data.projects || response.data || [])).catch((error) => setMessage(error.response?.data?.message || 'Could not load your collections. Please sign in again.')).finally(() => setProjectsLoading(false))
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
    } catch (error) { setMessage(error.response?.data?.message || 'Could not create the collection.') }
  }

  const openProject = async (projectId) => {
    setActive((current) => ({ ...current, [projectId]: !current[projectId] }))
    if (notes[projectId]) return
    try {
      const [notesResponse, filesResponse] = await Promise.all([api.get(`/api/projects/${projectId}/notes`), api.get(`/api/projects/${projectId}/attachments`)])
      setNotes((current) => ({ ...current, [projectId]: notesResponse.data.notes }))
      setAttachments((current) => ({ ...current, [projectId]: filesResponse.data.attachments }))
      setPreviews((current) => ({ ...current, ...Object.fromEntries(filesResponse.data.attachments.filter((file) => file.url).map((file) => [file._id, file.url])) }))
    } catch { setMessage('Could not load this collection.') }
  }

  const addMember = async (projectId) => {
    try {
      const response = await api.post(`/api/projects/${projectId}/members`, { email: emails[projectId] })
      setProjects((current) => current.map((project) => project._id === projectId ? { ...project, members: [...project.members, response.data.member] } : project))
      setMessage('Member added to this collection.')
      setEmails((current) => ({ ...current, [projectId]: '' }))
      setMessage('Member added to this collection.')
    } catch (error) { setMessage(error.response?.data?.message || 'Could not add that member.') }
  }

  const toggleSharing = async (project) => {
    try {
      const response = await api.patch(`/api/projects/${project._id}/sharing`, { enabled: !project.isPublic })
      setProjects((current) => current.map((item) => item._id === project._id ? { ...item, ...response.data } : item))
      if (response.data.isPublic) {
        await navigator.clipboard?.writeText(`${window.location.origin}/shared/project/${response.data.shareToken}`)
        setMessage('Public link copied. Private notes and files stay hidden.')
      } else setMessage('Public sharing turned off.')
    } catch (error) { setMessage(error.response?.data?.message || 'Could not update sharing.') }
  }

  const copyProjectLink = async (project) => {
    const link = `${window.location.origin}/shared/project/${project.shareToken}`
    try { await navigator.clipboard.writeText(link) } catch { const fallback = document.createElement('textarea'); fallback.value = link; document.body.appendChild(fallback); fallback.select(); document.execCommand('copy'); fallback.remove() }
    setMessage('Public project link copied.')
  }

  const saveNote = async (projectId) => {
    try {
      const response = await api.post(`/api/projects/${projectId}/notes`, { title: titles[projectId], content: drafts[projectId] })
      setNotes((current) => ({ ...current, [projectId]: [response.data.note, ...(current[projectId] || [])] }))
      setTitles((current) => ({ ...current, [projectId]: '' }))
      setDrafts((current) => ({ ...current, [projectId]: '' }))
      setMessage('Collection note saved.')
      loadAnalytics()
    } catch (error) { setMessage(error.response?.data?.message || 'Could not save the note.') }
  }

  const deleteNote = async (projectId, noteId) => {
    try {
      await api.delete(`/api/projects/${projectId}/notes/${noteId}`)
      setNotes((current) => ({ ...current, [projectId]: current[projectId].filter((note) => note._id !== noteId) }))
      setMessage('Collection note deleted.')
      loadAnalytics()
    } catch (error) { setMessage(error.response?.data?.message || 'Could not delete the note.') }
  }

  const updateNote = async (event) => {
    event.preventDefault()
    if (!editingNote || !editTitle.trim() || !editContent.trim()) return
    try {
      const response = await api.patch(`/api/projects/${editingNote.projectId}/notes/${editingNote.note._id}`, { title: editTitle, content: editContent })
      setNotes((current) => ({ ...current, [editingNote.projectId]: current[editingNote.projectId].map((item) => item._id === editingNote.note._id ? response.data.note : item) }))
      setEditingNote(null)
      setMessage('Collection note updated.')
      loadAnalytics()
    } catch (error) { setMessage(error.response?.data?.message || 'Could not update the note.') }
  }

  useEffect(() => {
    const editHandler = (event) => {
      for (const [projectId, projectNotes] of Object.entries(notes)) {
        const note = projectNotes.find((item) => item.content === event.detail.content)
        if (!note) continue
        setEditingNote({ projectId, note })
        setEditTitle(note.title)
        setEditContent(note.content)
        return
      }
    }
    const deleteHandler = (event) => {
      for (const [projectId, projectNotes] of Object.entries(notes)) {
        const note = projectNotes.find((item) => item.content === event.detail.content)
        if (note) return setDeletingNote({ projectId, note })
      }
    }
    window.addEventListener('note:edit', editHandler)
    window.addEventListener('note:delete', deleteHandler)
    return () => {
      window.removeEventListener('note:edit', editHandler)
      window.removeEventListener('note:delete', deleteHandler)
    }
  }, [notes])

  const uploadFile = async (projectId, event) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const data = String(reader.result)
        const response = await api.post(`/api/projects/${projectId}/attachments`, { name: file.name, type: file.type, data })
        const attachment = response.data.attachment
        setAttachments((current) => ({ ...current, [projectId]: [attachment, ...(current[projectId] || [])] }))
        setPreviews((current) => ({ ...current, [attachment._id]: file.type.startsWith('image/') ? data : attachment.url }))
        if (file.type.startsWith('image/')) setScanImages((current) => ({ ...current, [attachment._id]: data }))
        setMessage('File added to the collection.')
        loadAnalytics()
      } catch (error) { setMessage(error.response?.data?.message || 'Could not upload that file.') }
    }
    reader.readAsDataURL(file)
  }

  const askAssistant = async (event) => {
    event.preventDefault()
    if (!question.trim()) return
    const submittedQuestion = question.trim()
    setQuestion('')
    try { const response = await api.post('/api/ai/ask', { question: submittedQuestion }); setAnswer(`You: ${submittedQuestion}\n\nAssistant: ${response.data.answer}`) } catch (error) { setAnswer(`You: ${submittedQuestion}\n\nAssistant: ${error.response?.data?.message || 'The care assistant is unavailable right now.'}`) }
  }

  if (!user) return <section className="mt-20 rounded-4xl border border-forest/10 bg-sage/45 p-8 text-center"><h2 className="font-display text-4xl text-forest">Make collections together.</h2><p className="mt-3 text-sm text-forest/60">Sign in to create a collection and share plant care with everyone at home.</p><Link to="/login" className="mt-6 inline-flex rounded-full bg-forest px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-ivory">Sign in</Link></section>

  return <section className="collection-workspace mt-20 rounded-4xl bg-sage px-5 py-10 sm:px-8 sm:py-14">
    <div className="flex flex-wrap items-end justify-between gap-5"><div><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">Projects, care, and shared access</p><h2 className="mt-3 font-display text-4xl text-forest sm:text-5xl">Your living collections.</h2></div><p className="max-w-sm text-sm leading-6 text-forest/60">Create a shared plant space, keep its journal, upload care files, and invite the people who tend it with you.</p></div>
    <section className="mt-8 rounded-2xl bg-[#1d3c2b] p-6 text-ivory"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#dce7b5]">Contribution analytics</p><div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">{[['Projects', analytics.projects], ['Notes', analytics.notes], ['Files', analytics.files], ['Care updates', analytics.careUpdates]].map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4"><p className="text-2xl font-semibold text-[#dce7b5]">{value}</p><p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-ivory/60">{label}</p></div>)}</div></section>
    <form onSubmit={createProject} className="mt-8 grid gap-3 rounded-2xl border border-forest/10 bg-white/70 p-5 shadow-sm md:grid-cols-[1fr_1.4fr_auto]"><input value={name} onChange={(event) => setName(event.target.value)} placeholder="Collection name" required className="rounded-xl border border-forest/15 bg-ivory px-4 py-3 text-sm outline-none focus:border-fern" /><input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Example: Plants for our family home" className="rounded-xl border border-forest/15 bg-ivory px-4 py-3 text-sm outline-none focus:border-fern" /><button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-forest px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-ivory"><Plus size={15} /> Create collection</button></form>
    {message ? <p className="mt-3 text-xs text-fern">{message}</p> : null}
    <div className="mt-7 grid gap-5 md:grid-cols-2">{projectsLoading ? <div className="h-48 animate-pulse rounded-2xl border border-forest/10 bg-white/60" /> : projects.length ? projects.map((project) => {
      const projectNotes = notes[project._id] || []
      const projectFiles = attachments[project._id] || []
      return <article key={project._id} className="rounded-2xl border border-forest/10 bg-white p-6 shadow-[0_18px_40px_rgba(27,58,42,0.06)]"><div className="flex items-start justify-between gap-3"><div><p className="text-[9px] font-bold uppercase tracking-[0.17em] text-gold">Garden project</p><h3 className="mt-2 font-display text-2xl text-forest">{project.name}</h3><p className="mt-1 text-xs text-forest/55">{project.description || 'A shared plant collection.'}</p></div><div className="flex items-center gap-2"><span className="rounded-full bg-gold/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-gold">{project.members.length} members</span>{project.ownerId === user.id ? <button type="button" onClick={() => toggleSharing(project)} aria-label="Toggle public sharing" className={`grid size-8 place-items-center rounded-lg border ${project.isPublic ? 'border-fern bg-sage text-fern' : 'border-forest/15 text-forest/60'}`}><Share2 size={14} /></button> : null}</div></div>{project.isPublic && project.shareToken ? <div className="mt-4 flex items-center gap-2 rounded-lg border border-fern/20 bg-sage/50 p-2"><input readOnly value={`${window.location.origin}/shared/project/${project.shareToken}`} aria-label="Public project link" className="min-w-0 flex-1 bg-transparent px-2 text-[10px] text-fern outline-none" /><button type="button" onClick={() => copyProjectLink(project)} aria-label="Copy public project link" className="grid size-8 shrink-0 place-items-center rounded-md bg-forest text-ivory"><Copy size={14} /></button></div> : null}<div className="mt-4 flex flex-wrap gap-2">{project.members.map((member) => <span key={member.userId} className="rounded-full border border-forest/10 bg-ivory px-2.5 py-1 text-[10px] text-forest/65">{member.name} · {member.role}</span>)}</div>{project.ownerId === user.id ? <div className="mt-4 flex gap-2"><input value={emails[project._id] || ''} onChange={(event) => setEmails((current) => ({ ...current, [project._id]: event.target.value }))} placeholder="Family member email" className="min-w-0 flex-1 rounded-lg border border-forest/15 bg-ivory px-3 py-2 text-xs outline-none focus:border-fern" /><button type="button" onClick={() => addMember(project._id)} aria-label="Add member" className="grid size-9 place-items-center rounded-lg bg-forest text-ivory"><UserPlus size={14} /></button></div> : null}<div className="mt-4 flex flex-wrap items-center gap-3"><button type="button" onClick={() => openProject(project._id)} className="text-[10px] font-bold uppercase tracking-[0.14em] text-fern">{active[project._id] ? 'Close shared space' : 'Open shared space'} ↗</button><ReadmeAction project={project} notes={projectNotes} attachments={projectFiles} stats={analytics} /></div>{active[project._id] ? <div className="mt-5 border-t border-forest/10 pt-4"><div className="mb-3 flex flex-wrap gap-2"><AiStatus>Explain available</AiStatus>{projectFiles.some(isImageFile) ? <AiStatus>Plant scan ready</AiStatus> : null}<AiStatus>README available</AiStatus></div><input value={titles[project._id] || ''} onChange={(event) => setTitles((current) => ({ ...current, [project._id]: event.target.value }))} placeholder="Care note title" className="w-full rounded-lg border border-forest/15 bg-ivory px-3 py-2 text-xs outline-none focus:border-fern" /><textarea value={drafts[project._id] || ''} onChange={(event) => setDrafts((current) => ({ ...current, [project._id]: event.target.value }))} placeholder="## Watering plan\n- Check soil every Sunday" rows={4} className="mt-3 w-full rounded-lg border border-forest/15 bg-ivory px-3 py-2 text-xs leading-5 outline-none focus:border-fern" /><div className="flex items-start justify-between gap-3"><MarkdownPreview content={drafts[project._id] || '*Preview*'} /><div className="shrink-0 text-right"><NoteAI content={drafts[project._id] || ''} /><button type="button" onClick={() => saveNote(project._id)} className="mt-2 rounded-lg bg-forest px-3 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-ivory">Save note</button></div></div><div className="mt-4 space-y-2">{projectNotes.map((note) => <article key={note._id} className="rounded-lg border border-forest/10 bg-ivory p-3"><h4 className="text-xs font-semibold text-forest">{note.title}</h4><MarkdownPreview content={note.content} /><NoteAI content={note.content} saved /><p className="mt-2 text-[9px] text-forest/45">By {note.author.name}</p></article>)}</div><div className="mt-5 border-t border-forest/10 pt-4"><div className="flex items-center justify-between"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gold">Collection files</p><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-forest/15 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-fern"><Upload size={13} /> Upload<input type="file" accept="image/jpeg,image/png,image/webp,application/pdf,text/plain,text/markdown,text/javascript,text/css,application/json" onChange={(event) => uploadFile(project._id, event)} className="sr-only" /></label></div><div className="mt-3 space-y-2">{projectFiles.map((file) => <div key={file._id} className="rounded-lg border border-forest/10 bg-ivory p-3"><div className="flex items-center gap-2 text-xs font-semibold text-forest"><FileText size={14} /> {file.name}</div>{previews[file._id] && isImageFile(file) ? <img src={previews[file._id]} alt={file.name} className="mt-3 max-h-48 rounded-lg object-contain" /> : null}{isImageFile(file) && !scanImages[file._id] ? <button type="button" onClick={() => setScanImages((current) => ({ ...current, [file._id]: previews[file._id] }))} className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-fern/25 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-fern">🌿 Explain Image</button> : null}{scanImages[file._id] ? <PlantHealthScan image={scanImages[file._id]} onClose={() => setScanImages((current) => { const next = { ...current }; delete next[file._id]; return next })} /> : null}{previews[file._id] && !isImageFile(file) ? <a href={previews[file._id]} download={file.name} className="mt-2 block text-[10px] text-fern">Download file</a> : null}</div>)}</div></div></div> : null}</article>
    }) : <p className="text-sm text-forest/55">No collections yet. Create your first shared garden above.</p>}</div>
    <section className="mt-5 rounded-2xl border border-forest/10 bg-white/70 p-6"><div className="flex items-center gap-3"><Bot size={20} className="text-fern" /><h3 className="font-display text-2xl italic text-forest">Ask the plant assistant</h3></div><form onSubmit={askAssistant} className="mt-4 flex flex-col gap-3 sm:flex-row"><input value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Why are my leaves turning yellow?" className="min-w-0 flex-1 rounded-xl border border-forest/15 bg-ivory px-4 py-3 text-sm outline-none focus:border-fern" /><button type="submit" className="rounded-xl bg-forest px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-ivory">Ask</button></form><p className="mt-4 whitespace-pre-line text-sm leading-6 text-forest/65">{answer}</p></section>
    {editingProject || confirmAction ? <div className="fixed inset-0 z-50 grid place-items-center bg-forest/50 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && (setEditingProject(null), setConfirmAction(null))}>
      <div className="w-full max-w-lg rounded-2xl border border-forest/10 bg-ivory p-6 text-forest shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title"><div className="flex items-start gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Project management</p><h2 id="project-dialog-title" className="mt-2 font-display text-3xl">{editingProject ? 'Edit project' : 'Confirm action'}</h2></div><button type="button" onClick={() => { setEditingProject(null); setConfirmAction(null) }} aria-label="Close project dialog" className="ml-auto grid size-9 place-items-center rounded-full border border-forest/10 text-forest/60"><X size={16} /></button></div>{editingProject ? <form onSubmit={saveProject} className="mt-6 space-y-4"><label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-forest/60">Project name<input value={projectName} onChange={(event) => setProjectName(event.target.value)} required maxLength={100} className="mt-2 w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-sm outline-none focus:border-fern" /></label><label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-forest/60">Description<textarea value={projectDescription} onChange={(event) => setProjectDescription(event.target.value)} maxLength={500} rows={4} className="mt-2 w-full resize-y rounded-xl border border-forest/15 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-fern" /></label><div className="flex justify-end gap-2"><button type="button" onClick={() => setEditingProject(null)} className="rounded-xl border border-forest/15 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em]">Cancel</button><button type="submit" className="rounded-xl bg-forest px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-ivory">Save changes</button></div></form> : <div className="mt-5"><p className="text-sm leading-6 text-forest/65">{confirmAction?.type === 'delete-project' ? `Delete project “${confirmAction?.label}” and its notes and files?` : `Remove ${confirmAction?.label} from this project?`}</p><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setConfirmAction(null)} className="rounded-xl border border-forest/15 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em]">Cancel</button><button type="button" onClick={runProjectAction} className="rounded-xl bg-red-700 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white">Confirm</button></div></div>}</div>
    </div> : null}
    {editingNote || deletingNote ? <div className="fixed inset-0 z-50 grid place-items-center bg-forest/50 p-4 backdrop-blur-sm" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && (setEditingNote(null), setDeletingNote(null))}>
      <div className="w-full max-w-lg rounded-2xl border border-forest/10 bg-ivory p-6 text-forest shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="note-dialog-title">
        <div className="flex items-start gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Collection journal</p><h2 id="note-dialog-title" className="mt-2 font-display text-3xl">{editingNote ? 'Edit this note' : 'Delete this note?'}</h2></div><button type="button" onClick={() => { setEditingNote(null); setDeletingNote(null) }} aria-label="Close note dialog" className="ml-auto grid size-9 place-items-center rounded-full border border-forest/10 text-forest/60 hover:bg-sage hover:text-forest"><X size={16} /></button></div>
        {editingNote ? <form onSubmit={updateNote} className="mt-6 space-y-4"><label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-forest/60">Title<input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} required maxLength={120} className="mt-2 w-full rounded-xl border border-forest/15 bg-white px-4 py-3 text-sm outline-none focus:border-fern" /></label><label className="block text-[10px] font-bold uppercase tracking-[0.14em] text-forest/60">Content<textarea value={editContent} onChange={(event) => setEditContent(event.target.value)} required maxLength={10000} rows={6} className="mt-2 w-full resize-y rounded-xl border border-forest/15 bg-white px-4 py-3 text-sm leading-6 outline-none focus:border-fern" /></label><div className="flex justify-end gap-2"><button type="button" onClick={() => setEditingNote(null)} className="rounded-xl border border-forest/15 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-forest/70">Cancel</button><button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-forest px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-ivory"><Check size={14} /> Save changes</button></div></form> : <div className="mt-5"><p className="text-sm leading-6 text-forest/65">This will permanently remove “{deletingNote?.note.title}” from the collection journal.</p><div className="mt-6 flex justify-end gap-2"><button type="button" onClick={() => setDeletingNote(null)} className="rounded-xl border border-forest/15 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-forest/70">Cancel</button><button type="button" onClick={async () => { const pending = deletingNote; setDeletingNote(null); await deleteNote(pending.projectId, pending.note._id) }} className="rounded-xl bg-red-700 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-white">Delete note</button></div></div>}
      </div>
    </div> : null}
  </section>
}

export default CollectionWorkspace
