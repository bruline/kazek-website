import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

function getYouTubeEmbedUrl(url) {
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

function Recordings() {
  const [session, setSession] = useState(null)
  const [checkingSession, setCheckingSession] = useState(true)
  const [recordings, setRecordings] = useState([])
  const [loading, setLoading] = useState(true)
  const [schoolFilter, setSchoolFilter] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        navigate('/student-login')
        return
      }
      setSession(data.session)
      setCheckingSession(false)
    }
    checkSession()
  }, [navigate])

  useEffect(() => {
    if (!session) return

    async function fetchRecordings() {
      const { data, error } = await supabase
        .from('lecture_recordings')
        .select('*')
        .order('recording_date', { ascending: false })

      if (error) {
        console.error('Error fetching recordings:', error)
      } else {
        setRecordings(data)
      }
      setLoading(false)
    }

    fetchRecordings()
  }, [session])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/student-login')
  }

  if (checkingSession || loading) {
    return <p className="text-center py-20 text-gray-500">Loading recordings...</p>
  }

  const filtered = schoolFilter
    ? recordings.filter((r) => r.school_name === schoolFilter)
    : recordings

  const schoolOptions = [...new Set(recordings.map((r) => r.school_name))]

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-blue-700">Recorded Lectures</h1>
        <button onClick={handleLogout} className="text-sm text-gray-500 hover:underline">
          Log out
        </button>
      </div>

      <select
        className="border rounded px-3 py-2 text-sm mb-6"
        value={schoolFilter}
        onChange={(e) => setSchoolFilter(e.target.value)}
      >
        <option value="">All Schools</option>
        {schoolOptions.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      {filtered.length === 0 && (
        <p className="text-gray-500 text-center py-10">No recordings available yet.</p>
      )}

      <div className="space-y-8">
        {filtered.map((rec) => {
          const embedUrl = getYouTubeEmbedUrl(rec.youtube_url)
          return (
            <div key={rec.id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="font-semibold text-gray-800">{rec.title}</h2>
              <p className="text-sm text-gray-500 mb-3">
                {rec.school_name} · {rec.program_name} · {rec.specialization_name}
                {rec.course_name ? ` · ${rec.course_name}` : ''} · {rec.recording_date}
              </p>
              {embedUrl ? (
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full rounded"
                    src={embedUrl}
                    title={rec.title}
                    allowFullScreen
                  />
                </div>
              ) : (
                <p className="text-red-600 text-sm">Invalid video link.</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Recordings