import { useEffect, useState } from 'react'
import { ArrowLeft, Leaf, Users } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import api from '../utils/api'

const PublicProjectPage = () => {
  const { token } = useParams()
  const [project, setProject] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get(`/api/projects/public/${token}`).then((response) => setProject(response.data.project)).catch((requestError) => setError(requestError.response?.data?.message || 'This garden project is unavailable.'))
  }, [token])

  if (error) return <main className="grid min-h-screen place-items-center bg-ivory px-6 text-center text-forest"><div><p className="text-sm text-forest/60">{error}</p><Link to="/" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-fern"><ArrowLeft size={14} /> Eden Flora</Link></div></main>
  if (!project) return <main className="grid min-h-screen place-items-center bg-ivory text-sm text-forest/60">Loading shared garden...</main>

  return <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8f3e8_0%,_#edf5ef_42%,_#ebf1e7_100%)] px-5 py-12 text-forest sm:px-8"><div className="mx-auto max-w-3xl"><Link to="/" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-fern transition hover:text-gold"><ArrowLeft size={14} /> Eden Flora / Public project</Link><section className="mt-12 rounded-[2rem] border border-forest/10 bg-white/80 p-7 shadow-[0_30px_90px_rgba(27,58,42,0.1)] sm:p-12"><p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">A shared garden project</p><h1 className="mt-4 font-display text-5xl italic text-forest sm:text-7xl">{project.name}</h1><p className="mt-6 max-w-xl text-lg leading-8 text-forest/65">{project.description || 'A living collection tended with care.'}</p><div className="mt-10 grid gap-3 border-t border-forest/10 pt-6 sm:grid-cols-2"><div className="flex items-center gap-3 rounded-2xl bg-[#f7f3ed] p-4"><Leaf size={18} className="text-fern" /><span className="text-sm">Shared by <strong>{project.owner}</strong></span></div><div className="flex items-center gap-3 rounded-2xl bg-[#f7f3ed] p-4"><Users size={18} className="text-fern" /><span className="text-sm">{project.memberCount} garden {project.memberCount === 1 ? 'member' : 'members'}</span></div></div><p className="mt-8 text-xs leading-5 text-forest/50">This public view shares the garden’s description only. Private journal notes, files, and account details stay protected.</p><Link to="/" className="mt-6 inline-flex rounded-full border border-forest/15 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-forest transition hover:border-gold">Visit Eden Flora</Link></section></div></main>
}

export default PublicProjectPage
