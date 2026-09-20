import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import axios from 'axios'

const ResetPasswordPage = () => {
  const location = useLocation()
  const tokenFromUrl = useMemo(() => new URLSearchParams(location.search).get('token') || '', [location.search])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const isResetMode = Boolean(tokenFromUrl)

  const handleRequestReset = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post('/api/auth/request-reset', { email })
      setMessage(response.data.message)
      setEmail('')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to send reset instructions right now.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordReset = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!tokenFromUrl) {
      setError('This reset link is missing a valid token.')
      return
    }

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      setError('Password must be at least 8 characters and include a letter and a number.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post('/api/auth/reset-password', { token: tokenFromUrl, password })
      setMessage(response.data.message)
      setPassword('')
      setConfirmPassword('')
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to reset your password right now.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7f1e3_0%,_#edf5ef_38%,_#edf0e7_100%)] pb-20 pt-28 text-forest">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-forest/10 bg-white/80 p-6 shadow-[0_35px_90px_rgba(27,58,42,0.12)] backdrop-blur md:p-10">
        <div className="mb-8 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
          <ShieldCheck size={16} /> Secure access
        </div>

        <h1 className="font-display text-4xl italic text-forest md:text-5xl">
          {isResetMode ? 'Reset your password' : 'Forgot your password?'}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-7 text-forest/65">
          {isResetMode
            ? 'Create a new password to regain access to your Eden Flora account.'
            : 'Enter the email you used for your account and we will send reset instructions.'}
        </p>

        {message && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <CheckCircle2 size={18} className="mt-0.5" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {isResetMode ? (
          <form onSubmit={handlePasswordReset} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-forest/60">New password</span>
              <div className="flex items-center rounded-full border border-forest/15 bg-[#f7f3ed] px-4 py-3">
                <KeyRound size={16} className="mr-3 text-forest/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  minLength={8}
                  className="w-full bg-transparent text-sm text-forest outline-none placeholder:text-forest/35"
                  placeholder="Enter a strong password"
                />
                <button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="ml-2 text-forest/50 hover:text-fern">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-forest/60">Confirm password</span>
              <div className="flex items-center rounded-full border border-forest/15 bg-[#f7f3ed] px-4 py-3">
                <KeyRound size={16} className="mr-3 text-forest/50" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                  className="w-full bg-transparent text-sm text-forest outline-none placeholder:text-forest/35"
                  placeholder="Re-enter your password"
                />
                <button type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'} className="ml-2 text-forest/50 hover:text-fern">
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </label>

            <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ivory transition hover:bg-fern disabled:cursor-not-allowed disabled:opacity-70">
              {isLoading ? 'Updating...' : 'Reset password'}
              {!isLoading && <ArrowRight size={15} />}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRequestReset} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-forest/60">Email address</span>
              <div className="flex items-center rounded-full border border-forest/15 bg-[#f7f3ed] px-4 py-3">
                <Mail size={16} className="mr-3 text-forest/50" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full bg-transparent text-sm text-forest outline-none placeholder:text-forest/35"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <button type="submit" disabled={isLoading} className="flex w-full items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-ivory transition hover:bg-fern disabled:cursor-not-allowed disabled:opacity-70">
              {isLoading ? 'Sending...' : 'Send reset link'}
              {!isLoading && <ArrowRight size={15} />}
            </button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-forest/65">
          Return to{' '}
          <Link to="/login" className="font-semibold text-fern underline-offset-4 hover:underline">sign in</Link>
        </p>
      </div>
    </main>
  )
}

export default ResetPasswordPage
