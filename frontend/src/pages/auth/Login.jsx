import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login, googleLogin } from '../../api/auth.api.js' 
import { GoogleLogin } from '@react-oauth/google'
import Logo from '../../components/ui/Logo.jsx'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setLoading(true)
    try {
      const token = credentialResponse.credential
      await googleLogin(token) 
      navigate('/dashboard')
    } catch (err) {
      setError('Google Sign-In failed on the server.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-white dark:bg-slate-950 transition-colors">
      {/* Left Decoration Panel - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900 dark:bg-slate-900 shadow-2xl">
        {/* Geometric Background Elements */}
        <div className="absolute inset-0 z-0 opacity-40">
          <svg className="w-full h-full" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 0.2 }} />
                <stop offset="100%" style={{ stopColor: '#1e40af', stopOpacity: 0.5 }} />
              </linearGradient>
            </defs>
            <path d="M0,0 L800,0 L800,800 L0,800 Z" fill="#0f172a" />
            <polygon points="0,0 400,0 200,800 0,800" fill="url(#grad1)" />
            <circle cx="600" cy="200" r="300" fill="#3b82f6" opacity="0.1" />
            <path d="M400,0 Q600,400 300,800" stroke="#3b82f6" strokeWidth="2" fill="none" opacity="0.2" />
            <polygon points="500,100 700,300 600,600" fill="#1e40af" opacity="0.2" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-16 w-full text-white">
          <div className="flex items-center select-none">
            <Logo size="lg" />
          </div>

          <div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">Manage your<br/><span className="text-blue-500">properties</span> with<br/>absolute ease.</h2>
            <p className="text-xl text-slate-400 max-w-md">Everything you need to track tenants, payments, and maintenance in one professional portal.</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>© 2026 MyTenant Platform</span>
            <span className="w-1h-1 bg-slate-700 rounded-full"></span>
            <span>Premium Property Management</span>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center select-none">
            <Logo size="md" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome back</h1>
          <p className="text-gray-500 dark:text-slate-400 mb-8 font-medium">Please enter your details to sign in.</p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 text-red-700 dark:text-red-400 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Username</label>
              <input
                id="username"
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white transition-all font-medium"
                placeholder=""
                required
              />
            </div>
            <div>
              <label htmlFor="password" title="password" className="block text-sm font-semibold text-gray-700 dark:text-slate-300 mb-1.5">Password</label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-white transition-all font-medium"
                placeholder=""
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Sign in'}
            </button>
          </form>

          <div className="relative flex items-center py-8">
            <div className="grow border-t border-gray-100 dark:border-slate-800"></div>
            <span className="shrink-0 mx-4 text-gray-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">Or login with</span>
            <div className="grow border-t border-gray-100 dark:border-slate-800"></div>
          </div>

          <div className="flex justify-center w-full">
            <GoogleLogin 
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google Sign-In failed.')}
              theme="outline"
              size="large"
              width="100%"
            />
          </div>

          <p className="mt-10 text-center text-sm text-gray-500 dark:text-slate-400">
            New to MyTenant?{' '}
            <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-bold">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}