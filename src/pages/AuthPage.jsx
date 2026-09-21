import { useEffect, useState } from 'react'
import { ArrowRight, Leaf, LockKeyhole, Mail, Sparkles } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import api from '../utils/api'

const initialForm = { name: '', email: '', password: '', confirmPassword: '' }

const AuthPage = ({ mode = 'login' }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const isRegister = mode === 'register'

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('eden-flora-user')
      if (savedUser) {
        navigate('/')
      }
    } catch {
      // ignore
    }
  }, [navigate])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (isRegister && (form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password))) {
      setError('Password must be at least 8 characters and include a letter and a number.')
      return
    }

    if (isRegister && form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
      const payload = isRegister ? { name: form.name, email: form.email, password: form.password } : { email: form.email, password: form.password }
      const response = await api.post(endpoint, payload)

      localStorage.setItem('eden-flora-user', JSON.stringify(response.data.user))
      window.dispatchEvent(new Event('auth:updated'))

      const redirectTarget = location.state?.from || '/'
      navigate(redirectTarget)
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f5efe6_0%,_#eef5ee_35%,_#edf0e7_100%)] px-4 pb-20 pt-28 text-forest sm:px-6">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-[2rem] border border-forest/10 bg-white/80 shadow-[0_30px_90px_rgba(27,58,42,0.12)] backdrop-blur lg:grid-cols-[1.05fr_1.25fr]">
        <div className="relative overflow-hidden bg-[#1d3c2b] px-7 py-10 text-ivory sm:px-9">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(181,203,132,0.28),_transparent_35%)]" />
          <div className="relative z-10">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-ivory/80">
              <Leaf size={12} /> Eden Flora
            </div>
            <h1 className="font-display text-5xl leading-[0.9] text-ivory sm:text-6xl">
              {isRegister ? 'Grow your' : 'Welcome'}<br />
              <span className="italic text-[#dce7b5]">green ritual.</span>
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-ivory/70">
              Track your collection, save favorites, and return to the plants that make your home feel alive.
            </p>

            <div className="mt-10 space-y-4 text-sm text-ivory/80">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Sparkles size={16} className="text-[#dce7b5]" />
                Curated plant care & collection tracking
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <LockKeyhole size={16} className="text-[#dce7b5]" />
                Secure personal access to your account
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-8 sm:px-8 md:px-10 md:py-10">
          <div className="mb-8 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">Access</p>
              <h2 className="mt-2 font-display text-4xl italic text-forest">{isRegister ? 'Create account' : 'Sign in'}</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <label className="block">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-forest/60">Full name</span>
                <div className="flex items-center rounded-full border border-forest/15 bg-[#f7f3ed] px-4 py-3 focus-within:border-gold">
                  <Mail size={16} className="mr-3 text-forest/50" />
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent text-sm text-forest outline-none placeholder:text-forest/35"
                    placeholder="Maya Patel"
                  />
                </div>
              </label>
            )}

            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-forest/60">Email</span>
              <div className="flex items-center rounded-full border border-forest/15 bg-[#f7f3ed] px-4 py-3 focus-within:border-gold">
                <Mail size={16} className="mr-3 text-forest/50" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent text-sm text-forest outline-none placeholder:text-forest/35"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-forest/60">Password</span>
              <div className="flex items-center rounded-full border border-forest/15 bg-[#f7f3ed] px-4 py-3 focus-within:border-gold">
                <LockKeyhole size={16} className="mr-3 text-forest/50" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  className="w-full bg-transparent text-sm text-forest outline-none placeholder:text-forest/35"
                  placeholder="••••••••"
                />
              </div>
            </label>

            {isRegister && (
              <label className="block">
                <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-forest/60">Confirm password</span>
                <div className="flex items-center rounded-full border border-forest/15 bg-[#f7f3ed] px-4 py-3 focus-within:border-gold">
                  <LockKeyhole size={16} className="mr-3 text-forest/50" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent text-sm text-forest outline-none placeholder:text-forest/35"
                    placeholder="Re-enter password"
                  />
                </div>
              </label>
            )}

            {error && <p className="rounded-2xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ivory transition hover:bg-fern disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Please wait...' : isRegister ? 'Create account' : 'Login'}
              {!isLoading && <ArrowRight size={15} />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-forest/65">
            {isRegister ? 'Already have an account?' : 'Need an account?'}{' '}
            <Link to={isRegister ? '/login' : '/register'} className="font-semibold text-fern underline-offset-4 hover:underline">
              {isRegister ? 'Sign in' : 'Create one'}
            </Link>
          </p>

          {!isRegister && (
            <p className="mt-3 text-center text-sm text-forest/65">
              <Link to="/forgot-password" className="font-medium text-forest underline-offset-4 hover:underline">
                Forgot password?
              </Link>
            </p>
          )}
        </div>
      </div>
    </main>
  )
}

export default AuthPage
