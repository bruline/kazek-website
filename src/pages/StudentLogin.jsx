import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function StudentLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (error) {
      setErrorMsg('Incorrect email or password.')
      return
    }

    navigate('/recordings')
  }

  return (
    <div className="bg-brand-black min-h-[calc(100vh-84px)] flex items-center justify-center px-6">
      <div className="max-w-sm w-full">
        <h1 className="font-display text-2xl font-bold text-white mb-2 text-center">
          Student Login
        </h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          View recorded lectures for your program
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            required
            type="email"
            placeholder="Email"
            className="w-full border border-white/20 bg-white/5 text-white placeholder-gray-500 rounded-md px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            type="password"
            placeholder="Password"
            className="w-full border border-white/20 bg-white/5 text-white placeholder-gray-500 rounded-md px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errorMsg && <p className="text-red-400 text-sm">{errorMsg}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-red text-white py-2 rounded-md font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default StudentLogin