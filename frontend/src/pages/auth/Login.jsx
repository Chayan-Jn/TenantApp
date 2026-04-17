import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login, googleLogin } from '../../api/auth.api.js' 
import { GoogleLogin } from '@react-oauth/google'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Standard Login
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

  // Google Login Handler
  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setLoading(true)
    try {
      // Send the Google token to your backend
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-950 px-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-8 transition-colors">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Welcome back</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6 transition-colors">Sign in to your account</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400 text-sm rounded-lg transition-colors">
            {error}
          </div>
        )}

        {/* Traditional Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Username</label>
            <input
              id="username"
              type="text"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 transition-colors"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 transition-colors">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-200 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center py-6">
          <div className="grow border-t border-gray-200 dark:border-slate-700 transition-colors"></div>
          <span className="shrink-0 mx-4 text-gray-400 dark:text-gray-500 text-sm transition-colors">Or continue with</span>
          <div className="grow border-t border-gray-200 dark:border-slate-700 transition-colors"></div>
        </div>

        {/* Google Button */}
        <div className="flex justify-center w-full">
          <GoogleLogin 
            onSuccess={handleGoogleSuccess}
            onError={() => setError('Google Sign-In popup closed or failed.')}
            theme="outline"
            size="large"
            width="100%"
          />
        </div>

        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">Register</Link>
        </p>
      </div>
    </div>
  )
}